angular.module('app.services.escanner', [])
.service("EscannerService", function($cordovaBarcodeScanner) {
	this.scanBarcode = function() {
		return $cordovaBarcodeScanner.scan().then(function(imageData) {
			return imageData.text;
		}, function(error) {
			console.log("An error happened -> " + error);
			return "ERROR";
		});
	};
});