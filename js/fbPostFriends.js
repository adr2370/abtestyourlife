angular.module('myApp.services')
.service('fbPostFriends', function($rootScope,$q,fBase,util) {
  return {
    postToFriends: function postToFriends(name, posts, type, percent) {
      percent = percent || 1;
      var deferred = $q.defer();
      FB.api('/me/friends', function(response) {
        var friendIDs = [];
        for(var i=0;i<response.data.length;i++) {
          friendIDs[i] = response.data[i].id;
        }
        friendIDs = util.shuffle(friendIDs);
        var friends = util.split(friendIDs, posts.length, percent);
        var postsNotYetRecieved = posts.length;
        var postResponses = [];
        for(var i=0;i<posts.length;i++) {
          var postURL = '';
          var postData = {'privacy': {'value': 'CUSTOM', 'allow': friends[i].join(',')}};
          if(type == 'STATUS') {
            postURL = '/me/feed';
            postData.message = posts[i];
          } else if(type == 'PHOTO') {
            postURL = '/me/photos';
            postData.message = posts[i].message;
            postData.url = posts[i].url;
          }
          var postResponseCallback = function(currPost,name) {
            return function(response) {
              if (!response || response.error) {
                console.log(response.error);
              } else {
                postsNotYetRecieved--;
                postResponses[currPost] = 
                  {
                    'postID': response.id,
                    'friendList': friends[currPost]
                  };
                if(postsNotYetRecieved == 0) {
                  fBase.saveExperiment($rootScope.user.id,postResponses,type,name);
                  deferred.resolve();
                }
              }
            }
          }
          FB.api(
            postURL, 
            'post', 
            postData,
            postResponseCallback(i,name)
          );
        }
      });
      return deferred.promise;
    }
  }
});
