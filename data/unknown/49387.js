! ✖ / env;
node;
var Parser = require("jsonparse"), through = require("through");
exports.parse = function(path, map)  {
   var parser = new Parser();
   var stream = through(function(chunk)  {
         if ("string" === typeof chunk) chunk = new Buffer(chunk)         parser.write(chunk);
      }
   );
   function ✖(data)  {
      if (data) stream.write(data)      stream.queue(null);
   }
;
   if ("string" === typeof path) path = path.split(".").map(function(e)  {
         if (e === "*") return true          else if (e === "") return  {
            recurse:true         }
          else return e      }
   )   var count = 0, _key;
   if (! path || ! path.length) path = null   parser.onValue = function(value)  {
      if (! this.root) stream.root = value      if (! path) return       var i = 0;
      var j = 0;
      while (i < path.length)  {
            var key = path[i];
            var c;
            j++;
            if (key && ! key.recurse)  {
               c = j === this.stack.length ? this : this.stack[j];
               if (! c) return                if (! check(key, c.key)) return                i++;
            }
             else  {
               i++;
               var nextKey = path[i];
               if (! nextKey) return                while (true)  {
                     c = j === this.stack.length ? this : this.stack[j];
                     if (! c) return                      if (check(nextKey, c.key))  {
                        i++;
                        this.stack[j].value = null;
                        break;
                     }
                     j++;
                  }
            }
         }
      if (j !== this.stack.length) return       count++;
      var actualPath = this.stack.slice(1).map(function(element)  {
            return element.key;
         }
      ).concat([this.key]);
      var data = this.value[this.key];
      if (null != data) if (null != data = map ? map(data, actualPath) : data) stream.queue(data)      delete this.value[this.key];
      for (var k in this.stack) this.stack[k].value = null   }
;
   parser._onToken = parser.onToken;
   parser.onToken = function(token, value)  {
      parser._onToken(token, value);
      if (this.stack.length === 0)  {
         if (stream.root)  {
            if (! path) stream.queue(stream.root)            count = 0;
            stream.root = null;
         }
      }
   }
;
   parser.onError = function(err)  {
      if (err.message.indexOf("at position") > - 1) err.message = "Invalid JSON (" + err.message + ")"      stream.emit("error", err);
   }
;
   return stream;
}
;
function check(x, y)  {
   if ("string" === typeof x) return y == x    else if (x && "function" === typeof x.exec) return x.exec(y)    else if ("boolean" === typeof x) return x    else if ("function" === typeof x) return x(y)   return false;
}
;
exports.stringify = function(op, sep, cl, indent)  {
   indent = indent || 0;
   if (op === false)  {
      op = "";
      sep = "
";
      cl = "";
   }
    else if (op == null)  {
      op = "[
";
      sep = "
,
";
      cl = "
]
";
   }
   var stream, first = true, anyData = false;
   stream = through(function(data)  {
         anyData = true;
         var json = JSON.stringify(data, null, indent);
         if (first)  {
            first = false;
            stream.queue(op + json);
         }
          else stream.queue(sep + json)      }
   );
   function ✖(data)  {
      if (! anyData) stream.queue(op)      stream.queue(cl);
      stream.queue(null);
   }
;
   return stream;
}
;
exports.stringifyObject = function(op, sep, cl, indent)  {
   indent = indent || 0;
   if (op === false)  {
      op = "";
      sep = "
";
      cl = "";
   }
    else if (op == null)  {
      op = "{
";
      sep = "
,
";
      cl = "
}
";
   }
   var first = true, anyData = false;
   stream = through(function(data)  {
         anyData = true;
         var json = JSON.stringify(data[0]) + ":" + JSON.stringify(data[1], null, indent);
         if (first)  {
            first = false;
            this.queue(op + json);
         }
          else this.queue(sep + json)      }
   );
   function ✖(data)  {
      if (! anyData) this.queue(op)      this.queue(cl);
      this.queue(null);
   }
;
   return stream;
}
;
if (! module.parent && process.title !== "browser")  {
   process.stdin.pipe(exports.parse(process.argv[2])).pipe(exports.stringify("[", ",
", "]
", 2)).pipe(process.stdout);
}
