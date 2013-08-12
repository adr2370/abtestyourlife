'use strict';

/* Services */

angular.module('myApp.services', []);

// Facebook SDK
angular.module('facebook', [])
.service('srvAuth', function($rootScope, $location, $q) {
  var didGrantPermissions = function() {
    var _self = this;
    var deferred = $q.defer();
    FB.api('/me/permissions', function(response) {
      $rootScope.$apply(function() {
        deferred.resolve(response.data[0].publish_actions);
      });
    });
    return deferred.promise;
  }
  return {
    watchAuthenticationStatusChange: function() {
      var _self = this;
      $rootScope.isUserLoggedIn = false;
      
      var checkLoginStatus = function(response) {
        if (response.status === 'connected') {
          didGrantPermissions().then(function(result) {
            if(!result) {
              alert('Proper persmissions have not been granted.');
              FB.logout();
            } else {
              $location.path('/dashboard');
              $rootScope.isUserLoggedIn = true;
              _self.getUserInfo();
            }
          });
        } 
        else {
          $rootScope.$apply(function(){
            $location.path('/');
          });
        }
      };
      
      FB.getLoginStatus(function(response) {
        checkLoginStatus(response);
      });
    
      FB.Event.subscribe('auth.authResponseChange', function(response) {
        checkLoginStatus(response);
      })
    },
    didGrantPermissions: didGrantPermissions,
    getUserInfo: function() {
      var _self = this;
      var d = $q.defer();
      FB.api('/me?fields=picture,name,link', function(response) {
        FB.api('/me/friends', function(friendResponse) {
          $rootScope.$apply(function() { 
            $rootScope.user = _self.user = response;
            $rootScope.friendCount = friendResponse.data.length;
            d.resolve(_self.user);
          });
        });
      });
      return d.promise;
    }
  }
});