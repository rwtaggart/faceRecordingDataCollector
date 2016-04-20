/**
 *  RW Taggart
 *  2016.3.28
 *  This is the ui-routes config file for the DataCollector app.
 */
 
 dcApp = angular.module('iMotDataCollector')
 .config(function($locationProvider, $stateProvider, $urlRouterProvider) {
//    $locationProvider.html5Mode({
//        enabled: true,
//        requireBase: false
//    });
    
    $urlRouterProvider.otherwise('/enter');
    $stateProvider
    .state('enter', {
        url: '/enter',
        templateUrl: 'views/enterSite.html'
    })
    .state('signin', {
        url: '/signin',
        templateUrl: 'views/signin.html'
    })
    .state('signup', {
        url: '/signup',
        templateUrl: 'views/signup.html'
    })
    .state('endUserAgreement', {
        url: '/endUserAgreement',
        templateUrl: 'views/endUserAgreement.html'
    })
    .state('tos', {
        url: '/tos',
        templateUrl: 'views/tos_document.html'
    })
    .state('waiver', {
        url: '/waiver',
        templateUrl: 'views/Consent_Form.htm',
        controller:  'waiverCtrl as wavCtrl'
    })
    .state('questionaire', {
        url: '/questionaire', 
        templateUrl: 'views/respondent_questions.html',
        controller:  'questionaireCtrl as qctrl'
    })
    .state('calibrateVideo', {
        url: '/calibrateVideo',
        templateUrl: 'views/calibrateVideo.html'
    })
    .state('experiment', {
        url: '/experiment', 
        templateUrl: 'views/experiment.html',
    })
    .state('tracker', {
        url: '/tracker',
        templateUrl: 'views/tracker.html'
    })
    .state('dataAnalysis', {
        url: '/dataAnalysis',
        templateUrl: 'views/analyzedData.html'
    })
    .state('retrieveVideos', {
        url: '/videos',
        templateUrl: 'views/videos.html'
    })
    .state('uploadOneDrive', {
        url: '/uploadVideo',
        templateUrl: 'views/OneDriveUpload.html'
    })
    .state('downloadVideo', {
        url: '/downloadVideo',
        templateUrl: 'views/downloadVideo.html'
    })
    .state('dropBoxAuth', {
        url: '/dbAuth',
        templateUrl: 'views/dropBoxAuth.html'
    })
})