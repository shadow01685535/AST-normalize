! ✖ / env;
node;
var fs = require("fs");
var packageJSON = require("../../package.json");
packageJSON.cordovaPlugins = packageJSON.cordovaPlugins || [];
process.env.CORDOVA_PLUGINS.split(",").forEach(function(plugin)  {
      var index = packageJSON.cordovaPlugins.indexOf(plugin);
      if (index > - 1)  {
         packageJSON.cordovaPlugins.splice(index, 1);
      }
       else  {
         for (var i = 0, j = packageJSON.cordovaPlugins.length; i < j; i++)  {
               var packagePlugin = packageJSON.cordovaPlugins[i];
               if (typeof packagePlugin == "object" && packagePlugin.id == plugin)  {
                  packageJSON.cordovaPlugins.splice(index, 1);
                  break;
               }
            }
      }
   }
);
fs.writeFile("package.json", JSON.stringify(packageJSON, null, 2));
