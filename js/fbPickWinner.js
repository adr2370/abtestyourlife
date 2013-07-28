angular.module('myApp.services')
.service('fbPickWinner', function($rootScope,$q,fBase,util) {
  return {
    pickWinner: function pickWinner(experiment, winner) {
      //var deferred = $q.defer();
      fBase.getExperimentPosts($rootScope.user.id,experiment).then(function(snapshot) {
        var data = snapshot.val();
        var numPosts = 0;
        var experimentPosts = [];
        var type = data.type;
        while(data[numPosts]) {
          experimentPosts.push(data[numPosts]);
          var postID = data[numPosts].postID;
          var postURL = postID;
          if(type=='STATUS') {
            postID = data[numPosts].postID.split('_')[1];
          }
          if(postID == winner) {
            var postResponse = function(postID) {
              return function(response) {
                if(type=='STATUS') {
                  FB.api('me/feed', 'POST', 
                    {
                      message: response.message+"\x07"
                    }, function(response2) {
                      FB.api(postURL, 'DELETE', function(response3) {
                        fBase.deleteExperiment($rootScope.user.id,experiment);
                      });  
                    }
                  );
                } else if(type=='PHOTO') {
                  FB.api('me/photos', 'POST',
                    {
                      message: response.message+"\x07",
                      url: response.source
                    }, function(response2) {
                      FB.api(postURL, 'DELETE', function(response3) {
                        fBase.deleteExperiment($rootScope.user.id,experiment);
                      });                    
                    }
                  );
                }
              }
            }
            FB.api(postID, 'GET', postResponse(postID));
          } else {
            FB.api(postURL, 'DELETE', function(response) {});
          }
          numPosts++;
        }
      });
      //return deferred.promise;
    }
  }
});
