! ✖ / env;
node;
var settings = require(process.env.NODE_CONFIG || "./settings").settings;
var express = require("express"), RedisStore = require("connect-redis")(express.session), routes = require("./routes"), http = require("http"), path = require("path");
var async = require("async");
var redis = require("redis");
var db = redis.createClient(process.env.REDIS_PORT || settings.REDIS_PORT, process.env.REDIS_HOST || settings.REDIS_HOST);
var request = require("request");
var cons = require("consolidate");
var swig = require("swig");
var app = express();
app.configure(function()  {
      app.set("port", process.env.PORT || settings.port);
      app.set("views", __dirname + "/views");
      console.log(__dirname);
      app.engine(".html", cons.swig);
      app.set("view engine", "html");
      swig.init( {
            root:__dirname + "/views", 
            allowError:true         }
      );
      app.use(express.favicon());
      app.use(express.logger("dev"));
      app.use(express.bodyParser());
      app.use(express.methodOverride());
      app.use(express.cookieParser(settings.cookieSecret));
      app.use(express.session( {
               secret:settings.sessionSecret, 
               store:new RedisStore()            }
         ));
      app.use(app.router);
      app.use(express.static(path.join(__dirname, "public")));
   }
);
app.configure("development", function()  {
      app.use(express.errorHandler());
   }
);
app.get("/", routes.index);
function checkAuth(req, res, next)  {
   next();
}
;
app.get("/login", function(req, res)  {
      res.render("login.html",  {
            title:"Login"         }
      );
   }
);
app.post("/login", function(req, res)  {
      var post = req.body;
      if (post.user == settings.username && post.password == settings.password)  {
         res.redirect("/routes");
      }
       else  {
         res.send("Your login credientials are invalid!");
      }
   }
);
app.get("/logout", function(req, res)  {
      delete req.session.user_id;
      res.redirect("/login");
   }
);
app.get("/routes", checkAuth, function(req, res)  {
      res.render("routes.html",  {
            title:"Routes"         }
      );
   }
);
app.get("/ajax/routes", checkAuth, function(req, res)  {
      db.keys("frontend:*", function(err, routes)  {
            var routelist = [];
            async.forEach(routes, function(item, cb)  {
                  db.lrange(item, 0, - 1, function(err, items)  {
                        if (err)  {
                           cb(err);
                        }
                        var route =  {
                           name:item, 
                           items:items                        }
;
                        routelist.push(route);
                        cb();
                     }
                  );
               }, 
               function(err)  {
                  if (err)  {
                     console.log(err);
                  }
                  res.send(routelist);
               }
            );
         }
      );
   }
);
app.post("/ajax/save", checkAuth, function(req, res)  {
      var data = req.body.data;
      db.del(data.route, function(err)  {
            db.rpush(data.route, data.name, function(err)  {
                  if (err)  {
                     console.log(err);
                  }
                  for (i in data.hosts)  {
                        db.rpush(data.route, data.hosts[i]);
                     }
               }
            );
         }
      );
      res.send("{"response":"OK"}");
   }
);
app.post("/ajax/remove", checkAuth, function(req, res)  {
      var key = req.body.key;
      db.del(key, function(err)  {
            if (err)  {
               console.log(err);
            }
             else  {
               res.send("{"response":"OK"}");
            }
         }
      );
   }
);
app.get("/ajax/getInstances", checkAuth, function(req, res)  {
      if (! settings.enable_openstack)  {
         res.send(400,  {
               error:"Openstack support is not enabled"            }
         );
         return ;
      }
      var params =  {
         auth: {
            passwordCredentials: {
               username:settings.os_api_username, 
               password:settings.os_api_password            }, 
            tenantId:settings.os_api_tenant         }} ;
      request( {
            url:settings.os_keystone_url + "/v2.0/tokens", 
            method:"POST", 
            body:params, 
            json:true         }, 
         function(err, response, body)  {
            var token = body.access.token.id;
            var url = settings.os_nova_url + "/v2/" + settings.os_api_tenant + "/servers/detail?all_tenants=1";
            request( {
                  url:url, 
                  method:"GET", 
                  headers: {
                     X-Auth-Token:token                  }, 
                  json:true               }, 
               function(err, response, body)  {
                  var instances = [];
                  async.forEach(body.servers, function(instance, cb)  {
                        var addresses = [];
                        for (var i = 0; i < instance.addresses.private.length; i++)  {
                              addresses.push(instance.addresses.private[i].addr);
                           }
                        ;
                        var tolist =  {
                           id:instance.id, 
                           name:instance.name, 
                           status:instance.status, 
                           addresses:addresses                        }
;
                        instances.push(tolist);
                        cb();
                     }, 
                     function(err)  {
                        res.send(instances);
                     }
                  );
               }
            );
         }
      );
   }
);
http.createServer(app).listen(app.get("port"), function()  {
      console.log("Express server listening on port " + app.get("port"));
   }
);
