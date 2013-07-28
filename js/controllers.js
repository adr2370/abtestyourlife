'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('loginCtrl', function($scope) {
    
  })
  .controller('dashCtrl', function($scope, fbGetInformation) {
    
    $scope.refresh = function() {
      fbGetInformation.getExperimentInformation(100).then(function(tests) {
        $scope.tests = tests;
      });      
    };
  });