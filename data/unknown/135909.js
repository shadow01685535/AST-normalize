! ✖ / env;
node;
var fs, esprima, fname, content, options, syntax;
if (typeof require === "function")  {
   fs = require("fs");
   esprima = require("esprima");
}
 else if (typeof load === "function")  {
   try {
      load("esprima.js");
   }
   catch (e) {
      load("../esprima.js");
   }
}
if (typeof console === "undefined" && typeof process === "undefined")  {
   console =  {
      log:print   }
;
   fs =  {
      readFileSync:readFile   }
;
   process =  {
      argv:arguments, 
      exit:quit   }
;
   process.argv.unshift("esparse.js");
   process.argv.unshift("rhino");
}
function showUsage()  {
   console.log("Usage:");
   console.log("   esparse [options] file.js");
   console.log();
   console.log("Available options:");
   console.log();
   console.log("  --comment      Gather all line and block comments in an array");
   console.log("  --loc          Include line-column location info for each syntax node");
   console.log("  --range        Include index-based range for each syntax node");
   console.log("  --raw          Display the raw value of literals");
   console.log("  --tokens       List all tokens in an array");
   console.log("  --tolerant     Tolerate errors on a best-effort basis (experimental)");
   console.log("  -v, --version  Shows program version");
   console.log();
   process.exit(1);
}
;
if (process.argv.length <= 2)  {
   showUsage();
}
options =  {} ;
process.argv.splice(2).forEach(function(entry)  {
      if (entry === "-h" || entry === "--help")  {
         showUsage();
      }
       else if (entry === "-v" || entry === "--version")  {
         console.log("ECMAScript Parser (using Esprima version", esprima.version, ")");
         console.log();
         process.exit(0);
      }
       else if (entry === "--comment")  {
         options.comment = true;
      }
       else if (entry === "--loc")  {
         options.loc = true;
      }
       else if (entry === "--range")  {
         options.range = true;
      }
       else if (entry === "--raw")  {
         options.raw = true;
      }
       else if (entry === "--tokens")  {
         options.tokens = true;
      }
       else if (entry === "--tolerant")  {
         options.tolerant = true;
      }
       else if (entry.slice(0, 2) === "--")  {
         console.log("Error: unknown option " + entry + ".");
         process.exit(1);
      }
       else if (typeof fname === "string")  {
         console.log("Error: more than one input file.");
         process.exit(1);
      }
       else  {
         fname = entry;
      }
   }
);
if (typeof fname !== "string")  {
   console.log("Error: no input file.");
   process.exit(1);
}
function adjustRegexLiteral(key, value)  {
   if (key === "value" && value instanceof RegExp)  {
      value = value.toString();
   }
   return value;
}
;
try {
   content = fs.readFileSync(fname, "utf-8");
   syntax = esprima.parse(content, options);
   console.log(JSON.stringify(syntax, adjustRegexLiteral, 4));
}
catch (e) {
   console.log("Error: " + e.message);
   process.exit(1);
}
