! ✖ / env;
jx;
var nopt = require("../lib/nopt"), Stream = require("stream").Stream, path = require("path"), knownOpts =  {
   foo:[String, null], 
   bar:[Stream, Number], 
   baz:path, 
   bloo:["big", "medium", "small"], 
   flag:Boolean, 
   pick:Boolean}
, shortHands =  {
   foofoo:["--foo", "Mr. Foo"], 
   b7:["--bar", "7"], 
   m:["--bloo", "medium"], 
   p:["--pick"], 
   f:["--flag", "true"], 
   g:["--flag"], 
   s:"--flag"}
, parsed = nopt(knownOpts, shortHands, process.argv, 2);
console.log("parsed =
" + require("util").inspect(parsed));
