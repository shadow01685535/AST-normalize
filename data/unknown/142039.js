! ✖ / env;
node;
var fs = require("fs");
var path = require("path");
var exec = require("child_process").exec;
var TIMEOUT = 20000;
var tests = fs.readdirSync(__dirname).filter(function(file)  {
      return ! fs.statSync(path.join(__dirname, file)).isDirectory();
   }
).filter(function(file)  {
      return /^test(-|_|\.).*\.js$/i.test(file);
   }
).sort();
var cnt = 0;
var all = tests.length;
var wid = 1 + 2 * "" + all.length;
var min = function(str)  {
   return str + Array(wid + 1).join(" ").substr(str.length);
}
;
var loop = function()  {
   var next = tests.shift();
   if (! next) return console.log("[32m[ok][39m  all ok")   exec("node " + path.join(__dirname, next),  {
         timeout:TIMEOUT      }, 
      function(err)  {
         cnt++;
         if (err)  {
            console.error("[31m[err][39m " + min(cnt + "/" + all) + " - " + next);
            console.error("
      " + "" + err.stack.split("
").join("
      ") + "
");
            return process.exit(1);
         }
         console.log("[32m[ok][39m  " + min(cnt + "/" + all) + " - " + next);
         setTimeout(loop, 100);
      }
   );
}
;
loop();
