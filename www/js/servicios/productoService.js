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
	
	this.obtenerDetalleProducto = function(producto, comercio, medioDePago,descuento, fecha){
		
		var costo = {
				valorTotal: 0,
				descuentoTotal: 0,
				valorLista:0,
				productos: []
			};
		var precioASumar = null;
		producto.descuento = 0;
					
			for(var k = 0; producto.precios.length > k;k++){
				if(producto.precios[k].id == comercio._id){
					//estamos en el comercio seleccionado
					
					producto.lista = producto.precios[k].lista;					
					for(var l = 0; producto.precios[k].promociones.length > l ;l++){
						if(producto.precios[k].promociones[l].plastico < 1 || producto.precios[k].promociones[l].plastico == medioDePago.tarjeta._id){
							//La promoción no implica plástico o tiene el plástico de la promoción
							if(producto.precios[k].promociones[l].banco < 1 || producto.precios[k].promociones[l].banco == medioDePago.banco._id){
								//La promoción no implica ningún banco o el plastico es del banco de la promoción										
									if(producto.precios[k].promociones[l].tarjeta < 1 || producto.precios[k].promociones[l].tarjeta == descuento._id){
										//La promoción no implica tarjeta de descuento o tiene la tarjeta de descuento
										if(producto.precios[k].promociones[l].valor > 0){
											//promocion estilo precios cuidados
											producto.descuento = precioASumar-  producto.precios[k].promociones[l].valor * producto.cantidad ;											
										}else if (producto.precios[k].promociones[l].cantidad > 0){
											//promocion tipo 2x1
											producto.descuento = producto.precios[k] * producto.cantidad * producto.precios[k].promociones[l].porcentaje;											
										}else if(producto.precios[k].promociones[l].porcentaje > 0){
											//promociones tipo 20% de descuento con credito
											producto.descuento = producto.precios[k] * producto.cantidad * producto.precios[k].promociones[l].porcentaje;											
										}
										//se aplicó alguno de los tipos de promoción, salimso del for de promociones
										l = 64000; //para salir de promociones											
									}
							}
						}
					}//cierre FOR promociones		
					k = 64000;//para salir de comercios
				}
			}//ciere For de PRECIOS			
		
		producto.aPagar = Number(producto.lista) - Number(producto.descuento) ;
		
		return producto;
	}
});