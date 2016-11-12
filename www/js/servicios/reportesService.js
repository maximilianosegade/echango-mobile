angular.module('app.services.reporte', [])
.service("ReporteService", function($rootScope, $q, BaseProductos, ComprarService) {
	
	//n es la cantidad de productos a listar
	this.productosMasComprados = function(n){
		return ComprarService.obtenerCompras(false).then(function(compras){
			//cada elemento de compras tiene los datos en .doc
			/* cada compra tiene un objeto COSTO
			cada objeto COSTO tiene un array PRODUCTOS
			cada elemento del array PRODUCTOS es un objeto así
			
			 * {
			        "_id": "7891136052000",
			        "nombre": "Campari",
			        "precio": 120
      			}
      			donde el id es el EAN
      			cada compra tiene también una FECHA, sinembargo, el ID debería dejarlas ordenadas de más vieja a más nueva
      			*/
			var productoCompra = {};
			var eans = [];
			resultado = [];
			for(var i=0; compras.length>i;i++){
				//recorro los productos de la compra
				for(var j = 0; compras[i].doc.productos.length > j; j++){
					if(compras[i].doc.productos[j]._id in productoCompra){
						productoCompra[compras[i].doc.productos[j]._id ].push({fecha: compras[i].doc.fecha, valor: compras[i].doc.productos[j].precio_lista});
					}else{
						eans.push({_id: compras[i].doc.productos[j]._id, nombre: compras[i].doc.productos[j].nombre});
						productoCompra[compras[i].doc.productos[j]._id ] = [];
						productoCompra[compras[i].doc.productos[j]._id ].push({fecha: compras[i].doc.fecha, valor: compras[i].doc.productos[j].precio_lista });
					}
				}
			}
			var max = 0;
			var posicionEanRemover = -1;
			for(var l = 0; n>l;l++){						
				for(var k = 0; eans.length >k; k++){
					//cantidad de veces que se compró un producto
					if (productoCompra[eans[k]._id].length > max){
						max = productoCompra[eans[k]._id].length ;
						posicionEanRemover = k;
					}
				}
				if(posicionEanRemover > -1){
					resultado.push({_id: eans[posicionEanRemover]._id, nombre:  eans[posicionEanRemover].nombre, valores: productoCompra[eans[posicionEanRemover]._id]});
					eans.splice(posicionEanRemover,1);//no vuele a buscar este ean
				}
				max = 0;
				posicionEanRemover = -1;	
			}
			return resultado;
		});
		
	}
	
	this.preciosPorProducto = function(ean){
		//primero obtengo las compras
		//le paso false porque no quiero las simuladas sino las reales
		ComprarService.obtenerCompras(false).then(function(compras){
			/* cada compra tiene un objeto COSTO
			cada objeto COSTO tiene un array PRODUCTOS
			cada elemento del array PRODUCTOS es un objeto así
			
			 * {
			        "_id": "7891136052000",
			        "nombre": "Campari",
			        "precio": 120
      			}
      			donde el id es el EAN
      			cada compra tiene también una FECHA, sinembargo, el ID debería dejarlas ordenadas de más vieja a más nueva
      			*/
			var resultado = {};
			for(var i=0; compras.length<i;i++){
				//recorro los productos de la compra
				for(var j = 0; compras[i].costo.productos.length ; j++){
					if(compras[i].costo.productos[j]._id in resultado){
						resultado[compras[i].costo.productos[j]._id ].push({fecha: compras[i].fecha, valor: compras[i].costo.productos[j].precio});
					}else{
						resultado[compras[i].costo.productos[j]._id ] = [];
						resultado[compras[i].costo.productos[j]._id ].push({fecha: compras[i].fecha, valor: compras[i].costo.productos[j].precio});
					}
				}
			}
			
		});
	}
	
})