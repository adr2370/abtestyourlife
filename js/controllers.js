'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('loginCtrl', function($scope) {
    $scope.login = function() {
      FB.login(function(){},{scope: 'publish_actions'});
    }
  })
  .controller('dashCtrl', function($scope, $rootScope, fbGetInformation, fBase) {
    var rootRef = new Firebase('https://dteam2013.firebaseio.com');
    $scope.experiments = {}
    
    $scope.refresh = function() {
      fBase.getUserFirebaseRef().then(function(fBaseRef) {
        fBaseRef.on('child_added', function(snapshot) {
          fbGetInformation.getExperimentInformation(snapshot.val())
            .then(function(data) {
              console.log(data);
              $scope.experiments[snapshot.val()] = data;
            });
        });
      });      
    };
    
    $scope.refresh();
    
  })
  .controller('createExperimentCtrl', function($scope, fbPostFriends) {
    var posts = $scope.posts = [{'value': ''}];
    
    $scope.type = 'STATUS';
    $scope.posting = false;
    
    $scope.addPost = function () {
      if (posts[posts.length - 1]) {
        posts.push({'value': ''});
      }
    };
    
    $scope.createExperimentCallback = function(postResponses, type) {
      $scope.posting = false;
    }
                   
    $scope.createExperiment = function() {
      var postVals = [];
      for (var i = 0; i < posts.length; i++) {
        var postText = posts[i].value;
        if (postText) {
          postVals.push(postText);
        }
      }
      $scope.posting = true;
      fbPostFriends.postToFriends(postVals, $scope.type, 1, $scope.createExperimentCallback);
    };
    
    $scope.changeType = function (type) {
      $scope.type = type;
    };
  });