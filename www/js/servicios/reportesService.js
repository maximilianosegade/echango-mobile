angular.module('app.services.reporte', [])
.service("ReporteService", function($rootScope, $q, BaseProductos, ComprarService) {
	
	//n es la cantidad de productos a listar
	this.productosMasComprados = function(n){
		return ComprarService.obtenerCompras(false).then(function(compras){
			//cada elemento de compras tiene los datos en .doc
			for(var i = 0; i > compras.length;i++){
				
			}
		});
		
	}
	
	this.preciosPorProducto = function(ean){
		
	}
	
})