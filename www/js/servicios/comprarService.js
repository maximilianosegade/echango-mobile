angular.module('app.services.compras', [])
.service("ComprarService", function(BaseLocal,ProductoService) {
	
	var comercio = null;
	var lista = null;
	var simular = false;
	var simulacion = null;
	
	this.seleccionarComercio = function (com){
		comercio = com;
	}
	

	this.comercioSeleccionado = function (){
		return comercio;
	}
	
	
	this.seleccionarLista = function (lis){
		lista = lis;
	}
	

	this.listaSeleccionada = function (){
		return lista;
	}
	/*
	 * Cada elemento de la lista es de la forma, donde precio es un elemento de precios
	 * {
		     					_id: '088004144708',
		                   nombre: 'Fireball Cinamon whisky 60ml',
		                   ean: '088004144708',
		                   etiquetas: ['Whisky','alcohol'],
		                   precios: [{id: '1',
		                	   					lista: 200,
		                	   					promociones:[{plastico:1,
	            			   						banco:1,
	            			   						tarjeta:1,
	            			   						acumulable: 0,
	            			   						valor: 170},{plastico:2,
		            			   						banco:2,
		            			   						tarjeta:0,
		            			   						acumulable: 0,
		            			   						valor: 170},
		            			   						{plastico:1,
			            			   						banco:0,
			            			   						tarjeta:0,
			            			   						acumulable: 0,
			            			   						valor: 170}]},
					                	   {id: '2',
					                		   lista: 300,
					                		   promociones:[{plastico:1,
	            			   						banco:1,
	            			   						tarjeta:1,
	            			   						acumulable: 0}]},
					                	   {id: '3',
					                		   lista: 270,
					                		   promociones:[{plastico:1,
	            			   						banco:1,
	            			   						tarjeta:1,
	            			   						acumulable: 0}]}],
		   						precio: {id: '1',
		                	   					lista: 200,
		                	   					promociones:[{plastico:1,
	            			   						banco:1,
	            			   						tarjeta:1,
	            			   						acumulable: 0,
	            			   						valor: 170},{plastico:2,
		            			   						banco:2,
		            			   						tarjeta:0,
		            			   						acumulable: 0,
		            			   						valor: 170},
		            			   						{plastico:1,
			            			   						banco:0,
			            			   						tarjeta:0,
			            			   						acumulable: 0,
			            			   						valor: 170}]}
		                 }
	 * 
	 * */
	
	function actualizarProductos(productos, productosNuevos){
		
		if(productos.length > 0){
			return ProductoService.getProductoPorEAN(productos[0].ean).then(function (producto){	
				 producto.cantidad = productos[0].cantidad;
				 productosNuevos.push(producto);
				 productos.splice(0,1);
				 if(productos.length < 1){
					 return productosNuevos;
				 }else{
					 return actualizarProductos(productos, productosNuevos);
				 }
			 });
		}
		
	}
	
	this.simularCompra = function(lista, comercio, mediosDePagoRegistrados,tarjetasPromocionalesRegistradas ){
		
		
		return actualizarProductos(lista.productos, []).then(function( productosNuevos){
			lista.productos = productosNuevos;
			var simulacion = {};
			var costos = [];
			var costo = {
								medioDePago: null,
									valorTotal: 0,
									productos: []
								};
			var precioASumar = null;
			for(var i=0; mediosDePagoRegistrados.length >i ; i++){
				costo.medioDePago = mediosDePagoRegistrados[i];
				for(var j=0;productosNuevos.length > j; j++){
					
					for(var k = 0; productosNuevos[j].precios.length > k;k++){
						if(productosNuevos[j].precios[k].id == comercio._id){
							//estamos en el comercio seleccionado
							
							precioASumar = productosNuevos[j].precios[k].lista * productosNuevos[j].cantidad;
							seguirPromocion = true;
							for(var l = 0; productosNuevos[j].precios[k].promociones.length > l ;l++){
								if(productosNuevos[j].precios[k].promociones[l].plastico < 1 || productosNuevos[j].precios[k].promociones[l].plastico == mediosDePagoRegistrados[i].tarjeta._id){
									//La promoción no implica plástico o tiene el plástico de la promoción
									if(productosNuevos[j].precios[k].promociones[l].banco < 1 || productosNuevos[j].precios[k].promociones[l].banco == mediosDePagoRegistrados[i].banco._id){
										//La promoción no implica ningún banco o el plastico es del banco de la promoción
										for (var m = 0; tarjetasPromocionalesRegistradas.length >m; m++){
											if(productosNuevos[j].precios[k].promociones[l].tarjeta < 1 || productosNuevos[j].precios[k].promociones[l].tarjeta == tarjetasPromocionalesRegistradas[m]._id){
												//La promoción no implica tarjeta de descuento o tiene la tarjeta de descuento
												if(productosNuevos[j].precios[k].promociones[l].valor > 0){
													//promocion estilo precios cuidados
													precioASumar = productosNuevos[j].precios[k].promociones[l].valor * productosNuevos[j].cantidad;
												}else if (productosNuevos[j].precios[k].promociones[l].cantidad > 0){
													//promocion tipo 2x1
													precioASumar = productosNuevos[j].precios[k] * productosNuevos[j].cantidad * productosNuevos[j].precios[k].promociones[l].porcentaje;
												}else if(productosNuevos[j].precios[k].promociones[l].porcentaje > 0){
													//promociones tipo 20% de descuento con credito
													precioASumar = productosNuevos[j].precios[k] * productosNuevos[j].cantidad * productosNuevos[j].precios[k].promociones[l].porcentaje;
												}
												l = 64000; //para salir de promociones
												break;
											}
										}
										
									}
								}
							}//cierre FOR promociones
							//recorrida las promociones o encontró una o dejó el precio de lista
							costo.productos.push({_id: productosNuevos[j]._id,
								nombre: productosNuevos[j].nombre,
								precio: precioASumar});
							costo.valorTotal =+ precioASumar;
							k = 64000;//para salir de comercios
						}
					}
				}//cierre for medios de pago
				costos.push(costo);
				costo = {
						medioDePago: null,
						valorTotal: 0,
						productos: []
					};
			}
			
			simulacion.costos = costos;
			simulacion.lista = lista;
			simulacion.comercio = comercio;
			return simulacion;
		});
		
		
	}
	
	
	
	
	
})