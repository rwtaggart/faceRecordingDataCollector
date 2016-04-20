"use strict" 
/** 
 *  Routes.js is responsible for the routes served by this web application. 
 */
 var crypto = require('crypto')
 var url    = require('url')
 var fs     = require('fs')
 var request = require('request')
 var express = require('express');
 var router  = express.Router();
 
 module.exports = function(app, passport) {
    app.use(router);
    //router.get('/', function(req, res) {
    //    res.render('index', {user: req.user });
    //});

    router.get('/register', function(req, res) {
        res.render('register', {});
    });
    
    router.post('/auth/register', passport.authenticate('local-signup', {
        successRedirect : '/waiver', 
        failureRedirect : '/signup',
        failureFlash : true
    }))

    //router.post('/register', function(req, res) {
    //    Account.register(new Account({username: req.body.username}), req.body.password, function(err, account) {
    //        if (err) {
    //            return res.redner('register', {account: account });
    //        }
    //        
    //        passport.authenticate('local')(req, res, function() {
    //            res.redirect('/');
    //        })
    //    })
    //});

    router.get('/login', function(req, res) {
        res.render('login', { user: req.user });
    });

//    router.get('/auth/signin', function(req, res) {
//        res.json({previousState: req.currentState, username: req.user});
//    })

    router.post('/auth/signin', passport.authenticate('local-login', {
        successRedirect : '/waiver',
        failureRedirect : '/login',
        failureFlash : true
    }));

    router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    router.get('/profile', isLoggedIn, function(req, res) {
//        res.render('views/calibrateVideo', {
//            user: req.user
//        });
        res.send("Showing the profile info, because we're authenticated!");
    });

    //router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email'] }));

    //router.get('/auth/google/callback', 
    //          passport.authenticate('google', {
    //            successRedirect: '/profile', 
    //            failureRedirect: '/'
    //          }));

    router.get('/ping', function(req, res) {
        console.log("(D):  responding to request.");
        res.status(200).send("pong!");
    })

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/');
    }
    
    router.get('/upload/success', function(req, res) {
//        res.json({status: "OK", upload: "Success"})
        if (req.query.error) {
            return res.send('ERROR ' + req.query.error + ': ' + req.query.error_description);
        }

        if (req.query.state !== req.cookies.csrf) {
            return res.status(401).send(
                'CSRF token mismatch, possible cross-site request forgery attempt.'
            );
        }

        request.post('https://api.dropbox.com/1/oauth2/token', {
            form: {
                code: req.query.code,
                grant_type: 'authorization_code',
                redirect_uri: generateRedirectURI(req)
            },
            auth: {
                user: 'w9ucn5vs30ivg2a',
                pass: 'ljh7bgv5up0extm'
            }
        }, function (error, response, body) {
            var data = JSON.parse(body);
            if (data.error) {
                return res.send('ERROR: ' + data.error);
            }

            var token = data.access_token;
            req.session.token=data.access_token;
            request.post('https://api.dropbox.com/1/account/info', {
                headers: { Authorization: 'Bearer ' + token }
            }, function (error, response, body) {
                res.send('Logged in successfully as ' + JSON.parse(body).display_name + '.');
            });

        });
    })
    
    router.get('/upload/token', function(req, res) {
        console.log("(D):  we're in the token function");
        var csrfToken = generateCSRFToken();
        res.cookie('csrf', csrfToken);
        
        var redirect = generateRedirectURI(req);
        console.log("(D):  redirect='" + redirect + "'")
        res.redirect(url.format({
            protocol: 'https',
            hostname: 'www.dropbox.com',
            pathname: '1/oauth2/authorize',
            query: {
                client_id: 'w9ucn5vs30ivg2a',//App key of dropbox api
                response_type: 'code',
                state: csrfToken,
                redirect_uri: redirect
            }
        }));
    })
    
    var serverpath
    
    app.get('/upload/file', function (req, res) {
        serverpath = "/test/test1.txt";//file to be save at what path in server
        var localpath = '/Users/richard/Documents/Grad\ School/CS692/testUpload.txt';//path of the file which is to be uploaded
        if (req.query.error) {
            return res.send('ERROR ' + req.query.error + ': ' + req.query.error_description);
        }
        fs.readFile(localpath,'utf8', function read(err, data) {
            if (err) {
                throw err;
            }
            var content = data;
            console.log(content); 
            fileupload(req.session.token,content, res);
        });
    });

    function fileupload(token,content, res){
        request.put('https://api-content.dropbox.com/1/files_put/auto/'+serverpath+'?overwrite=true', {
            headers: { Authorization: 'Bearer ' + token ,  'Content-Type': 'text/plain'},
            body:content
        }, function optionalCallback (err, httpResponse, bodymsg) {
            var json = JSON.parse(bodymsg)
            if (err) {
                console.error("(E): ", err);
                res.json({status: "ERR", upload: "Failed", err: err})
            }
            else
            { 
                if (!!json.error) {
                    console.error("(E): ", json.error);
                    res.json({status: "ERR", upload: "Failed", err: json.error})
                } else {
                    console.log("(D): ", json);
                    res.json({status: "OK", upload: "Success", msg: json})
                }
            }
        });
    }
    
    function generateRedirectURI(req) {
        var prot;
        if (process.env.DEV)
            prot = req.protocol
        else
            prot = 'https'
        
        var pathSuffix = '/upload/success';
//        var pathSuffix = '/uploadVideoSuccess'
        
        return url.format({
            protocol: prot,
            host: req.headers.host,
            pathname: app.path() + pathSuffix
        });
    }

    function generateCSRFToken() {
        return crypto.randomBytes(18).toString('base64');
    //        .replace(/\//g, '-').replace(/+/g, '_');
    }
}


