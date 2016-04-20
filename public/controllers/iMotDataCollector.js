"use strict";
var iMotDataApp = angular.module("iMotDataCollector", ['ngMaterial', 'ui.router','ngMessages', 'nvd3'])
.config(function($mdThemingProvider, $mdIconProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('teal')
        .accentPalette('blue');
})
.config(function($mdThemingProvider) {
    // Configure a dark theme with primary foreground yellow
    $mdThemingProvider.theme('docs-dark', 'default')
      .primaryPalette('yellow')
      .dark();
})
.controller('toolbarController', function($scope, $state, $mdDialog) {
    var originatorEvent;  // We want to keep the state of the menu here.
    
    this.openMenu = function($mdOpenMenu, event) {
        originatorEvent = event;
        $mdOpenMenu(event);
    }
    this.populateNavMenu = function() {
        var states = $state.get();
        states.shift();
        return states;
    }
    
    this.navTo = function(stateObj) {
        $state.go(stateObj.name);
    }
    
    this.goSignIn = function() {
        $state.go('signin');
    }
})
.controller('userAccountCtrl', function($scope, $http, $state) {
    $scope.user = {};
    
    this.signIn = function() {
        // We're going to stuff the authentication logic in here.
        $scope.user.currentState = $state.current.name;
        $http.post('/auth/signin', $scope.user)
        .then(function(response) {
            $scope.user.username = response.username;
            Session.create(response.data.id, response.data.username, 1);
            
            if (response.data.previousState != $state.current.name) {
                $state.go(response.data.previousState);
            } else {
                $state.go('home');
            }
        }, function(response) {
            console.err("(E):  Auth Failed");
        });
    }
})
.controller('waiverCtrl', function($scope, $state, $http) {
    $scope.consent = {};
    var checked = false;
    this.isChecked = function() {
        return checked;
    }
    
    this.toggle = function() {
        checked = !checked;
    }
    
    this.processWaiverConsent = function() {
        // Store request and participant #
        $state.go('questionaire')
    }
})
