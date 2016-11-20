angular.module('app.services.escanner', [])
.service("EscannerService", function($cordovaBarcodeScanner, BaseComercios) {

		var currentEAN = '';
		var currentComercio;

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

	this.getCurrentComercio = function () {
		return currentComercio;
	}

	this.setCurrentComercio = function(comercio) {
		currentComercio = comercio;
	}

	this.setCurrentComercioById = function(id) {
		var obj = {};
		BaseComercios.get(id).then(function(doc){
				obj._id = doc._id;
				obj.nombre = doc.cadena;
				obj.direccion = doc.direccion	
			}).catch(function(err){
				alert('No se encontro comercio. Error ->' + err);
			})

		currentComercio = obj;
	}

});