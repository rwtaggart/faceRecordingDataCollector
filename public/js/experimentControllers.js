var iMotDataApp = angular.module("iMotDataCollector")
.factory('youtubeVideoList', function youtubeVideoListFactory() {
    // This factory will return an object which contains a list of videos, and their respective start/end times. 
//    return [
//        {id: 'imtPF2b2Q4M&ebc=ANyPxKpTiXeq4lLycZn4Nv4xyjbHT1UjF1N4pQ06IeLpHkjUZAuGGR7jIYRfmSzsLhbWJXm_E3y8OC-eXcABpIBFNnx3CGRexg', 
//         startmin: '8:20',
//         endmin:   '9:40'
//        },
//        {id: 'l_8yPap-k_s',
//         startmin:  '2:56',
//         playfor:   20
//        },
//        {id: 'QhzhGL67-1I'},
//        {id: '1zqOYBabXmA', 
//         startmin: '3:10'}
//    ];   

//'1zqOYBabXmA',   // This one doesn't play.
    return [
        'imtPF2b2Q4M', 
        'l_8yPap-k_s',
        'QhzhGL67-1I',
        'gCx0NeffRfI',
        '4VaJVDHRpvA',
        'qqrvm2XDvpQ',
    ];
 })
 .controller('iMotDataCont', function iMotionDataControlFnc($scope, youtubeVideoList, DcMediaRecorder, UserInfo) {
    $scope.config = UserInfo.config
    $scope.test     = {};
    $scope.test.txt = "here's an example test!";
    console.log("(D):  We're in the controller! Test object=" + JSON.stringify($scope.test));
    
    $scope.configs = {};
    $scope.configs.enableVideo = false;
    
    $scope.testFnc = function() { 
        return "Response of test function";
    }
    
    $scope.testSumFnc = function(a, b) { 
        return a + b;
    }
    
    $scope.startVideo = function() {
        console.log("(D):  executing startVideo");
        DcMediaRecorder.startVideoCalibration(showVideo);
    }
    
    $scope.stopAndSaveRecord = function() {
        console.log("(D):  Stopping and saving the recordings.");
        DcMediaRecorder.stopAndSaveRecording();
    }
    
    function showVideo() {
        console.log("(D): executing show video!");
        var video = document.querySelector('#calibrateVideo');
        var videoWidth  = DcMediaRecorder.vWIDTH;
        var videoHeight = DcMediaRecorder.vHEIGHT;

        video = mergeProps(video, {
            id: 'calibrateVideo',
            controls: true,
            muted:    true,
            width:    videoWidth,
            height:   videoHeight,
            src:      DcMediaRecorder.streamUrl
        });
        video.play();

        var videoElem = document.querySelector('#calibrateVideo');
        var vidRect = videoElem.getBoundingClientRect();
        console.log("(D):  videoRectangle: " + JSON.stringify(vidRect));
        console.log("(D):  videoRect: " + vidRect.top + ", " + vidRect.bottom + ", " + vidRect.left + ", " + vidRect.right);

    }
    
    //        var video = document.querySelector("#videoElement");

    // TODO:  We're going to want to stuff some of this in a service.
})

.controller('experimentCtrl', function($scope, $state, DcMediaRecorder, DcStimuliPlayer) {
    console.log("(D): youtube controller ready.");
    $scope.playStimuli = function() {
        console.log("(D):  loading external stimuli");
        DcStimuliPlayer.loadExternalStimuli();
    }
    
    $scope.$on('$stateChangeSuccess', function(event, toState, toParms, fromState, fromParms) {
        console.log("(D):  changed state!");
        $scope.playStimuli();
    })
    
    $scope.stopAndSaveRecord = function() {
        console.log("(D):  Stopping and saving the recordings.");
        DcMediaRecorder.stopAndSaveRecording()
        $state.go('downloadVideo')
    }
})
.controller('experimentListCtrl', function($scope, $state) {
//    $scope.experimentSteps = [
//        {name: "Profile Setup", isDone: true},
//        {name: "Consent Waiver", isDone: true},
//        {name: "Webcam Calibration", isDone: true},
//        {name: "Data Capture", isProcessing: true}, 
//        {name: "Save Data"},
//        {name: "Experiment Complete"}
//    ]

    $scope.experimentSteps = [
        {name: "Participant Activity", isDone: true},
        {name: "Signed Consent Waivers", isDone: true},
        {name: "Available Videos", isDone: true},
        {name: "Analyzed Video Data", isProcessing: true}, 
        {name: "Survey Responses"},
        {name: "Demographic Patterns",  isDone: true}
    ]
    
    console.log($state.get());
})