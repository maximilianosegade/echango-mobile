angular.module('app.services.producto', [])
.service("ProductoService", function($rootScope, $q, BaseProductos) {
	var database = BaseProductos;
	function mapNombreProducto(doc) {
	       emit(doc.nombre);
	    
	};
	function mapEANProducto(doc) {
	       emit(doc.ean);
	    
	};
	this.getProductoPorNombre = function(nombreProducto){
		return database.query(mapNombreProducto, {
			  startkey          : nombreProducto,
			  endkey 			 : nombreProducto +'\uffff',
			  include_docs : true
			}).then(function (res) {
				  	return res.rows;
				}).catch(function (err) {
				  	return null;
			});
	};
	this.getProductoPorEAN = function(ean){
		return database.get(ean).then(function(doc){
	           return doc;
	         });
	};
});