angular.module('app.services.comercios', [])
.service("ComerciosService", function($rootScope, $q, BaseComercios) {
	
	function mapNombreCadena(doc) {
		       emit(doc.nombrecadena);	    
		}
	this.comerciosPorCadena = function(cadena){
		return BaseComercios.query(mapNombreCadena, {
			  key          : cadena,
			  include_docs : true
			}).then(function (res) {
				  	return res.rows;
				}).catch(function (err) {
				  	return null;
			});
	}
	
	this.provincias = function(){
		return BaseComercios.get('provincias').then(function(doc){
			return doc.provincias;
		});
	}
	
	this.comerciosFiltrados = function(provincia, localidad,cadena){
		return BaseComercios.query(function(doc,emit){
			if(doc.nombrecadena == cadena && doc.provincia == provincia && doc.localidad == localidad){
				emit(doc);
			}
		}).then(function (res) {
				  	return res.rows;
		}).catch(function (err) {
				  	return null;
			});
	}
	

	
});