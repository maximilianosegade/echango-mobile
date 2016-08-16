   
angular.module('app.controllers.login', [])
.controller('loginCtrl', function($scope,BaseLocal,$ionicModal,$state,$q,$ionicLoading,LoginService,$ionicActionSheet) {
  
    var dbLocal = BaseLocal;
    $scope.showFB = true;

  // This is the success callback from the login method
  var fbLoginSuccess = function(response) {
    if (!response.authResponse){
      fbLoginError("Cannot find the authResponse");
      return;
    }

    var authResponse = response.authResponse;

    getFacebookProfileInfo(authResponse)
    .then(function(profileInfo) {
      // For the purpose of this example I will store user data on local storage
      LoginService.setFacebookUser({
        authResponse: authResponse,
				userID: profileInfo.id,
				name: profileInfo.name,
				email: profileInfo.email,
        picture : "http://graph.facebook.com/" + authResponse.userID + "/picture?type=large"
      });
      $ionicLoading.hide();
      //$state.go('menu.eChango');
    }, function(fail){
      // Fail get profile info
      alert('getFacebookProfileInfo fail')
      console.log('profile info fail', fail);
    });
  };

  // This is the fail callback from the login method
  var fbLoginError = function(error){
    alert('fbLoginError')
    console.log('fbLoginError', error);
    $ionicLoading.hide();
  };

  // This method is to get the user profile info from the facebook api
  var getFacebookProfileInfo = function (authResponse) {
    var info = $q.defer();

    facebookConnectPlugin.api('/me?fields=email,name&access_token=' + authResponse.accessToken, null,
      function (response) {
				console.log(response);
        info.resolve(response);
      },
      function (response) {
				console.log(response);
        info.reject(response);
      }
    );
    return info.promise;
  };

  //This method is executed when the user press the "Login with facebook" button
  $scope.facebookSignIn = function() {
    facebookConnectPlugin.getLoginStatus(function(success){
      if(success.status === 'connected'){
        // The user is logged in and has authenticated your app, and response.authResponse supplies
        // the user's ID, a valid access token, a signed request, and the time the access token
        // and signed request each expire
        console.log('getLoginStatus', success.status);
        // Check if we have our user saved
    		var user = LoginService.getFacebookUser('facebook');

    		if(!user.userID){
					getFacebookProfileInfo(success.authResponse)
					.then(function(profileInfo) {
						// For the purpose of this example I will store user data on local storage
						LoginService.setFacebookUser({
							authResponse: success.authResponse,
							userID: profileInfo.id,
							name: profileInfo.name,
							email: profileInfo.email,
							picture : "http://graph.facebook.com/" + success.authResponse.userID + "/picture?type=large"
						});
            alert('Success!')
            $scope.showFB = false;
            $scope.apply();
						//$state.go('menu.eChango');
					}, function(fail){
						// Fail get profile info
            alert('getFacebookUser fail')
						console.log('profile info fail', fail);
					});
				}else{
          $scope.showFB = false;
          $scope.apply();
					//$state.go('menu.eChango');
				}
      } else {
        // If (success.status === 'not_authorized') the user is logged in to Facebook,
				// but has not authenticated your app
        // Else the person is not logged into Facebook,
				// so we're not sure if they are logged into this app or not.
        alert('app not authenticated')
				console.log('getLoginStatus', success.status);

				$ionicLoading.show({
          template: 'Iniciando sesión...'
        });

				// Ask the permissions you need. You can learn more about
				// FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
        facebookConnectPlugin.login(['email','public_profile'], fbLoginSuccess, fbLoginError);
      }
    });
  };    

    $scope.user = LoginService.getFacebookUser();

	$scope.showFacebookLogOutMenu = function() {
		var hideSheet = $ionicActionSheet.show({
			destructiveText: 'Cerrar Sesión',
			titleText: '¿Está seguro que desea cerrar sesión con Facebook?',
			cancelText: 'Cancel',
			cancel: function() {},
			buttonClicked: function(index) {
				return true;
			},

			destructiveButtonClicked: function(){
				$ionicLoading.show({
				  template: 'Cerrando sesión...'
				});

        // Facebook logout
        facebookConnectPlugin.logout(function(){
          alert('Éxito!')
          $scope.showFB = true;
          //$state.go('menu.login');
        },
        function(fail){
            alert('Falló')
            
        });
        $ionicLoading.hide();
        return true;
			}
		});
  
	};

})