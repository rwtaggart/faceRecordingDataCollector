"use strict"
/** 
 * This is the simple Drop Box authentication client side interaction.
 */
var dcApp = angular.module('iMotDataCollector')
.controller('dbAuthCtrl', function($scope, $state, $http, $location) {
    $scope.info = {secToRedirect: 3}
    
    var timer = setInterval(function() {
        $scope.info.secToRedirect = $scope.info.secToRedirect - 1;
        
        if ($scope.info.secToRedirect <= 0) {
            clearInterval(timer)
            authenticateWithDropBox();
        }
    }, 1000);
    
    var authenticateWithDropBox = function() {
//        $state.go('/upload/token')
        $http.get('/upload/token').then( function() {
            console.log("(D):  GET success")
            $location.url('/')
        }, function() {
            console.log("(D):  GET Error")
        })
    }
    
//    var authenticateWithDropBox = function(req, res) {
//        console.log("(D):  we're in the token function");
//        var csrfToken = generateCSRFToken();
//        res.cookie('csrf', csrfToken);
//        
//        var redirect = generateRedirectURI(req);
//        console.log("(D):  redirect='" + redirect + "'")
//        res.redirect(url.format({
//            protocol: 'https',
//            hostname: 'www.dropbox.com',
//            pathname: '1/oauth2/authorize',
//            query: {
//                client_id: 'w9ucn5vs30ivg2a',//App key of dropbox api
//                response_type: 'code',
//                state: csrfToken,
//                redirect_uri: redirect
//            }
//        }));
//    }
    
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
//        return crypto.randomBytes(18).toString('base64');
    //        .replace(/\//g, '-').replace(/+/g, '_');
        return "jbiufwpq8t56dhw6wkmv%&#92*$#7__kfsjwe"
    }
})

