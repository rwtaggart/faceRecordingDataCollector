// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : 'your-secret-clientID-here', // your App ID
        'clientSecret'  : 'your-client-secret-here', // your App Secret
        'callbackURL'   : 'http://localhost:8080/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : 'your-consumer-key-here',
        'consumerSecret'    : 'your-client-secret-here',
        'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : '771824684342-k48obhm9suukdl5b00lhgikig2r03u87.apps.googleusercontent.com',
        'clientSecret'  : 'Wd6kcPR3_c850Jxo6d6m0iqu',
        'callbackURL'   : 'http://localhost:8080/auth/google/callback'
    }

};