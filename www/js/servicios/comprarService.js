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
	
	this.actualizarParametrosSimulacion = function (doc) {

		return actualizarParametrosSimulacion(doc);
	}

	function actualizarParametrosSimulacion(doc){		
			this.comercio = doc.comercio;
			this.lista = doc.lista;
			this.medioDePago = doc.medioDePago;
			this.descuento = doc.descuento;
			BaseLocal.get('parametrosSimulacion').then(function(obj){
				obj.comercio = doc.comercio;
				obj.descuento = doc.descuento;
				obj.lista = doc.lista;
				obj.medioDePago = doc.medioDePago;

				return BaseLocal.put(obj);

			});
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
		var precioASumar = 0;
		var precioFinal = precio * cantidad;
		var dia = fecha.getDay();
		var flag_tp = false;
		var flag_pc = false;
		var flag_cant = false;
		var flag_tarj = false;
		var flag_tc = false;
		//var precioParcial = 0;

		if (!descuento) {
			//flag_tarj = true;
			descuento = {
				_id: 0,
				nombre: "Sin Tarjeta"
			}
		} else {
			if (!descuento._id){
				//flag_tarj = true;
				descuento._id = 0;
			}
		}

		for(var l = 0; promociones && promociones.length > l ;l++){
			var promocion = promociones[l];
			
			if (promocion.dias.indexOf(dia)>-1){

				//Aplico primero promocion precios cuidados (FLAG_PC)
				if(promocion.valor > 0 && !flag_pc){
					//promocion estilo precios cuidados
					descuentoActual = (precio -  promocion.valor) * cantidad
					//precioParcial = promocion.valor * cantidad;
					//precioASumar = precioParcial;
					precioASumar = promocion.valor * cantidad;
					flag_pc = true;
					flag_tp = true;
				}

				//Aplico promoción de cantidad (FLAG_CANT) 
				if (promocion.cantidad > 0 && cantidad>=promocion.cantidad && !flag_cant ){

					if (promocion.tarjeta >= 1 && promocion.tarjeta == descuento._id ) {

						if (flag_pc && promocion.acumulable == 1) {
							descuentoActual = descuentoActual * (1 - promocion.porcentaje);
							precioASumar = precioASumar * (1 - promocion.porcentaje);
							flag_cant = true;
							flag_tp = true;
							flag_tarj = true;
						} else {
							if (!flag_pc)
								descuentoActual = precio * promocion.porcentaje * cantidad;
								precioASumar = precio * (1 - promocion.porcentaje) * cantidad;
								flag_cant = true;
								flag_tp = true;
								flag_tarj = true;
						}
					} else {
							
						if (flag_pc && promocion.acumulable == 1) {
							descuentoActual = descuentoActual * (1 - promocion.porcentaje);
							precioASumar = precioASumar * (1 - promocion.porcentaje);
							flag_cant = true;
							flag_tp = true;
						} else {
							if (!flag_pc)
								descuentoActual = precio * promocion.porcentaje * cantidad;
								precioASumar = precio * (1 - promocion.porcentaje) * cantidad;
								flag_cant = true;
								flag_tp = true;
						}
					}
				}
				

				//Aplico promoción de comunidad (FLAG_TARJ)
				if(promocion.tarjeta >= 1 && promocion.tarjeta == descuento._id && !flag_tarj){

					if (flag_pc || flag_cant) {

						if (promocion.acumulable == 1) {
							descuentoActual = descuentoActual * (1 - promocion.porcentaje);
							precioASumar = precioASumar * (1 - promocion.porcentaje);
							flag_tarj = true;
							flag_tp = true;
						} 

					} else {
						descuentoActual = precio * promocion.porcentaje * cantidad;
						precioASumar = precio * (1 - promocion.porcentaje) * cantidad;
						flag_tarj = true;
						flag_tp = true;
					}

				}

				//Aplico promoción de bancos (FLAG_TC)

				if(promocion.plastico >= 1 && promocion.plastico == medioDePago.tarjeta._id && !flag_tc){
				//La promoción implica plástico y se tiene el plástico de la promoción
					if(promocion.banco >= 1 && promocion.banco == medioDePago.banco._id && !flag_tc){
					//La promoción implica banco y se tiene el banco de la promoción
							
						if (flag_pc || flag_cant || flag_tarj) {

							if (promocion.acumulable == 1) {
								descuentoActual = descuentoActual * (1 - promocion.porcentaje);
								precioASumar = precioASumar * (1 - promocion.porcentaje);
								flag_tc = true;
								flag_tp = true;
							} 

						} else {
							descuentoActual = precio * promocion.porcentaje * cantidad;
							precioASumar = precio * (1 - promocion.porcentaje) * cantidad;
							flag_tc = true;
							flag_tp = true;
						} 
					} else {
						if (promocion.banco == 0 && !flag_tc){

							if (flag_pc || flag_cant || flag_tarj) {

								if (promocion.acumulable == 1) {
									descuentoActual = descuentoActual * (1 - promocion.porcentaje);
									precioASumar = precioASumar * (1 - promocion.porcentaje);
									flag_tc = true;
									flag_tp = true;
								} 

							} else {
								descuentoActual = precio * promocion.porcentaje * cantidad;
								precioASumar = precio * (1 - promocion.porcentaje) * cantidad;
								flag_tc = true;
								flag_tp = true;
							}
						}
					}
				} else {
					
					if(promocion.plastico == 0 && !flag_tc) {
						if (flag_pc || flag_cant || flag_tarj) {

							if (promocion.acumulable == 1) {
								descuentoActual = descuentoActual * (1 - promocion.porcentaje);
								precioASumar = precioASumar * (1 - promocion.porcentaje);
								flag_tc = true;
								flag_tp = true;
							} 

						} else {
							descuentoActual = precio * promocion.porcentaje * cantidad;
							precioASumar = precio * (1 - promocion.porcentaje) * cantidad;
							flag_tc = true;
							flag_tp = true;
						}
					}
				}
			}
		}
				
		if (flag_tp){
			precioFinal = precioASumar;
		}

		var resultado = [];
		descuentoActual = Number(descuentoActual.toFixed(2));
		precioFinal = Number(precioFinal.toFixed(2));
		resultado.push(descuentoActual);
		resultado.push(precioFinal);
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
			costo.valorTotal = Number(costo.valorTotal.toFixed(2));
			costo.descuentoTotal  = Number(costo.descuentoTotal.toFixed(2));
			simulacion.valorLista = costo.valorLista;
			simulacion.costo = costo;
			simulacion.porcentajeDescuento =costo.porcentajeDescuento ;
			simulacion.valorTotal =costo.valorTotal;
			simulacion.descuentoTotal =costo.descuentoTotal ;
			simulacion.cantidad_total_articulos = cantidad_total_articulos;
			simulacion.lista = lista;
			simulacion.comercio = comercio;
			//simulacion.fecha = fecha.toISOString()
			//  .replace(/T/, ' ')
			//  .replace(/\..+/, '');
			// FIX 20161122: Se usa la fecha en el GMT actual.
			simulacion.fecha = moment(fecha).format().replace(/T/, ' ').replace(/-\d\d:\d\d/, '');
			
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
		//compra.fecha = fecha.toISOString()
		//  .replace(/T/, ' ')
		//  .replace(/\..+/, '');
		// FIX 20161122: Se usa la fecha en el GMT actual.
		compra.fecha = moment(fecha).format().replace(/T/, ' ').replace(/-\d\d:\d\d/, '');
				
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
		var deltaPrecioPorcentual = 0.97;
		var deltaPrecioAbsoluto = 1;
		
		if(precioAComparar / (producto.precio_final * producto.cantidad) < deltaPrecioPorcentual &&
				producto.precio_final * producto.cantidad - precioAComparar > deltaPrecioAbsoluto){
			//agrego la alerta
			var alerta = {};
			var tieneComercio = false;
			for(var i = 0; alertas.length > i; i++){
				if (alertas[i].comercioId == comercioId){
					tieneComercio = true
					for(var j = 0;alertas[i].productos.length > j;j++ ){
						if(alertas[i].productos[j].ean == producto.ean){
							//si lo tiene lo borro y lo vuelvo a calcular por si cambió la cantidad
							alertas[i].descuento-=alertas[i].productos[j].descuento;
							alertas[i].productos.splice(j, 1);
							
							j=500;
						}
							alertas[i].descuento += descuentoAcomparar;
							alertas[i].productos.push({ean: producto.ean, nombre: producto.nombre, precio_final: precioAComparar, descuento: descuentoAcomparar});
							
						}					
				}
			}
			if(!tieneComercio){
				//no tengo alertas para este comercio
				alerta = {
						comercioId: comercioId,
						descuento : descuentoAcomparar,
						productos: []						
				}
				//alertas = [];
				alerta.productos.push({ean: producto.ean, nombre: producto.nombre, precio_final: precioAComparar, descuento: descuentoAcomparar});
				alertas.push(alerta);
			}
			
		}
		return alertas;
		
	}
	
	this.verificarMejorPrecio = function(producto, comercio,comerciosCercanos,medioDePago,descuento,fecha, alertas){

		return BasePreciosPorComercio.query(function(doc,emit){
            
			var enLaLista = false;
			
			for(var i = 0; comerciosCercanos.length > i; i++){
				if (comerciosCercanos[i] == doc._id && comercio._id != doc._id ){
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
        	//12-1-74
        for(var j = 0;	res.rows.length > j;j++){
        	var result =aplicarPromociones(res.rows[j].key.precio,producto.cantidad,
        			res.rows[j].key.promociones,medioDePago,descuento,fecha);
			 
			descuentoActual = result[0];
			precioASumar = result[1];	
			
			alertas = crearAlerta(producto, precioASumar, descuentoActual, res.rows[j].id, alertas);
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