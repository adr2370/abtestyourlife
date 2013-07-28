angular.module('myApp.services')
.service('fbGetInformation', function($rootScope,$q,fBase,util) {
  return {
    getExperimentInformation: function getExperimentInformation(experiment) {
      var type = experiment.type;
      var name = experiment.testName;
      var timeCreated = experiment.timeCreated;
      var deferred = $q.defer();
      var batchRequests = [];
      var friendCounts = {};
      for(var postKey in experiment) {
        var post = experiment[postKey].postID;
        if(!post) {
          continue;
        }
        friendCounts[postKey] = experiment[postKey].friendList.length;
        if(type=='PHOTO') {
          batchRequests.push({
            method:'GET',
            relative_url:post+'?fields=name,source,likes,comments,sharedposts'
          });
        } else if(type=='STATUS') {
          var postID = post.split('_')[1];
          batchRequests.push({
            method:'GET',
            relative_url:postID+'?fields=message,likes,comments,sharedposts'
          });
        }
      }
      FB.api('/','POST',{batch:batchRequests},function(responses) {
        var resultArray = [];
        for(var i=0;i<responses.length;i++) {
          var result = JSON.parse(responses[i].body);
          if(result.likes) {
            result.numLikes = result.likes.data.length;
          } else {
            result.numLikes = 0;
          }
          if(result.comments) {
            result.numComments = result.comments.data.length;
          } else {
            result.numComments = 0;
          }
          if(result.shares) {
            result.numShares = result.shares.data.length;
          } else {
            result.numShares = 0;
          }
          result.numActions = result.numShares + result.numComments + result.numLikes;
          result.friendCount = friendCounts[i];
          resultArray.push(result);
        }
        
        resultArray.sort(function(a,b) { return a.numActions < b.numActions });
        var results = {result:resultArray,type:type,name:name,timeCreated:timeCreated};
        $rootScope.$apply(function() {
          console.log(results);
          deferred.resolve(results);
        });
      });
      return deferred.promise;   // Move fast and fuck everything
    }
  }
});
