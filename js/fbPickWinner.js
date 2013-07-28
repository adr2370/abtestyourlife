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
        var winnerNum = 0;
        while(data[numPosts]) {
          experimentPosts.push(data[numPosts]);
          var postID = data[numPosts].postID;
          if(type=='STATUS') {
            postID = data[numPosts].postID.split('_')[1];
          }
          if(postID == winner) {
            winnerNum = numPosts;
            FB.api(postID, 'GET', function(response) {
              console.log(response);
              FB.api({
                method: 'fql.query',
                query: 'select allow, deny, description from privacy where id = ' + postID
              }, function(fqlResponse) {
                console.log(fqlResponse);
                /*FB.api('me/feed', 'POST', 
                {
                  message: response.message+"\x07", 
                  'privacy': {
                    'value': 'CUSTOM', 
                    'allow': 'ALL_FRIENDS', 
                    'deny': friends[i].join(',')
                  }
                }, function(response) {
                  console.log(response);
                });*/
              });
            });
          } else {
            /*FB.api(postID, 'DELETE', function(response) {
              console.log(response);
            });*/
          }
          numPosts++;
        }
      });
      //return deferred.promise;
    }
  }
});
