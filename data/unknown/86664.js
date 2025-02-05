! ✖ / env;
node;
var sys = require("sys");
var net = require("net");
var BufferList = require("bufferlist");
var Binary = require("bufferlist/binary");
function parser(sock)  {
   var bufferList = new BufferList();
   sock.addListener("data", function(data)  {
         bufferList.push(data);
      }
   );
   return Binary(bufferList).getWord16be("xLen").when("xLen", 0, function(vars)  {
         this.getWord32le("msgLen").getBuffer("msg", "msgLen").tap(function(vars)  {
               vars.moo = "msg:" + vars.msgLen + ":" + vars.msg;
            }
         ).exit();
      }
   ).getBuffer("xs", "xLen").tap(function(vars)  {
         vars.moo = "xs:" + vars.xLen + ":" + vars.xs;
      }
   ).end();
}
;
function serverSession(port, strings)  {
   var server = net.createServer(function(stream)  {
         strings.forEach(function(s)  {
               stream.write(s);
            }
         );
         stream.end();
         server.close();
      }
   );
   server.listen(port);
   var client = new net.Stream();
   parser(client).addListener("end", function(vars)  {
         sys.puts(vars.moo);
         client.end();
      }
   );
   client.connect(port);
}
;
serverSession(20801, ["", "m", "eow"]);
serverSession(20802, ["", "", "ring c", "ats"]);
