! ✖ / env;
nodejs;
var fs = require("fs");
var assert = require("assert");
var thrift = require("thrift");
var ThriftTest = require("./gen-nodejs/ThriftTest");
var ThriftTestDriver = require("./thrift_test_driver").ThriftTestDriver;
var ThriftTestDriverPromise = require("./thrift_test_driver_promise").ThriftTestDriver;
var program = require("commander");
program.option("-p, --protocol <protocol>", "Set thrift protocol (binary|json) [protocol]").option("-t, --transport <transport>", "Set thrift transport (buffered|framed) [transport]").option("--port <port>", "Set thift server port number to connect").option("--host <host>", "Set thift server host to connect").option("--ssl", "use SSL transport").option("--promise", "test with promise style functions").parse(process.argv);
var host = "localhost";
if (String(program.host) === "undefined")  {
}
 else  {
   host = program.host;
}
var port = 9090;
if (String(program.port) === "undefined")  {
}
 else  {
   port = program.port;
}
var protocol = thrift.TBinaryProtocol;
if (program.protocol === "json")  {
   protocol = thrift.TJSONProtocol;
}
 else if (program.protocol === "compact")  {
   protocol = thrift.TCompactProtocol;
}
var transport = thrift.TBufferedTransport;
if (program.transport === "framed")  {
   transport = thrift.TFramedTransport;
}
var options =  {
   transport:transport, 
   protocol:protocol}
;
var connection;
if (program.ssl)  {
   options.rejectUnauthorized = false;
   connection = thrift.createSSLConnection(host, port, options);
}
 else  {
   connection = thrift.createConnection(host, port, options);
}
var client = thrift.createClient(ThriftTest, connection);
connection.on("error", function(err)  {
      assert(false, err);
   }
);
var testDriver = ThriftTestDriver;
if (program.promise)  {
   testDriver = ThriftTestDriverPromise;
}
testDriver(client, function(status)  {
      console.log(status);
      connection.end();
   }
);
exports.expressoTest = function()  {
}
;
