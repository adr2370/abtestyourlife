angular.module('myApp.services')
.service('fbGetInformation', function($rootScope,$q,fBase,util) {
  return {
    getExperimentInformation: function getExperimentInformation(limit) {
      limit = limit || 20;
      var deferred = $q.defer();
      fBase.getExperiments($rootScope.user.id,limit).then(
        function(experiments) {
          var defers = [];
          var batchRequests = [];
          var postToExperiement = {};
          for(var experimentKey in experiments) {
            var experiment = experiments[experimentKey];
            for(var postKey in experiment) {
              var post = experiment[postKey].postID;
              postToExperiement[post] = experimentKey;
              console.log(post);
              batchRequests.push({
                method:'GET',
                relative_url:post+'?fields=name,source,likes,comments,sharedposts'
              });
            }
          }
          FB.api('/','POST',{batch:batchRequests},function(responses) {
            var results = {};
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
              var experiment = postToExperiement[result.id];
              if(results[experiment]) {
                results[experiment].push(result);
              } else {
                results[experiment] = [result];
              }
            }
            deferred.resolve(results);
          });
        }
      );
      return deferred.promise;   // Move fast and fuck everything
    }
  }
});