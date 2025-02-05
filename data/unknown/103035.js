! ✖ / env;
node;
process.chdir(__dirname);
var YUITest = require("yuitest"), path = require("path"), fs = require("fs"), dir = path.join(__dirname, "../../../../build-npm/"), YUI = require(dir).YUI, json;
YUI( {
      useSync:true   }
).use("test", function(Y)  {
      Y.Test.Runner = YUITest.TestRunner;
      Y.Test.Case = YUITest.TestCase;
      Y.Test.Suite = YUITest.TestSuite;
      Y.Assert = YUITest.Assert;
      Y.applyConfig( {
            modules: {
               number-tests: {
                  fullpath:path.join(__dirname, "../unit/assets/number-tests.js"), 
                  requires:["test", "datatype-number"]               }}          }
      );
      Y.use("number-tests");
      Y.Test.Runner.setName("number cli tests");
   }
);
