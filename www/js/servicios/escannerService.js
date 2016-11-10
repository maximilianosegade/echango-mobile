angular.module('app.services.escanner', [])
.service("EscannerService", function($cordovaBarcodeScanner) {

		var currentEAN = '';
		var currentComercio;

		this.scanBarcode = function() {

			if (currentComercio) {
					return $cordovaBarcodeScanner.scan().then(function(imageData) {
				currentEAN = imageData.text;
				}, function(error) {
			console.log("An error happened -> " + error);
			alert(error);
			return "ERROR";
		});
			} else {
				alert('Debe especificar el comercio para el cual está relevando antes de continuar.')
			}

	};

		this.getCurrentEAN = function () {
			return currentEAN;
			
	}

	this.getCurrentComercio = function () {
		return currentComercio;
	}

	this.setCurrentComercio = function(comercio) {
		currentComercio = comercio;
	}

});