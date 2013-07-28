angular.module('myApp.services')
.factory('ff', function($rootScope, angularFire, $q) {
  var d = $q.defer();
  var getPromise = function(user) {
    if (user && user.id) {
      var url = 'https://dteam2013.firebaseio.com/users/' + user.id;
      var promise = angularFire(url, $rootScope, 'fBaseData', {});
      d.resolve(promise);
    }
  };
  getPromise($rootScope.user);
  $rootScope.$watch('user', function(user) {
    getID(user);
  });
  
  return d.promise;
})
.service('fBase', function($q, $rootScope) {
  var rootRef = new Firebase('https://dteam2013.firebaseio.com');
  
  return {
    /**
     * Takes a user's fbid and saves the experiment.
     * 
     * @param fbid  the facebook user id
     * @param posts  a list of posts: e.g. [
     *   {postID: 21873612, friendList: [123141, 12312412...]},
     *   {postID: 21873613, friendList: [120391, 12381230...]}
     * ]
     * @param callback (optional): A callback function that will be called when
     *          the specified value is synchronized to the Firebase servers. The
     *          callback will be passed an Error object on failure, else null.
     */
    saveExperiment: function(fbid, posts, callback) {
      var deferred = $q.defer();
      var user = rootRef.child('users').child(fbid);
      user.child('experiments').push(posts, deferred.resolve);
      return deferred.promise;
    },
    /**
     * Takes a user's fbid and returns the experiments made by the user.
     *
     * @param  fbid      the facebook user id
     * @param  limit     the number of experiments to return
     * @param  deferred promise containing Firebase data snapshot
     */
    getExperiments: function(fbid, limit) {
      var deferred = $q.defer();
      var abPostListRef = rootRef.child('users').child(fbid).child('experiments');
      $rootScope.$apply(function() {
        abPostListRef.limit(limit).once('value', function(snapshot) {
          var data = snapshot.val();
          if (data) {
            deferred.resolve(data);
          } else {
            deferred.reject('Data not found')
          }
        });
      });
      return deferred.promise;
    },
    
    syncGetExperiments: function(fbid, limit) {
       
    }
  };
}); 
