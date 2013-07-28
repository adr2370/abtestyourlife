// Additional JS functions here
window.fbAsyncInit = function() {
  FB.init({
    appId      : '483625751727439', // App ID
    channelUrl : '//dteam2013-19893.usw1.actionbox.io:3000/channel.html', // Channel File
    status     : true, // check login status
    cookie     : true, // enable cookies to allow the server to access the session
    xfbml      : true  // parse XFBML
  });
  
  FB.Event.subscribe('auth.authResponseChange', function(response) {
    console.log('response!', response);//.status);
  });
};