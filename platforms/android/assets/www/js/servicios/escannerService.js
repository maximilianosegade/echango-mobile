angular.module('app.services.escanner', [])
.service("EscannerService", function($cordovaBarcodeScanner) {

		var currentEAN = '';

		this.scanBarcode = function() {
		return $cordovaBarcodeScanner.scan().then(function(imageData) {
			currentEAN = imageData.text;
			return imageData.text;
		}, function(error) {
			console.log("An error happened -> " + error);
			alert(error);
			return "ERROR";
		});
	};

		this.getCurrentEAN = function () {
			return currentEAN;
			
	}

});