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
});