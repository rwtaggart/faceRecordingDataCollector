/**
 *  This is for the questionaire controller.
 */
dcApp = angular.module('iMotDataCollector')
.controller('questionaireCtrl', function($scope, $state, $http, UserInfo) {
    console.log("(D):  We're in the questionaireCtrl.")
    
    this.genParticipantId = function() {
        var pId = Math.floor(Math.random() * Math.pow(10, 9));
        UserInfo.setParticipantId(pId);
        return pId;
    }
    
    this.ethnicityList = [
        {name: "White"},
        {name: "Hispanic or Latino"},
        {name: "Black or African American"},
        {name: "Native American or American Indian"},
        {name: "Asian / Pacific Islander"},
        {name: "Other"},
        {name: "Prefer not to say", abbrev: "N/A"}
    ]
    
    this.genderList = [
        {name: "Male"},
        {name: "Female"},
        {name: "Other"}, 
        {name: "Prefer not to say", abbrev: "N/A"}
    ]
    
    this.processQuestionForm = function() {
        if ($scope.questionForm.$invalid)
            console.error("(E):  Error in the form.");
        console.log("(D):  Processing Form.");
        $http.post('/DB/participantData', $scope.user);
        
        $state.go('calibrateVideo');
    }
    
    $scope.user = {
        participantId: this.genParticipantId(),
        fname: "",
        lname: "",
        email: "",
        ethnicity: "",
        gender: "",
        glasses: false,
        faceHair: false,
        faceMarks: false,
        comments: ""
    };
})