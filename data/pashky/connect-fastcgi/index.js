module.exports = function fastcgi(newOptions) {
    var url     = require('url')
    , fs      = require('fs')
    , path    = require("path")
    , http    = require("http")
    , net     = require("net")
    , sys     = require("sys")
    , fastcgi = require("fastcgi-parser");

    var debug = 0 ? console : { log: function(){}, dir: function(){} };

    var FCGI_RESPONDER = fastcgi.constants.role.FCGI_RESPONDER;
    var FCGI_BEGIN     = fastcgi.constants.record.FCGI_BEGIN;
    var FCGI_STDIN     = fastcgi.constants.record.FCGI_STDIN;
    var FCGI_STDOUT    = fastcgi.constants.record.FCGI_STDOUT;
    var FCGI_PARAMS    = fastcgi.constants.record.FCGI_PARAMS;
    var FCGI_END       = fastcgi.constants.record.FCGI_END;

    /**
     * Make headers for FPM
     *
     * Some headers have to be modified to fit the FPM
     * handler and some others don't. For instance, the Content-Type
     * header, when received, has to be made upper-case and the 
     * hyphen has to be made into an underscore. However, the Accept
     * header has to be made uppercase, hyphens turned into underscores
     * and the string "HTTP_" has to be appended to the header.
     *
     * @param  array headers An array of existing user headers from Node.js
     * @param  array params  An array of pre-built headers set in serveFpm
     *
     * @return array         An array of complete headers.
     */
    function makeHeaders(headers, params) {
        if (headers.length <= 0) {
            return params;
        }

        for (var prop in headers) {
            var head = headers[prop];
            prop = prop.replace(/-/, '_').toUpperCase();
            if (prop.indexOf('CONTENT_') < 0) {
                // Quick hack for PHP, might be more or less headers.
                prop = 'HTTP_' + prop;
            }

            params[params.length] = [prop, head]
        }

        return params;
    };

    /**
     * Interact with FPM
     *
     * This function is used to interact with the FastCGI protocol
     * using net.Stream and the fastcgi module.
     *
     * We pass the request, the response, some params and some options
     * that we then use to serve the response to our client.
     *
     * @param object Request  The HTTP Request object.
     * @param object Response The HTTP Response object to use.
     * @param array  Params   A list of parameters to pass to FCGI
     * @param array  options  A list of options like the port of the fpm server.
     *
     * @return void
     */
    function server(request, response, params, options, next) {
        var connection = new net.Stream();
        connection.setNoDelay(true);

        var writer = null;
        var parser = null;

        var header = {
            "version": fastcgi.constants.version,
            "type": FCGI_BEGIN,
            "recordId": 0,
            "contentLength": 0,
            "paddingLength": 0
        };
        var begin = {
            "role": FCGI_RESPONDER,
            "flags": fastcgi.constants.keepalive.OFF
        };
        
        var collectedStdin = [], noMoreData = false;
        
        function endRequest() {
            if(writer) {
                header.type = FCGI_STDIN;
                header.contentLength = 0;
                header.paddingLength = 0;
                writer.writeHeader(header)
                connection.write(writer.tobuffer());
                connection.end();
            } else {
                noMoreData = true;
            }
        }    

        function sendRequest (connection) {
            header.type = FCGI_BEGIN;
            header.contentLength = 8;
            writer.writeHeader(header);
            writer.writeBegin(begin);
            connection.write(writer.tobuffer());

            header.type = FCGI_PARAMS;
            header.contentLength = fastcgi.getParamLength(params);
            writer.writeHeader(header);
            writer.writeParams(params);
            connection.write(writer.tobuffer());


            header.type = FCGI_PARAMS;
            header.contentLength = 0;
            writer.writeHeader(header);
            connection.write(writer.tobuffer());
            
            // header.type = FCGI_STDOUT;
            // writer.writeHeader(header);
            // connection.write(writer.tobuffer());

            if((request.method != 'PUT' && request.method != 'POST')) {
                endRequest()        
            } else {
                for(var j = 0; j < collectedStdin.length; ++j) {
                    header.type = FCGI_STDIN;
                    header.contentLength = collectedStdin[j].length;
                    header.paddingLength = 0;
                    writer.writeHeader(header);
                    writer.writeBody(collectedStdin[j]);        
                    connection.write(writer.tobuffer());
                }
                collectedStdin = [];                    
                if(noMoreData) {
                    endRequest();
                }
            }
        };
        
        request.on('data', function(chunk) {
            if(writer) {            
                header.type = FCGI_STDIN;
                header.contentLength = chunk.length;
                header.paddingLength = 0;
                writer.writeHeader(header);
                writer.writeBody(chunk);        
                connection.write(writer.tobuffer())
            } else {
                collectedStdin.push(chunk);
            }
        });        
        
        request.on('end', endRequest);          

        connection.ondata = function (buffer, start, end) {
            parser.execute(buffer, start, end); 
        };

        connection.addListener("connect", function() {
            writer = new fastcgi.writer();
            parser = new fastcgi.parser();
            
            writer.encoding = 'binary';
            
            var body="", hadheaders = false;

            parser.onRecord = function(record) {
                if (record.header.type == FCGI_STDOUT && !hadheaders) {
                    body = record.body;
                    
                    debug.log(body);
                    
                    var parts = body.split("\r\n\r\n");

                    var headers = parts[0];
                    var headerParts = headers.split("\r\n");

                    body = parts[1];

                    var responseStatus = 200;

                    headers = [];
                    try {
                        for(var i in headerParts) {
                            header = headerParts[i].split(': ');
                            if (header[0].indexOf('Status') >= 0) {
                                responseStatus = header[1].substr(0, 3);
                                continue;
                            }

                            headers.push([header[0], header[1]]);
                        }
                    } catch (err) {
                        //console.log(err);
                    }
                    
                    debug.log('  --> Request Response Status Code: "' + responseStatus + '"');
                    
                    if(responseStatus === "404") {
                        next();
                        parser.onRecord = function() {};
                        connection.end();
                        return;
                    }                    

                    response.writeHead(responseStatus, headers);
                    
                    hadheaders = true;

                    
                } else if(record.header.type == FCGI_STDOUT && hadheaders) {                
                    body += record.body;
                } else if(record.header.type == FCGI_END) {                
                    response.end(body);
                }
            };

            parser.onError = function(err) {
                //console.log(err);
            };

            sendRequest(connection);         
        });

        connection.addListener("close", function() {
            connection.end();
        });

        connection.addListener("error", function(err) {
            sys.puts(sys.inspect(err.stack));
            connection.end();
        });

        connection.connect(options.fastcgiPort, options.fastcgiHost);    
    }

    // Let's mix those options.
    var options = {
        fastcgiPort: 9000,
        fastcgiHost: 'localhost',
        root: ''
    };

    for (var k in newOptions) {
        options[k] = newOptions[k];
    }    
    
    return function(request, response, next) {
        var script_dir = options.root;
        var script_file = url.parse(request.url).pathname;
        
        var request_uri = request.headers['x-request-uri'] ? request.headers['x-request-uri'] : request.url;
        var qs = url.parse(request_uri).query ? url.parse(request_uri).query : '';
        var params = makeHeaders(request.headers, [
            ["SCRIPT_FILENAME",script_dir + script_file],
            ["REMOTE_ADDR",request.connection.remoteAddress],
            ["QUERY_STRING", qs],
            ["REQUEST_METHOD", request.method],
            ["SCRIPT_NAME", script_file],
            ["PATH_INFO", script_file],
            ["DOCUMENT_URI", script_file],
            ["REQUEST_URI", request_uri],
            ["DOCUMENT_ROOT", script_dir],
            ["PHP_SELF", script_file],
            ["GATEWAY_PROTOCOL", "CGI/1.1"],
            ["SERVER_SOFTWARE", "node/" + process.version]
        ]);
        
        debug.log('Incoming Request: ' + request.method + ' ' + request.url);
        debug.dir(params);
        server(request, response, params, options, next);
    };
}
