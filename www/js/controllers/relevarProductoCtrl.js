angular.module('app.controllers.relevarProducto', [ 'ngCordova' ]).controller(
		'relevarProductoCtrl', function($scope, /*$cordovaBarcodeScanner,*/ EscannerService, $state) {

			$scope.scanBarcode = function() {
                /*
				$cordovaBarcodeScanner.scan().then(function(imageData) {
					alert(imageData.text);
					console.log("Barcode Format -> " + imageData.format);
					console.log("Cancelled -> " + imageData.cancelled);
				}, function(error) {
					console.log("An error happened -> " + error);
				});
                */
                EscannerService.scanBarcode().then(function(barcode) {
                    //alert(barcode);
                    var ean = EscannerService.getCurrentEAN();
                    alert(ean);
                    $state.go('menEChango.informarProducto');
                });

			};
		})