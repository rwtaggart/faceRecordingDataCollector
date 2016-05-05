/**
 *  RW Taggart
 *  2016.3.29
 *  This will be used to hold the services of the iMotDataCollector app.
 */
 
 dcApp = angular.module('iMotDataCollector')
.service('DcStimuliPlayer', ['youtubeVideoList', DcStimuliPlayer])
.service('DcMediaRecorder', ['$http', 'UserInfo', DcMediaRecorder])
.service('ExperimentProgress', DcExperimentProgressMonitor)

function DcMediaRecorder($http, UserInfo) {

    var dcMediaRecorder = this;
    // TODO:  Return promise, rather than callbacks.
    this.startVideoCalibration = function(succCb) {
        console.log("(D):  Starting Video Calibration process.");
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
        if (!navigator.getUserMedia) {
            console.error("(E):  Couldn't find getUserMedia. Nothing works.");
        }
        
        this.succCb = succCb;
        navigator.getUserMedia(mediaConstraints, onMediaSuccess, onMediaError);
            
    }
    
    this.stopAndSaveRecording = function() {
        console.log("(D):  Stopping and saving the recordings.");
        if (this.stream && this.vRecorder) {
            this.stream.getTracks()[0].stop();
            this.vRecorder.stop();
//            this.vRecorder.save();
        }
    }
    
    this.onDataAvailable = function(blob) {
        console.log("(D):  We have data available!");
        dcMediaRecorder.vidUrl = URL.createObjectURL(blob);
        var aref = document.createElement('a');
        aref.target = '_blank';
        aref.innerHTML = 'Open recorded video No. ';
        aref.href = dcMediaRecorder.vidUrl;

        videosContainer.appendChild(aref);
        videosContainer.appendChild(document.createElement('hr'));

        console.log("(D):  Storing video content for pId: " + UserInfo.participantId());
//        $http.post('DB/uploadVideo', {
//            video: blob, 
//            participantId: UserInfo.participantId()
//        })
    }

    var mediaConstraints = {
        video: true,
        audio: true
    }
    
    this.vWIDTH  = 500;
    this.vHEIGHT = 380;
    var index = 0;
    var videosContainer;

    function onMediaSuccess(stream) {
        console.log("(D):  onMediaSuccess called!");
        dcMediaRecorder.stream = stream;
        dcMediaRecorder.streamUrl = window.URL.createObjectURL(stream)
        
        videosContainer = document.querySelector('#videoContainer');
        
        var mediaRecorder = new MediaStreamRecorder(stream);
        mediaRecorder.stream = stream;
        mediaRecorder.mimeType = 'video/webm';
        mediaRecorder.videoWidth = dcMediaRecorder.vWIDTH;
        mediaRecorder.videoHeight = dcMediaRecorder.vHEIGHT;
        
        mediaRecorder.ondataavailable = dcMediaRecorder.onDataAvailable;
        dcMediaRecorder.vRecorder = mediaRecorder;

//        var timeInterval = document.querySelector('#time-interval').value;
//        if (timeInterval) timeInterval = parseInt(timeInterval);
//        else timeInterval = 5 * 1000;
//        var timeInterval = 5 * 1000;
        var timeInterval = 10 * 60 * 1000;

        mediaRecorder.start();

//        document.querySelector('#stop-recording').disabled  = false;
//        document.querySelector('#pause-recording').disabled = false;
//        document.querySelector('#save-recording').dsiabled  = false;


        // TODO:  Move into tracking service.
//        console.log("(D):  Creating canvas object.");
//        var vcanvas = document.querySelector('calibrateCanvas');
//        var context = vcanvas.getContext('2d');
//
//
//        var canvasWidth  = vWIDTH;
//        var canvasHeight = vHEIGHT;
//
//        vcanvas = mergeProps(video, {
//            controls: true,
//            muted:    true,
//            width:    canvasWidth,
//            height:   canvasHeight,
//            src:      URL.createObjectURL(stream),
//            style:   {
//                top: vidRect.top,
//                left: vidRect.left
//            }
//        });
//        
//        var tracker = new tracking.ObjectTracker('face');
//        tracker.setInitialScale(4);
//        tracker.setStepSize(2);
//        tracker.setEdgesDensity(0.1);
//        tracking.track('#calibrateVideo', tracker, { camera: true });
//        tracker.on('track', function(event) {
//            context.clearRect(0, 0, vcanvas.width, vcanvas.height);
//            event.data.forEach(function(rect) {
//                  context.strokeStyle = '#a64ceb';
//                  context.strokeRect(rect.x, rect.y, rect.width, rect.height);
//                  context.font = '11px Helvetica';
//                  context.fillStyle = "#fff";
//                  context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
//                  context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
//            });
//        });

        dcMediaRecorder.succCb();
    }
    
    function onMediaError(err) {
        console.error('(E):  Could not use media.', err);
    }
}

//  This object will be used to hold all of the stuff for the player.
function DcStimuliPlayer(youtubeVideoList) {
    var dcStimuli = this;

    this.loadExternalStimuli = function() {
        console.log("(D): youtube controller ready.");
        dcStimuli.player = new YT.Player('stimuliContainer', {
            height: '258',
            width: '422',
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    }
    function onPlayerReady(event) {
        event.target.loadPlaylist(youtubeVideoList);
    }

    var done = false;
    var numVids = 0;
    
    var timeout = function() {
        setTimeout(function() {
            dcStimuli.player.nextVideo();
            clearTimeout();
            console.log(numVids);
            numVids = numVids + 1;
            if (numVids <= 5) {
                timeout();
                dcStimuli.player.seekTo(10);
            }
            else {
                dcStimuli.player.stopVideo()
            }
        }, 40 * 1000);
    }

    function onPlayerStateChange(event) {

        if (event.data == YT.PlayerState.PLAYING && !done) {
            console.log("(D):  Player playing & not done")
            done = true;
            timeout()
        }
        
        if (event.data ==YT.PlayerState.ENDED) {
            console.log("(D):  Player ended video")
            done = false;
        }
        
        if (event.data == YT.PlayerState.CUED) {
            console.log("(D):  Player cued video. numVids=" + numVids)
            numVids = numVids + 1;
        }
    }

    function stopVideo() {
        player.stopVideo();
    }
    
}

function DcExperimentProgressMonitor() {
    this.markStepComplete = function (stateName) {
        
    }
}