/**
 *   This is the node.js server that will kick off our recordings and stuff.
 *   @author:  RW Taggart
 *   @date:    2016.3.17
 */


/*  Require Dependencies */
// TODO:  reorganize these dependencies
var express = require('express');
var fs    = require('fs');
var http  = require('http');
var https = require('https');
var path  = require('path');

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var passport = require('passport');
//var localStrategy = require('passport-local').Strategy;

var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

var debug = require('debug');
var serverDebug = require('debug')('server');
//we can also bind std out/err
var error = debug('app:error');  // defaults to stderr
var log =  debug('app:log');

log.log = console.log.bind(console);  // we need to bind our log function to the console.
log('print stuff to stdout!');
error('print stuff to stderr');

var app   = express();
var router = express.Router();


/*  express configs */

//app.use(logger('dev'));   --  //TODO:  figure out what 'morgan' is
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

//  We're doing this down below now.
//app.use(require('express-session') ({
//    secret: 'keyboard cat',
//    resave: false,
//    saveUninitialized: false
//}));
//app.use(passport.initialize());
//app.use(passport.session());


/*  Passport config */
require('./config/passport')(passport); // pass passport for configuration

app.use(session({ secret: 'cOg5EB2ZySjlBdcTPZrBUTCXJG/Zq/hVrUnCdw26uy4=' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


/* Routes Setup */

//app.use('/', router);
var routes = require('./routes')(app, passport);  // pass in fully configured passport
var dbRoutes = require('./dbRoutes')(app);
//var users = require('./routes/users');


/* Public files Config */

// serve files out of ./public as our main files
app.use(express.static(path.join(__dirname, '../public')));
app.use('/bower_components', express.static(path.join(__dirname,  '../bower_components')));
console.log("(D):  __dirname: " + __dirname);

//app.all('/*', isLoggedIn)
//function isLoggedIn(req, res, next) {
//    if (req.isAuthenticated())
//        return next();
//    res.redirect('/');
//}

app.get('/', function getIndex(req, res, next) {
    serverDebug('serving up index file.');
//    console.log("(D):  Serving up log file.");
    res.sendFile('index.html', {root: 'public/'});
});


/* Start Server */

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
	// print a message when the server starts listening
    serverDebug('server starting on ' + appEnv.url);
//  console.log("server starting on " + appEnv.url);
});
serverDebug('server listening on ' + appEnv.port);
//console.log("(I):  server up at " + appEnv.port);
