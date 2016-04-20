var dcApp = angular.module('iMotDataCollector')
.controller('downloadCtrl', function($scope, DcMediaRecorder) {
    videosContainer = document.querySelector('#videoContainer');
    
//    dcMediaRecorder.vidUrl = URL.createObjectURL(blob);
    var vidUrl = DcMediaRecorder.vidUrl 
    var aref = document.createElement('a');
    aref.target = '_blank';
    aref.innerHTML = 'Open recorded video No. ';
    aref.href = vidUrl;

    videosContainer.appendChild(aref);
    videosContainer.appendChild(document.createElement('hr'));

    $scope.media = {}
    $scope.media.link = DcMediaRecorder.vidUrl
})