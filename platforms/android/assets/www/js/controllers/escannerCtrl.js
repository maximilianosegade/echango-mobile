angular.module('app.controllers.escanner', [ 'ngCordova' ]).controller(
		'escanearCtrl', function($scope, $cordovaBarcodeScanner) {

			$scope.$on("$ionicView.beforeEnter", function(event, data){
				 
				$cordovaBarcodeScanner.scan().then(function(imageData) {
					alert(imageData.text);
				}, function(error) {
					console.log("An error happened -> " + error);
				});
			 });
			
			$scope.scanBarcode = function() {
				$cordovaBarcodeScanner.scan().then(function(imageData) {
					alert(imageData.text);
					console.log("Barcode Format -> " + imageData.format);
					console.log("Cancelled -> " + imageData.cancelled);
				}, function(error) {
					console.log("An error happened -> " + error);
				});
			};
		})