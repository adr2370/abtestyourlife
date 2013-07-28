angular.module('myApp.services')
.factory('userIDGetter', function($rootScope, $q) {
  var d = $q.defer();
  var getID = function(user) {
    if (user && user.id) { 
      d.resolve(user.id);
    }
  };
  getID($rootScope.user); //initial call
  $rootScope.$watch('user', function(user) {
    getID(user);
  });
  return d.promise;
})
.factory('ff', function($rootScope, angularFire, $q) {
  console.log('ff load');
  var d = $q.defer();
  var getPromise = function(user) {
    if (user && user.id) {
      var url = 'https://dteam2013.firebaseio.com/users/' + user.id + '/experiment';
      var promise = angularFire(url, $rootScope, 'fBaseData', {});
      d.resolve(promise);
    }
  };
  getPromise($rootScope.user);
  $rootScope.$watch('user', function(user) {
    getPromise(user);
  });
  
  return d.promise;
})
.service('fBase', function($q, $rootScope, userIDGetter) {
  var rootRef = new Firebase('https://dteam2013.firebaseio.com');
  
  return {
    getExperimentPosts: function(fbid, experimentID) {
      var deferred = $q.defer();
      var user = rootRef.child('users').child(fbid).child('experiments').child(experimentID);
      user.on('value', deferred.resolve);
      return deferred.promise;
    },
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
    saveExperiment: function(fbid, posts, type, name, callback) {
      var deferred = $q.defer();
      var user = rootRef.child('users').child(fbid);
      posts['type']=type;
      posts['testName']=name;
      posts['timeCreated']=Math.floor(new Date().getTime());
      user.child('experiments').push(posts, deferred.resolve);
      return deferred.promise;
    },
    deleteExperiment: function(fbid, experimentID) {
      var user = rootRef.child('users').child(fbid);
      user.child('experiments').child(experimentID).remove();
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
        abPostListRef.once('value', function(snapshot) {
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
       
    },
    
    getUserFirebaseRef: function() {
      var d = $q.defer();
      userIDGetter.then(function(id) {
        var abPostListRef = rootRef.child('users').child(id).child('experiments');
        d.resolve(abPostListRef);
      });
      return d.promise;
    }
  };
}); 
