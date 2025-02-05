! ✖ / env;
node;
var path = require("path"), build = require("./build"), emulator = require("./emulator"), device = require("./device"), Q = require("q");
module.exports.run = function(args)  {
   var build_type;
   var install_target;
   for (var i = 2; i < args.length; i++)  {
         if (args[i] == "--debug")  {
            build_type = "--debug";
         }
          else if (args[i] == "--release")  {
            build_type = "--release";
         }
          else if (args[i] == "--nobuild")  {
            build_type = "--nobuild";
         }
          else if (args[i] == "--device")  {
            install_target = "--device";
         }
          else if (args[i] == "--emulator")  {
            install_target = "--emulator";
         }
          else if (args[i].substring(0, 9) == "--target=")  {
            install_target = args[i].substring(9, args[i].length);
         }
          else  {
            console.error("ERROR : Run option '" + args[i] + "' not recognized.");
            process.exit(2);
         }
      }
   return build.run(build_type).then(function()  {
         if (install_target == "--device")  {
            return device.install();
         }
          else if (install_target == "--emulator")  {
            return emulator.list_started().then(function(started)  {
                  var p = started && started.length > 0 ? Q() : emulator.start();
                  return p.then(function()  {
                        emulator.install();
                     }
                  );
               }
            );
         }
          else if (install_target)  {
            var devices, started_emulators, avds;
            return device.list().then(function(res)  {
                  devices = res;
                  return emulator.list_started();
               }
            ).then(function(res)  {
                  started_emulators = res;
                  return emulator.list_images();
               }
            ).then(function(res)  {
                  avds = res;
                  if (devices.indexOf(install_target) > - 1)  {
                     return device.install(install_target);
                  }
                   else if (started_emulators.indexOf(install_target) > - 1)  {
                     return emulator.install(install_target);
                  }
                   else  {
                     var emulator_ID;
                     for (avd in avds)  {
                           if (avds[avd].name == install_target)  {
                              return emulator.start(install_target).then(function()  {
                                    emulator.install(emulator_ID);
                                 }
                              );
                           }
                        }
                     return Q.reject("Target '" + install_target + "' not found, unable to run project");
                  }
               }
            );
         }
          else  {
            return device.list().then(function(device_list)  {
                  if (device_list.length > 0)  {
                     console.log("WARNING : No target specified, deploying to device '" + device_list[0] + "'.");
                     return device.install(device_list[0]);
                  }
                   else  {
                     return emulator.list_started().then(function(emulator_list)  {
                           if (emulator_list.length > 0)  {
                              console.log("WARNING : No target specified, deploying to emulator '" + emulator_list[0] + "'.");
                              return emulator.install(emulator_list[0]);
                           }
                            else  {
                              console.log("WARNING : No started emulators found, starting an emulator.");
                              return emulator.best_image().then(function(best_avd)  {
                                    if (best_avd)  {
                                       return emulator.start(best_avd.name).then(function(emulator_ID)  {
                                             console.log("WARNING : No target specified, deploying to emulator '" + emulator_ID + "'.");
                                             return emulator.install(emulator_ID);
                                          }
                                       );
                                    }
                                     else  {
                                       return emulator.start();
                                    }
                                 }
                              );
                           }
                        }
                     );
                  }
               }
            );
         }
      }
   );
}
;
module.exports.help = function()  {
   console.log("Usage: " + path.relative(process.cwd(), args[0]) + " [options]");
   console.log("Build options :");
   console.log("    --debug : Builds project in debug mode");
   console.log("    --release : Builds project in release mode");
   console.log("    --nobuild : Runs the currently built project without recompiling");
   console.log("Deploy options :");
   console.log("    --device : Will deploy the built project to a device");
   console.log("    --emulator : Will deploy the built project to an emulator if one exists");
   console.log("    --target=<target_id> : Installs to the target with the specified id.");
   process.exit(0);
}
;
