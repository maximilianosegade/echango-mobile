   
angular.module('app.controllers.login', [])
.controller('loginCtrl', function($scope,BaseLocal,$ionicModal,$state,$q,$ionicLoading,LoginService,$ionicActionSheet) {
  
    var dbLocal = BaseLocal;
    //$scope.showFB = true;
    //$scope.showGooglePlus = true;

  // Facebook Functionality
  // This is the success callback from the login method

  //Facebook Login
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
      alert('¡Se ha iniciado sesión con Facebook exitosamente!');
      //$scope.showFB = false;
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
    		var facebookUser = LoginService.getFacebookUser('facebook');

    		if(!facebookUser.userID){
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
            alert('¡Éxito!')
            //$scope.showFB = false;
            //$scope.apply();
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


  // Facebook Logout
  $scope.facebookUser = LoginService.getFacebookUser();

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
          alert('Éxito logout FB')
          $scope.showFB = true;
          //$state.go('menu.login');
        },
        function(fail){
            alert('Falló logout FB')
            
        });
        $ionicLoading.hide();
        return true;
			}
		});
  
	};

  // Google+ Functionality
  // This method is executed when the user press the "Sign in with Google" button

  //Google+ Login
  $scope.googleSignIn = function() {
    $ionicLoading.show({
      template: 'Logging in...'
    });

    window.plugins.googleplus.login(
      {},
      function (user_data) {
        // For the purpose of this example I will store user data on local storage
        LoginService.setGooglePlusUser({
          userID: user_data.userId,
          name: user_data.displayName,
          email: user_data.email,
          picture: user_data.imageUrl,
          accessToken: user_data.accessToken,
          idToken: user_data.idToken
        });
        alert('Google+ login success!');
        $ionicLoading.hide();
        $scope.showGooglePlus = false;
        //$state.go('app.home');
      },
      function (msg) {
        alert('Google+ login fail!');
        $ionicLoading.hide();
      }
    );
  };


  //Google+ Logout
	$scope.googleUser = LoginService.getGooglePlusUser();

	$scope.showGooglePlusLogOutMenu = function() {
		var hideSheet = $ionicActionSheet.show({
			destructiveText: 'Cerrar sesión',
			titleText: '¿Está seguro que desea cerrar sesión con Google+?',
			cancelText: 'Cancel',
			cancel: function() {},
			buttonClicked: function(index) {
				return true;
			},
			destructiveButtonClicked: function(){
				$ionicLoading.show({
					template: 'Logging out...'
				});
				// Google logout
				window.plugins.googleplus.logout(
					function (msg) {
						console.log(msg);
						$ionicLoading.hide();
            alert('Logout success!')
            $scope.showGooglePlus = true;
						//$state.go('welcome');
					},
					function(fail){
            alert('Google+ logout fail')
						console.log(fail);
					}
				);
        $ionicLoading.hide();
        return true;
			}
		});
	};

})