angular.module('app.services.login', [])
.service("LoginService", function($rootScope, $q, BaseLocal) {
   var database = BaseLocal;
   
   
  // For the purpose of this example I will store user data on ionic local storage but you should save it on a database
  var setFacebookUser = function(user_data) {
    window.localStorage.starter_facebook_user = JSON.stringify(user_data);
  };

  var getFacebookUser = function(){
    return JSON.parse(window.localStorage.starter_facebook_user || '{}');
  };

  return {
    getFacebookUser: getFacebookUser,
    setFacebookUser: setFacebookUser
  };
    
})