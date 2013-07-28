'use strict';

/* Services */

angular.module('myApp.services', []);

// Facebook SDK
angular.module('facebook', [])
.service('srvAuth', function($rootScope, $location, $q) {
  return {
    watchAuthenticationStatusChange: function() {
      var _self = this;
      $rootScope.isUserLoggedIn = false;
      
      var checkLoginStatus = function(response) {
        if (response.status === 'connected') {
          $rootScope.$apply(function(){
            $location.path('/dashboard');
            $rootScope.isUserLoggedIn = true;
            _self.getUserInfo();
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
    didGrantPermissions: function() {
      var _self = this;
      var deferred = $q.defer();
      FB.api('/me/permissions', function(response) {
        $rootScope.$apply(function() {
          deferred.resolve(response.data.publish_actions==true);
        });
      });
      return deferred.promise;
    },
    getUserInfo: function() {
      var _self = this;
      FB.api('/me', function(response) {
        $rootScope.$apply(function() { 
          $rootScope.user = _self.user = response; 
        });
      });
    }
  }
});