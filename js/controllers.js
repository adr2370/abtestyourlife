'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('loginCtrl', function($scope, $rootScope) {
    $scope.login = function() {$rootScope.login()};
  })
  .controller('dashCtrl', function($scope, $rootScope, fbGetInformation, fBase, fbPickWinner) {
    $scope.orderType = 'date';
    $scope.hasExperiments = false;
    
    $rootScope.$watch('user', function() {
      if ($rootScope.user && $rootScope.user.id) {
        $scope.me = $rootScope.user;
      }
    });
    
    var rootRef = new Firebase('https://dteam2013.firebaseio.com');
    $scope.experiments = {};
    
    $scope.pickWinner = function(experiment,winner) {
      fbPickWinner.pickWinner(experiment,winner);
      delete $scope.experiments[experiment];
    };
    
    $scope.refresh = function() {
      fBase.getUserFirebaseRef().then(function(fBaseRef) {
        fBaseRef.on('child_added', function(snapshot) {
          fbGetInformation.getExperimentInformation(snapshot.val())
            .then(function(data) {
              console.log('data', data);
              $scope.hasExperiments = true;
              var experiment = {};
              experiment['id'] = snapshot.name();
              experiment['name'] = data.name || 'Untitled Experiment';
              experiment['posts'] = data.result;
              experiment['shown'] = false;
              experiment['timeCreated'] = data['timeCreated'];
              $scope.experiments[snapshot.name()] = experiment;
            });
        });
      });      
    };
    
    $scope.refresh();
    
    $scope.getOrder = function(experiment) {
      if (!experiment) {
        return 0;
      }
      if ($scope.orderType == 'date') {
        return experiment.timeCreated;
      }
    };
    
    $scope.getLastLikeOnExperiment = function(experiment) {
      var bestTime = 0;
      
    }; 
    
    $scope.getLastUserWhoLiked = function (post) {
      if (post.likes && post.likes.data) {
        return post.likes.data[0].name; 
      }
      return '';
    };
    
    $scope.prettyPrintNoun = function (field, noun) {
      if (field == 1) {
        return field + ' ' + noun; 
      }
      return field + ' ' + noun + 's'; 
    }
  })
  .controller('createExperimentCtrl', function($rootScope, $scope, fbPostFriends) {
    var posts = $scope.posts = [
      {'value': '', 'placeholder': 'Status 1'},
      {'value': '', 'placeholder': 'Status 2'}
    ];
    var photos = $scope.photos = [
      {'value': ''},
      {'value': ''}
    ];
    
    $scope.type = 'STATUS';
    $scope.posting = false;
    $scope.testGroupSize = 50;
    
    $scope.files = [];
    
    $scope.addFile = function(element,index) {
      $scope.$apply(function(scope) {
        var file = element.files[0];
        var fd = new FormData();
        var key = $rootScope.user.id+"/"+(new Date).getTime()+'-'+file.name;
        fd.append('key', key);
        fd.append('acl', 'public-read'); 
        fd.append('Content-Type', file.type);
        fd.append("file",file);
        var xhr = new XMLHttpRequest()
        //xhr.upload.addEventListener("progress", uploadProgress, false);
        //xhr.addEventListener("load", function(data) {}, false);
        //xhr.addEventListener("error", uploadFailed, false);
        //xhr.addEventListener("abort", uploadCanceled, false);
        xhr.open('POST', 'https://fbdreamteam.s3.amazonaws.com/', true);
        xhr.send(fd);
        scope.files[index] = 'https://fbdreamteam.s3.amazonaws.com/'+key;
      });
    };
    
    $scope.addPost = function () {
      if ($scope.type == 'STATUS') {
        if (posts[posts.length - 1]) {
          posts.push(
            {'value': '', 'placeholder': 'Status ' +  (posts.length + 1).toString()}
          );
        }
      } else if ($scope.type == 'PHOTO') {
         photos.push(
           {'value': '', 'placeholder': 'Photo ' + (photos.length + 1).toString(), 'file': ''}
         );
         console.log(photos[0].file);
      }
    };
    
    $scope.removePost = function() {
      if ($scope.type == 'STATUS') {
        if (posts.length > 2) {
          posts.pop(); 
        }
      } else if ($scope.type == 'PHOTO') {
        if (photos.length > 2) {
          photos.pop(); 
        } 
      }
    };
    
    $scope.canRemovePost = function() {
      if ($scope.type == 'STATUS') {
        return posts.length <= 2;
      } else if ($scope.type == 'PHOTO') {
        return photos.length <= 2;   
      }
    }
    
    $scope.createExperimentCallback = function(postResponses, type) {
      $scope.posting = false;
    }
                   
    $scope.createExperiment = function() {     
      console.log($scope.type);
      var postVals = [];
      if($scope.type=='STATUS') {
        for (var i = 0; i < posts.length; i++) {
          var postText = posts[i].value;
          if (postText) {
            postVals.push(postText);
          }
        }
      } else if($scope.type=='PHOTO') {
        for (var i = 0; i < photos.length; i++) {
          var postText = photos[i].value;
          var postFile = $scope.files[i];
          if (postText && postFile) {
            postVals.push({
              message:postText,
              url:postFile
            });
          }
        }        
      }
      
      if ($scope.posting || postVals.length < 2 || !$scope.postName) {
        return false; 
      }
      
      $scope.posting = true;
      fbPostFriends.postToFriends($scope.postName, postVals, $scope.type, $scope.testGroupSize / 100)
        .then(function() {
          $scope.posting = false;
        });
    };
    
    $scope.reverse = function(array) {
      var copy = [].concat(array);
      return copy.reverse();
    }
    
    $scope.changeType = function (type) {
      $scope.type = type;
    };
  });