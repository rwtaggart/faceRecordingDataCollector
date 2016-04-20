/** 
 *  Routes.js is responsible for the routes served by this web application. 
 */
 
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
                user: w9ucn5vs30ivg2a,
                pass: ljh7bgv5up0extm
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
        var csrfToken = generateCSRFToken();
        res.cookie('csrf', csrfToken);
        res.redirect(url.format({
            protocol: 'https',
            hostname: 'www.dropbox.com',
            pathname: '1/oauth2/authorize',
            query: {
                client_id: APP_KEY,//App key of dropbox api
                response_type: 'code',
                state: csrfToken,
                redirect_uri: generateRedirectURI(req)
            }
        }));
    })
}

function generateRedirectURI(req) {
    return url.format({
        protocol: req.protocol,
        host: req.headers.host,
        pathname: app.path() + '/upload/success'
    });
}

function generateCSRFToken() {
    return crypto.randomBytes(18).toString('base64')
        .replace(///g, '-').replace(/+/g, '_');
}

