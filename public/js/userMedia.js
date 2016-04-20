/**
 * RW Taggart
 * 2016.3.26
 *
 * This is the piece which is resopnsible for the user cam collection.
 */
 
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
//        if (!!navigator.getUserMedia) {
//            navigator.getUserMedia({video: true}, handleVideo, videoError);
//        } else {
//            console.error("(E):  Couldn't find getUserMedia. Nothing works.");
//        }

var video = document.querySelector("#videoElement");
if (!!video) {
    console.log("(D):  We have a video object!");
} else {
    console.error("(D):  we don't have a video object.");
}
//        var testElem = document.querySelector("#errorMsg");
//var testElem = document.querySelector("#errorMsg");
//testElem.innerHTML = "Hey there! We're posting an error message here.";

// Include support for multiple browsers
//        var getUserMedia;

function captureUserMedia(mediaContraints, succCb, errCb) {
    navigator.getUserMedia(mediaConstraints, succCb, errCb);
}

var mediaConstraints = {
    video: true,
    audio: true
}

document.querySelector('#start-recording').onclick = function startOnClick() {
    this.disabled = true;
    captureUserMedia(mediaConstraints, onMediaSuccess, onMediaError);
}

document.querySelector('#stop-recording').onclick = function stopOnClick() {
    this.disabled = true;
    mediaRecorder.stop();
//            mediaRecorder.stream.stop();

    document.querySelector('#pause-recording').disabled = true;
    document.querySelector('#start-recording').disabled = false;
}

document.querySelector('#pause-recording').onclick = function pauseOnClick() {
    this.disabled = true;
    mediaRecorder.pause();

    document.querySelector('#resume-recording').disabled = false;
}

document.querySelector('#resume-recording').onclick = function resumeOnClick() {
    this.disabled = true;
    mediaRecorder.resume();

    document.querySelector('#pause-recording').disabled = false;
}

document.querySelector('#save-recording').onclick = function saveOnClick() {
    this.disabled = true;
    mediaRecorder.save();
}

var mediaRecorder;

function onMediaSuccess_audio(stream) {
    var audio = document.createElement('audio');

//            audio = mergeProps(audio, {
//                controls: true,
//                muted:    true,
//                src:      URL.createObjectURL(stream)
//            });
    audio.controls = true;
    audio.muted    = true;
    audio.src      = URL.createObjectURL(stream);
    audio.play();

    audiosContainer.appendChild(audio);
    audiosContainer.appendChild(document.createElement('hr'));

    mediaRecorder = new MediaStreamRecorder(stream);
    mediaRecorder.stream = stream;
    mediaRecorder.mimeType = 'audio/ogg';
    mediaRecorder.audioChannels = !!document.getElementById('left-channel').checked ? 1:2;
    mediaRecorder.ondataavailable = function(blob) {
        var aref = document.createElement('a');
        aref.target = '_blank';
        aref.innerHtml = "Open Recorded Audio No. " + (index++) + ' (Size: ' + bytesToSize(blob.size) + ') Time Length: ' + getTimeLength(timeInterval);

        aref.href = URL.createObjectURL(blob);
        audiosContainer.appendChild(aref);
        audiosContainer.appendChild(document.createElement('hr'));

    };

    var timeInterval = document.querySelector('#time-interval').value;
    if (timeInterval) timeInterval = parseInt(timeInterval);
    else timeInterval = 5 * 1000;

    mediaRecorder.start(timeInterval);

    document.querySelector('#stop-recording').disabled  = false;
    document.querySelector('#pause-recording').disabled = false;
    document.querySelector('#save-recording').dsiabled  = false;
}

const vWIDTH  = 320;
const vHEIGHT = 240;

function onMediaSuccess(stream) {
    var video = document.createElement('video');

    var videoWidth = document.getElementById('video-width').value || vWIDTH;
    var videoHeight = document.getElementById('video-height').valuse || vHEIGHT;

    video = mergeProps(video, {
        controls: true,
        muted:    true,
        width:    videoWidth,
        height:   videoHeight,
        src:      URL.createObjectURL(stream)
    });
    video.play();

    videosContainer.appendChild(video);
    videosContainer.appendChild(document.createElement('hr'));

    mediaRecorder = new MediaStreamRecorder(stream);
    mediaRecorder.stream = stream;
    mediaRecorder.mimeType = 'video/webm';
    mediaRecorder.videoWidth = videoWidth;
    mediaRecorder.videoHeight = videoHeight;
    mediaRecorder.ondataavailable = function(blob) {
        var aref = document.createElement('a');
        aref.target = '_blank';
        aref.innerHTML = 'Open recorded video No. ' + (index++) + ' Size: ' + bytestToSize(blob.size) + ' Time Length: ' + getTimeLength(timeInterval);
        aref.href = URL.createObjectURL(blob);

        videosContainer.appendChild(aref);
        videosContainer.appendChild(document.createElement('hr'));
    }

    var timeInterval = document.querySelector('#time-interval').value;
    if (timeInterval) timeInterval = parseInt(timeInterval);
    else timeInterval = 5 * 1000;

    mediaRecorder.start(timeInterval);

    document.querySelector('#stop-recording').disabled  = false;
    document.querySelector('#pause-recording').disabled = false;
    document.querySelector('#save-recording').dsiabled  = false;
}

function onMediaError(err) {
    console.error('(E):  Could not use media.', err);
}

//        var audiosContainer = document.getElementById('audios-container');
var videosContainer = document.querySelector('#videos-container');
var audiosContainer = document.querySelector('#audios-container');
var index = 1;


function bytestToSize(bytes) {
    var kiloPfix = 1000;
    var sizes    = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    var sigSize = parseInt(Math.floor(Math.log(bytes) / Math.log(kiloPfix)), 10);
    return (bytes / Math.pow(kiloPfix, sigSize)).toPrecision(3) + ' ' + sizes[sigSize];
}

function getTimeLength(milliseconds) {
    var data = new Date(milliseconds);
    return data.getUTCHours() + " hours, " + data.getUTCMinutes() + " minutes and " + data.getUTCSeconds() + " seconds";
}

window.onbeforeunload = function () {
    document.querySelector('#start-recording').disabled = false;
}

//        if (Modernizer.getUserMedia) {
//            getUserMedia = Modernizer.prefixed('getUserMedia', navigator);
//        }

var localStream;

document.querySelector('#killVideoBtn').onclick = function killVideo(stream) {
//            if (!!config) config.videoEnabled = false;
    window.URL.revokeObjectURL(video.src);
    video.pause();
    localStream.getVideoTracks()[0].stop();
}

function handleVideo(stream) {
    video.src = window.URL.createObjectURL(stream);
    localStream = stream;
    //            var recordRTC = RecordRTC(stream, {type: 'video'});
}

function videoError(e) {
    console.error("(E):  could not collect video!");
}