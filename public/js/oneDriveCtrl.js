"use strict"
/**
 * This file will be used to access the OneDrive stuff. 
 * It will also interact with our OneDrive view.
 */
 
var dcAppOD = angular.module('iMotDataCollector')
.controller('oneDriveCtrl', function($scope) {
    console.log("(D):  Inside of the OneDrive Controller.")
    

    $scope.upload = {
        progress: 0, 
        message: {id: {waiting: true}},
        error:  false
    }
    
    $scope.text = {}
    var uploadSucc = function(res) {
        console.log("(D):  We've properly uploaded something!")
    }
    
    var beginUpload = function() {
        $scope.upload.message.id = "inprogress"
        $scope.upload.inProgress
    }
    
    var uploadProg = function(perc) {
        console.log("(D):  progress - " + perc)
        $scope.upload.progress = perc
    }
    
    var uploadCancel = function() {
        console.log("(D):  we want to cancel.")
        $scope.upload.inProgress = false
        $scope.upload.message = {id: {error: true}, txt: "Upload Canceled."}
        $scope.upload.error = {msg: "Operation Canceled"}
    }
    
    var uploadErr = function(e) {
        console.log("(D):  There was an upload err." + e)
        $scope.upload.inProgress = false
        $scope.upload.error = {msg: e.message}
    }
    
    var oneDriveOpts = {
        clientId :  "2b0cbd80-c05b-4143-9534-e3710c42e364",
        action :  "save",
        sourceInputElementId :  "fileUploadControl",
        sourceUri :  "",
        openInNewWindow :  true,
        advanced :  {},
        success :  uploadSucc,
        progress :  uploadProg,
        cancel :  uploadCancel,
        error :  uploadErr
    }

    this.launchSaveToOneDrive = function() {
        console.log("(D):  We're in the launch file save thingy function!")
        $scope.upload.inProgress = true
        OneDrive.save(oneDriveOpts)
    }
    
})