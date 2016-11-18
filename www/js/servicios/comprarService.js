angular.module('app.services.compras', [])

.service("ComprarService", function(BaseLocal,BaseProductos, BaseCompras, BaseSimulaciones,BasePreciosPorComercio, LoginService) {

	
	var comercio = null;
	var lista = null;
	var medioDePago = null;
	var descuento = null;
	var simular = false;
	var simulacion = null;
	var parametrosSim = null;
	var mediosDePagoRegistrados = [];
	var tarjetasPromocionalesRegistradas = [];
	
	this.obtenerParametrosSimulacion = function(){
		return BaseLocal.get('parametrosSimulacion').then(function(doc){
			actualizarParametrosSimulacion(doc);
			parametrosSim = doc;
			return doc;
		});
	}
	
	function updateParametros(){
		return BaseLocal.get('parametrosSimulacion').then(function(doc) {
			doc.comercio = parametrosSim.comercio;
			doc.lista = parametrosSim.lista;
			doc.medioDePago = parametrosSim.medioDePago;
			doc.descuento = parametrosSim.descuento;		
   	        return BaseLocal.put(doc);
        })
	}
	
	function actualizarParametrosSimulacion(doc){		
			this.comercio = doc.comercio;
			this.lista = doc.lista;
			this.medioDePago = doc.medioDePago;
			this.descuento = doc.descuento;			
	}
	
	this.seleccionarComercio = function (com){		
		parametrosSim.comercio = com;
		return updateParametros();
	}
	
	this.seleccionarLista = function (lis){
		parametrosSim.lista = lis;		
		return updateParametros();		
	}
	
	this.seleccionarMedioDePago = function (medioDePago){		
		parametrosSim.medioDePago = medioDePago;
		return updateParametros();
	}
	
	this.seleccionarDescuento = function (descuento){
		parametrosSim.descuento = descuento;		
		return updateParametros();		
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
			
			return BaseProductos.get(productos[0]._id).then(function (producto){	
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
	
	function aplicarPromociones (precio, cantidad, promociones, medioDePago,descuento,fecha){

		var descuentoActual  = 0;
		var precioASumar = precio * cantidad ;
		var dia = fecha.getDay();
		for(var l = 0; promociones && promociones.length > l ;l++){
			var promocion = promociones[l];
			if(promocion.plastico < 1 || promocion.plastico == medioDePago.tarjeta._id){
				//La promoción no implica plástico o tiene el plástico de la promoción
				if(promocion.banco < 1 || promocion.banco == medioDePago.banco._id){
					//La promoción no implica ningún banco o el plastico es del banco de la promoción										
						if(promocion.tarjeta < 1 || promocion.tarjeta == descuento._id){
							//La promoción no implica tarjeta de descuento o tiene la tarjeta de descuento
														
							if (promocion.dias.indexOf(dia)>-1){
								if(promocion.valor > 0){
									//promocion estilo precios cuidados
									descuentoActual = (precio -  promocion.valor) * cantidad ;
									precioASumar = promocion.valor * cantidad;
								}else if (promocion.cantidad > 0 && cantidad>=promocion.cantidad){
									//promocion tipo 2x1
									descuentoActual = precio * cantidad * promocion.porcentaje;
									precioASumar = precio * cantidad -descuentoActual;
								}else if(promocion.porcentaje > 0){
									//promociones tipo 20% de descuento con credito
									descuentoActual = precio * cantidad * promocion.porcentaje;
									precioASumar = precio * cantidad -descuentoActual;
								}		
								//se aplicó alguno de los tipos de promoción, salimso del for de promociones
								l = 64000; //para salir de promociones	
							}
																	
						}
				}
			}
		}
		var resultado = [];
		resultado.push(descuentoActual);
		resultado.push(precioASumar);
		return  resultado;
	}
	
	this.aplicarPromociones = function (precio, cantidad, promociones, medioDePago,descuento,fecha){
		return aplicarPromociones(precio, cantidad, promociones, medioDePago,descuento,fecha);
	}
	
	function determinarPrecioProducto(precio, cantidad, promocion, fecha){
		//medio de pago 0
		//promocion 2
		var descuentoActual = 0;
		var precioASumar = 0;
		if(promocion.valor > 0){
			//promocion estilo precios cuidados
			descuentoActual = (precio -  promocion.valor) * cantidad ;
			precioASumar = promocion.valor * cantidad;
		}else if (promocion.cantidad > 0 && cantidad>=promocion.cantidad){
			//promocion tipo 2x1
			descuentoActual = precio * cantidad * promocion.porcentaje;
			precioASumar = precio * cantidad -descuentoActual;
		}else if(promocion.porcentaje > 0){
			//promociones tipo 20% de descuento con credito
			descuentoActual = precio * cantidad * promocion.porcentaje;
			precioASumar = precio * cantidad -descuentoActual;
		}
		var resultado = [];
		resultado.push(descuentoActual);
		resultado.push(precioASumar);
		return  resultado;
	}
	
	this.simularCompra = function(lista, comercio, medioDePago,descuento,fecha ){
		
        return BasePreciosPorComercio.get(comercio._id).then(function(precios){
            for (var i=0; i<lista.productos.length; i++){
                
                var precio = precios.precios[lista.productos[i].ean];
                precio.id = comercio._id;
                lista.productos[i].precios = [];
                lista.productos[i].precios.push(precio);
            }
            return lista.productos;    
        }).catch(function(error){
        	return actualizarProductos(lista.productos, []);  
        })
        .then(function( productosNuevos){
			lista.productos = productosNuevos;
			var simulaciones = [];
			var dias = 7;
			//fecha = new Date();
			var simulacion = {};
			var costos = [];
			var costo = {
									valorTotal: 0,
									descuentoTotal: 0,
									valorLista:0,
									productos: []
								};
			var precioASumar = null;
			var cantidad_total_articulos = 0;
			var descuentoActual = 0;
			for(; dias > 0; dias--){
				for(var j=0;productosNuevos.length > j; j++){
					
					for(var k = 0; productosNuevos[j].precios.length > k;k++){
						if(productosNuevos[j].precios[k].id == comercio._id){
							//estamos en el comercio seleccionado
							descuentoActual = 0;
							precioASumar = 0;
							costo.valorLista += productosNuevos[j].precios[k].precio * productosNuevos[j].cantidad;
							seguirPromocion = true;
							cantidad_total_articulos += productosNuevos[j].cantidad;
							var result =aplicarPromociones(productosNuevos[j].precios[k].precio,productosNuevos[j].cantidad,
									productosNuevos[j].precios[k].promociones,medioDePago,descuento,fecha);
							 
							descuentoActual = result[0];
							precioASumar = result[1];	
							
							//recorrida las promociones o encontró una o dejó el precio de lista
							costo.productos.push({_id: productosNuevos[j]._id,
								nombre: productosNuevos[j].nombre,
								precio: precioASumar});
							costo.valorTotal += precioASumar;
							costo.descuentoTotal +=  descuentoActual;
							k = 64000;//para salir de comercios
						}
					}//ciere For de PRECIOS	
				
				
			}//ciere FOR de PRODUCTOS
				
			var porcentajeDescuento = (costo.descuentoTotal / costo.valorTotal * 100).toFixed(2);
			costo.porcentajeDescuento = porcentajeDescuento;
			costo.valorTotal = costo.valorTotal.toFixed(2);
			costo.descuentoTotal  = costo.descuentoTotal.toFixed(2);
			simulacion.valorLista = costo.valorLista;
			simulacion.costo = costo;
			simulacion.porcentajeDescuento =costo.porcentajeDescuento ;
			simulacion.valorTotal =costo.valorTotal;
			simulacion.descuentoTotal =costo.descuentoTotal ;
			simulacion.cantidad_total_articulos = cantidad_total_articulos;
			simulacion.lista = lista;
			simulacion.comercio = comercio;
			simulacion.fecha = fecha.toISOString()
			  .replace(/T/, ' ')
			  .replace(/\..+/, '');
			
			if(medioDePago){
				simulacion.banco = {_id: medioDePago.banco._id,
						nombre: medioDePago.banco.nombre} ;
				
				simulacion.tarjeta = {_id: medioDePago.tarjeta._id,
						nombre: medioDePago.tarjeta.nombre} ;
			}
			
			if(descuento){
				simulacion.descuento ={_id: descuento._id,
												nombre: descuento.nombre} ;
			}
			
			simulacion.simulada = true;
			simulaciones.push(simulacion);
			simulacion = {};
			costos = [];
			costo = {
									valorTotal: 0,
									descuentoTotal: 0,
									valorLista:0,
									productos: []
								};
			cantidad_total_articulos = 0;
			fecha = new Date(fecha.setTime(fecha.getTime() + 86400000))
			}//cierre FOR Dias
			
			return simulaciones;
		});
		
		
	}
	
	this.cerrarChango = function(chango, comercio, medioDePago,descuento,fecha){
		//es diferente de la simulación porque cada producto ya sabe cuánto costó
		var compra = {};
		var nombreUsuario = LoginService.getNombreUsuario();
		compra._id = nombreUsuario +  fecha.getTime() + comercio._id;
		compra.usuario = nombreUsuario;
		
		compra.valorTotal = chango.total;
		compra.descuentoTotal = chango.descuentoTotal;
		compra.valorLista = chango.totalLista;		
		var porcentajeDescuento = (chango.descuentoTotal / chango.total * 100).toFixed(2);
		compra.porcentajeDescuento = porcentajeDescuento;
		
		compra.cantidad_total_articulos = chango.totalProductosComprados;		
		compra.productos = chango.productos;
		
		compra.comercio = comercio;
		compra.fecha = fecha.toISOString()
		  .replace(/T/, ' ')
		  .replace(/\..+/, '');
		
		if(medioDePago){
			compra.banco = {_id: medioDePago.banco._id,
					nombre: medioDePago.banco.nombre} ;
			
			compra.tarjeta = {_id: medioDePago.tarjeta._id,
					nombre: medioDePago.tarjeta.nombre} ;
		}
		
		if(descuento){
		compra.descuento ={_id: descuento._id,
											nombre: descuento.nombre} ;
		}
		
		compra.simulada = false;
		
		return compra
	}
	
	
	this.guardarCompra = function(compra){
				
		if(compra.simulada){
			compra._id = compra.fecha+ compra.comercio._id + (new Date()).getTime();
			return BaseSimulaciones.put(compra);	
		}else{
			return BaseCompras.put(compra).then(function(){
				console.log('[Guardada la compra en local - Sync START].')
				BaseCompras.replicate.to('https://webi.certant.com/echango/novedades_subida', {
					      live: false,
					      retry: true
				    	}).then(function(){
				    		console.log('[Guardada la compra Remoto - Sync FINISH].')
				    	}).catch(function(){
				    		console.log('[Error al Guardar Compra Remoto - Sync FINISH].')
				    	});
					});			
		}
		
	}
	
	
	
	this.obtenerCompras = function(simuladas){
		if(simuladas){
			return BaseSimulaciones.allDocs({
			  include_docs: true
			}).then(function (result) {
				//viene con doc
				return result.rows;
			});
		}
		return BaseCompras.allDocs({
			//viene con doc
			  include_docs: true
			}).then(function (result) {
			 return result.rows;
			});
	}
	
	function crearAlerta(producto, precioAComparar, descuentoAcomparar, comercioId, alertas){
		var deltaPrecioPorcentual = 0.9;
		var deltaPrecioAbsoluto = 50;
		
		if(precioAComparar / producto.precio_final < deltaPrecioPorcentual ||
				producto.precio_final - precioAComparar > deltaPrecioAbsoluto){
			//agrego la alerta
			var alerta = {};
			if(alertas[comercioId]){
				//ya tengo alertas para este comercio
				if(alertas[comercioId].productos[producto.ean]){
					//si lo tiene que onda? asumo que es repetido y lo ignoro, creo
				}else{
					alertas[comercioId].descuento += descuentoAcomparar;
					alertas[comercioId].productos[producto.ean] = {ean: producto.ean, precio_final: precioAComparar, descuento: descuentoAcomparar};
				}
			}else{
				//no tengo alertas para este comercio
				alerta = {
						comercioId: comercioId,
						descuento : descuentoAcomparar,
						productos: []						
				}
				alerta.productos[producto.ean] = {ean: producto.ean, precio_final: precioAComparar, descuento: descuentoAcomparar};
				alertas[comercioId] = alerta;
			}
			
		}
		
		
	}
	
	this.verificarMejorPrecio = function(producto, comercio,comerciosCercanos,fecha, alertas){

		return BasePreciosPorComercio.query(function(doc,emit){
            
			var enLaLista = false;
			
			for(var i = 0; comerciosCercanos.length > i; i++){
				if (comerciosCercanos[i] == doc._id && comercio._id != doc._id && "15-1-528" != doc._id){
					enLaLista = true;
					i = 9999;
				}
			}
			
			if(enLaLista && doc.precios[producto.ean]){
				var productoPrecio = {};
				productoPrecio = doc.precios[producto.ean];
				productoPrecio.comercioId = doc._id ;
				//productoPrecio.ean =
				emit(productoPrecio);
			}
				
                
        }).then(function(res){
        	//tratar alertas
        	//lo que recibo es
        	// {precio: 11,
        	// promociones: []}
        for(var j = 0;	res.rows.length > j;j++){
        	var result =aplicarPromociones(res.rows[j].precio,producto.cantidad,
        			res.rows[j].promociones,medioDePago,descuento,fecha);
			 
			descuentoActual = result[0];
			precioASumar = result[1];	
			
			crearAlerta(producto, precioASumar, descuentoActual, res.rows[j].id, alertas);
        }
        	
            return alertas;
        }).catch(function(err){
            return [];
        });
		
		/*
		 * 
		 * alerta = {comercioId:"",
							 * 					comercioNombre: "",
							 * 					comercioDireccion: "",
							 * productos: [ {
							 * productoEAN: "",
		 * 					productoNombre:"",
							 * 					precio:""
							 * 					ahorro:""
							 * 						} ],
							 * ahorroTotal:""
		 * 					
		 * 					
		 * 					
		 * 					
		 * }
		 * */
				
	}
	
	
this.verificarChango = function(productos, comercio, mediosDePagoRegistrados,tarjetasPromocionalesRegistradas,fecha ){
		
	//Primero averiguo cuales son los comercios contra los que tengo que comparar
	var alertas = []; 
	
	
	BasePreciosPorComercio.get(comercio._id).then(function(precios){
        for (var i=0; i<lista.productos.length; i++){
            var precio = {
                id: comercio._id, 
                lista: precios.precios[lista.productos[i].ean],
                promociones: []
            }
            lista.productos[i].precio = precio;
            lista.productos[i].precios = [];
            lista.productos[i].precios.push(precio);
        }
        return lista.productos;    
    })
		
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
						if(productosNuevos[j].precios[k].comercioId == comercio._id){
							//estamos en el comercio seleccionado
							
							precioASumar = productosNuevos[j].precios[k].lista * productosNuevos[j].cantidad;
							seguirPromocion = true;

							var result =aplicarPromociones(productosNuevos[j].precios[k].lista,productosNuevos[j].cantidad,
									productosNuevos[j].precios[k].promociones,medioDePago,descuento,fecha);
							 
							descuentoActual = result[0];
							precioASumar = result[1];	
							//recorrida las promociones o encontró una o dejó el precio de lista
							costo.productos.push({_id: productosNuevos[j]._id,
								nombre: productosNuevos[j].nombre,
								precio: precioASumar});
							costo.valorTotal += precioASumar;
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