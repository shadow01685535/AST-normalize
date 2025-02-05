! ✖ / env;
node;
var fs = require("fs");
var path = require("path");
var _ = require("underscore");
var handlebars = require("handlebars");
var bootstrap = require("./bootstrap");
var beezlib = require("beezlib");
var B = ["beez.js", "beez.min.js"];
var V = ["zepto.js", "zepto.min.js", "underscore.js", "underscore-min.js", "backbone.localStorage.js", "backbone.localStorage-min.js", "backbone.js", "backbone-min.js", "handlebars.runtime.js", "handlebars.runtime.min.js", "require.js", "require.min.js"];
var E = ["/bin/foundation", "/bin/build", "/bin/deploy"];
bootstrap.project(function(err)  {
      if (err)  {
         beezlib.logger.error(err);
      }
      var config = bootstrap.config;
      var encode = config.encode;
      var message = bootstrap.message;
      message.files = [];
      message.dirs = [];
      beezlib.logger.debug("[ start ]");
      beezlib.logger.debug("HOME:", config.HOME);
      beezlib.logger.debug("locals:", JSON.stringify(config));
      beezlib.logger.debug("base dir:", config.hbsdir);
      var projectdir = path.normalize(config.output + "/" + config.name);
      beezlib.fsys.mkdirpSync(projectdir, 493);
      beezlib.logger.debug("create project directory:	".info, projectdir);
      message.projectdir = projectdir;
      var project_vendor_dir = path.normalize(projectdir + "/vendor");
      config.project.vendordir = project_vendor_dir;
      beezlib.fsys.mkdirpSync(project_vendor_dir, 493);
      beezlib.logger.debug("mkdir", project_vendor_dir);
      message.files.push("vendor");
      var src, dest;
      _.each(B, function(filename)  {
            src = config.releasedir + "/" + filename;
            dest = project_vendor_dir + "/" + filename;
            fs.writeFileSync(dest, fs.readFileSync(src, encode), encode);
            beezlib.logger.debug("copy", src, "->", dest);
            message.files.push("vendor/" + filename);
         }
      );
      _.each(V, function(filename)  {
            src = config.vendordir + "/" + filename;
            dest = project_vendor_dir + "/" + filename;
            fs.writeFileSync(dest, fs.readFileSync(src, encode), encode);
            beezlib.logger.debug("copy", src, "->", dest);
            message.files.push("vendor/" + filename);
         }
      );
      var templateCopy = function(hbsdir)  {
         beezlib.fsys.walk(hbsdir, function(prefix, dir, file, stats)  {
               var source = path.normalize(dir + "/" + file);
               var destination = path.normalize(config.output + "/" + config.name + "/" + prefix + "/" + file);
               beezlib.logger.debug("copy compile.", source, "->", destination);
               var output;
               if (/(\.png)|(\.jpg)$/.test(source))  {
                  output = fs.readFileSync(source);
                  fs.writeFileSync(destination, output);
                  beezlib.logger.debug("create file:		".info, destination);
                  message.files.push(prefix + "/" + file.replace(/^\//, ""));
                  return ;
               }
               var data = fs.readFileSync(source, encode);
               output = data;
               if (! source.match(/.hbsp?$/))  {
                  var template = handlebars.compile(data);
                  output = template(config);
               }
               fs.writeFileSync(destination, output, encode);
               var filepath = prefix + "/" + file;
               var execfile = _.find(E, function(str)  {
                     return str == filepath;
                  }
               );
               if (execfile)  {
                  fs.chmodSync(destination, 493);
               }
               beezlib.logger.debug("create file:		".info, destination);
               message.files.push(prefix + "/" + file.replace(/^\//, ""));
            }, 
            function(dir, stats)  {
               var destination = path.normalize(config.output + "/" + config.name + "/" + dir);
               if (fs.existsSync(destination))  {
                  return ;
               }
               beezlib.logger.debug("create directory:	".info, destination);
               beezlib.fsys.mkdirpSync(destination, 493);
               message.files.push(dir.replace(/^\//, ""));
            }
         );
      }
;
      templateCopy(config.hbsdir + "/base");
      templateCopy(config.hbsdir + "/" + config.base);
      beezlib.logger.message("Create Project:".green, config.name.silly);
      beezlib.logger.message("");
      beezlib.logger.message("  Project Directory:".green, message.projectdir.silly);
      beezlib.logger.message("");
      beezlib.logger.message("  Create File:".green);
      for (var i = 0; i < message.files.length; i++)  {
            var file = message.files[i].split("/");
            if (2 < file.length)  {
               continue;
            }
            var output = file[file.length - 1];
            for (var j = 0; j < file.length; j++)  {
                  output = "  " + output;
               }
            beezlib.logger.message("  ", output.green);
         }
      beezlib.logger.message("
");
      beezlib.logger.message("   ===============================".silly);
      beezlib.logger.message("   Let me get started right away!!".silly);
      beezlib.logger.message("      Foundation Server Start".silly);
      beezlib.logger.message("   ===============================".silly);
      beezlib.logger.message("
");
      beezlib.logger.message("    $ cd".green, message.projectdir.green);
      beezlib.logger.message("    $ npm install grunt-cli -g".green);
      beezlib.logger.message("    $ npm install .".green);
      beezlib.logger.message("    $ grunt foundation ".green);
      beezlib.logger.message("
");
      beezlib.logger.message("", "---> Good luck to you :)
".silly);
   }
);
