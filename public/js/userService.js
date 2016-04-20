/**
 *  This is one of the services which will be available always (served without authentication)
 */
 
 var dcApp = angular.module('iMotDataCollector')
 .service('UserInfo', UserInfo)

function UserInfo() {
    var user = {};
    this.participantId = function() {
        return user.pId;
    }
    
    this.setParticipantId = function(arg_pId) {
        console.log("(D): Setting pId: " + arg_pId);
        user.pId = arg_pId;
    }
    
    this.addUser = function(arg_user) {
        user = arg_user;
    }
}