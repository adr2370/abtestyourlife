'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers', 'facebook', 'firebase']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {templateUrl: 'partials/splash-screen.html', controller: 'loginCtrl'});
    $routeProvider.when('/dashboard', {templateUrl: 'partials/dashboard.html', controller: 'dashCtrl'});
    $routeProvider.otherwise({redirectTo: '/dashboard'});
  }])

  .run(['$rootScope', '$window', 'srvAuth', 
	function($rootScope, $window, sAuth) {
    $rootScope.login = function() {
      FB.login(function(){},{scope: 'publish_actions'});
    }
    
    $rootScope.user = {};
  
   // $window.fbAsyncInit = function() {
      // Executed when the SDK is loaded
      FB.init({ 
        appId: '483625751727439', 
        channelUrl: '/channel.html', 
        status: true, 
        cookie: true, 
        xfbml: true 
      });
  
      sAuth.watchAuthenticationStatusChange();
  
    //};
  
    // Are you familiar to IIFE ( http://bit.ly/iifewdb ) ?
  
    (function(d){
      // load the Facebook javascript SDK
  
      var js, 
      id = 'facebook-jssdk', 
      ref = d.getElementsByTagName('script')[0];
  
      if (d.getElementById(id)) {
        return;
      }
  
      js = d.createElement('script'); 
      js.id = id; 
      js.async = true;
      js.src = "//connect.facebook.net/en_US/all.js";
  
      ref.parentNode.insertBefore(js, ref);
  
    }(document));
  
}]);