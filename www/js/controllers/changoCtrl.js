angular.module('app.controllers.chango', [])
.controller('miChangoCtrl', function($scope, $state,$ionicModal,$ionicHistory,EscannerService, ProductoService,ComprarService, ComerciosService) {

	$scope.chango =  {productos:[],
			total:0,
			totalProductosComprados: 0,
			totalLista: 0,
			descuentoTotal: 0};
	$scope.alertas = [];
	$scope.comerciosCercanos = [];
	$scope.busqueda = {};
	$scope.isEditing = false;
	ComprarService.chango = null;
	 ComprarService.lista = null;

	$scope.$on("$ionicView.beforeEnter", function(event, data){
		//$scope.producto.editar = false;
		
		
		ComprarService.obtenerParametrosSimulacion().then(function(doc){
			 $scope.comercio = doc.comercio;
			 $scope.medioDePago = doc.medioDePago;
			 $scope.descuento = doc.descuento;
			 $scope.lista = doc.lista;
			 $scope.alertas = [];
			 if(ComprarService.chango != null){
					$scope.chango = ComprarService.chango;
					$scope.lista = ComprarService.lista;
					$scope.alertas = ComprarService.alertas;
				};
			 
			 EscannerService.setCurrentComercioById(doc.comercio._id);
			 ComerciosService.comerciosCercanosPorUbicacion([{
                 lat: comercio.ubicacion.coordinates[0],
                 long: comercio.ubicacion.coordinates[1]
             }] ).then(function(resp){
            	 if(resp.length > 0){
                	 $scope.comerciosCercanos = resp[0].comerciosCercanos;
            	 }
            	 $scope.$apply();
			 });
		 });			 
		
	 });
	
	
 /*
  * Levanta el código de barras con EscannerService.scanBarcode()
  * Busca el producto en la base interna con ProductoService.getProductoPorEAN
  * 
  * */
	
	
	
	/*MODAL selección productos*/
	$ionicModal.fromTemplateUrl('producto-modal.html', {
	    id: '1',
	    scope: $scope,
	    animation: 'slide-in-up'
	}).then(function(modal) {
	    $scope.modal1 = modal;
	});

	$ionicModal.fromTemplateUrl('nombre-productos-modal.html', {
	    id: '2',
	    scope: $scope,
	    animation: 'slide-in-up'
	}).then(function(modal) {
	    $scope.modal2 = modal;
	});

	$scope.abrirBusquedaProducto = function() {
		$scope.modal2.show();
	}
	
 $scope.buscarPorNombre = function(){
	 
	 ProductoService.getProductoPorNombre($scope.busqueda.nombreBuscado).then(function(productos){
		 
		 $scope.productosCandidatos = productos;
		 $scope.$apply();
	 });
 }

 $scope.seleccionarProductoDeBusqueda = function(producto) {
	 $scope.modal2.hide();
	 producto.editar = false;
	 detalleProducto(producto);
 }
	

	 function abrirModal(index) {
		 switch(index) {
			 case 1:
			 	$scope.modal1.show();
				break;
			case 2:
				$scope.modal2.show();
				break;
			default:
				break;

		 }
	       
	  };

	  function agregarAlChangoYCerrarModal(){
		  	if(isNaN($scope.producto.cantidad)) {
				  alert('Se debe especificar una cantidad.')
				  return;
			  }
		  	sacarDePendientes($scope.producto);
			 agregarAlChango($scope.producto, true).then(function(){
				 $scope.$apply();
				 $scope.modal1.hide();
			 });
	  }
	  
	$scope.cerrarYagregar = function() {
		agregarAlChangoYCerrarModal()
	}
	
	$scope.cerrar = function() {
		if($scope.producto.editar){
			//vuelvo a agregar el producto que saqué al entrar en la pantalla de edición
			agregarAlChango($scope.producto, false);			
		}
		 $scope.modal1.hide();
	}
	
	$scope.salirModal = function(){
		$scope.modal1.hide();
	}

	$scope.editar = function(producto){
		producto.editar = true;
		$scope.producto = producto;			
		$scope.producto.editar = true;
		$scope.isEditing = true;
		 sacarDelChango($scope.producto);
		abrirModal(1);
	}
	
	$scope.actualizarPrecioFinal = function() {
		if($scope.producto){
			if($scope.producto.precio_final == 0 || ($scope.producto.precio_final != ($scope.producto.lista - $scope.producto.descuento))){
				//No había precio y lo modifico a mano el usuario
				$scope.producto.precio_final = $scope.producto.lista - $scope.producto.descuento;
				$scope.$apply();
				}
			}

	}
	
	
	/*MODAL selección productos*/

	
	$scope.imagenProducto = function(){
		return 'https://imagenes.preciosclaros.gob.ar/productos/' + $scope.producto.ean + '.jpg' ; 
	}
	
	 $scope.escannear = function(){
		 EscannerService.scanBarcode().then(function(codigo){
			 ProductoService.getProductoPorEAN(codigo).then(function (producto){	
				 producto.editar = false;
				  detalleProducto(producto);
			 });
			 
		 });
	 };
	 
	 function detalleProducto(producto){
		 var cantidad = 1;
		 if(producto.cantidad) {
			 cantidad = Number(producto.cantidad);
		 }
		 
		 ProductoService.obtenerDetalleProducto(producto,$scope.comercio,
					$scope.medioDePago, $scope.descuento,new Date()).then(function(prod){
						producto =prod;
						producto.cantidad = parseInt(cantidad);
						 $scope.producto = producto;
						 $scope.isEditing = false;
						 abrirModal(1);    
					})
	 }
	 
	 $scope.agregarDesdePendientes = function(producto){
		 producto.editar = false;
		 var nuevoProducto = (JSON.parse(JSON.stringify(producto)));
		 
		 detalleProducto(nuevoProducto);
		 
	 }
	 
	 function sacarDePendientes(producto){
		 if($scope.lista == null || producto.editar){
			 return;
		 }
		 
		 for(var i = 0; $scope.lista.productos.length> i;i++){
			 if($scope.lista.productos[i].ean == producto.ean){
				 $scope.lista.productos[i].cantidad -= producto.cantidad;
				 if($scope.lista.productos[i].cantidad<1){
					 $scope.lista.productos.splice(i, 1);
				 }
				 return;
			 }
		 }
		 
	 }
 
	 function agregarAlChango(producto, generarAlertas){
		 
		 producto.precio_lista = producto.lista;
		 producto.desc_valor = producto.descuento;
		 //producto.precio_final = producto.precio_final;
		 $scope.chango.totalProductosComprados += producto.cantidad ;
		 if($scope.producto.precio_final == 0){
			 //No había precio y lo modifico a mano el usuario
			 $scope.producto.precio_final = $scope.producto.lista;
		 }
		 $scope.chango.total += $scope.producto.precio_final * $scope.producto.cantidad ;
		 $scope.chango.totalLista += $scope.producto.lista * $scope.producto.cantidad ;
		 $scope.chango.descuentoTotal += $scope.producto.descuento * $scope.producto.cantidad ;
		 $scope.chango.total =Number($scope.chango.total.toFixed(2)) ;
		 $scope.chango.totalLista = Number($scope.chango.totalLista.toFixed(2));
		 $scope.chango.descuentoTotal =  Number($scope.chango.descuentoTotal.toFixed(2));
		 var i = 0
		 for(; $scope.chango.productos.length> i;i++){
			 if($scope.chango.productos[i].ean == producto.ean){
				 $scope.chango.productos[i].cantidad+= producto.cantidad;
				 producto.cantidad = $scope.chango.productos[i].cantidad;
				 i = 6000;
			 }
		 }	
		 if(i<5999){
			 //No lo encontró, lo agrego
			 $scope.chango.productos.push(producto)	 ;			 
		 }
		 if(generarAlertas){
			 if($scope.comerciosCercanos.length < 1){
				 //si no tiene comercios cercanos, por las dudas lo buscamos e nuevo
				return ComerciosService.comerciosCercanosPorUbicacion([{
	                 lat: comercio.ubicacion.coordinates[0],
	                 long: comercio.ubicacion.coordinates[1]
	             }] ).then(function(resp){
	            	 if(resp.length > 0){
	                	 $scope.comerciosCercanos = resp[0].comerciosCercanos;
	            	 }
	            	 $scope.$apply();
	            	 return ComprarService.verificarMejorPrecio(producto,$scope.comercio,$scope.comerciosCercanos,
	 						$scope.medioDePago,$scope.descuento,new Date() , $scope.alertas).then(function(alertas){
	 							$scope.alertas = alertas;
	 							return ;
	 						});
				 });
			 }else{
				 return ComprarService.verificarMejorPrecio(producto,$scope.comercio,$scope.comerciosCercanos,
							$scope.medioDePago,$scope.descuento,new Date() , $scope.alertas).then(function(alertas){
								$scope.alertas = alertas;
								return ;
							});
			 }
			 
		 }
		
	 }
	 
	 function sacarDelChango(producto){
		 $scope.chango.totalProductosComprados -= producto.cantidad ;
		 $scope.chango.total -= $scope.producto.precio_final * $scope.producto.cantidad ;
		 $scope.chango.totalLista -= $scope.producto.lista * $scope.producto.cantidad ;
		 $scope.chango.descuentoTotal -= $scope.producto.descuento * $scope.producto.cantidad ;
		 $scope.chango.total =Number($scope.chango.total.toFixed(2)) ;
		 $scope.chango.totalLista = Number($scope.chango.totalLista.toFixed(2));
		 $scope.chango.descuentoTotal =  Number($scope.chango.descuentoTotal.toFixed(2));
		 for(var i = 0; $scope.chango.productos.length> i;i++){
			 if($scope.chango.productos[i]._id == producto._id){
				 $scope.chango.productos.splice(i, 1);
				 return;
			 }
		 }	
	 }
	 
	 $scope.verificarChango = function () {
		 
			/*var compra = ComprarService.verificarChango($scope.chango.productos,$scope.comercio,
										$scope.medioDePago, $scope.descuento,new Date() );
							
			ComprarService.simulacion = compra;
			ComprarService.simulada = false;*/
		 ComprarService.alertas = $scope.alertas;
		  ComprarService.chango = $scope.chango;
		  ComprarService.lista= $scope.lista;
			$state.go('menEChango.verificarChango');								
		 }	
	 
	 $scope.cerrarChango = function () {
		 ComprarService.chango = null;
		 ComprarService.lista = null;
		 ComprarService.alertas = [];
			var compra = ComprarService.cerrarChango($scope.chango,$scope.comercio,
										$scope.medioDePago, $scope.descuento,new Date() );
			$scope.chango =  {productos:[],
					total:0,
					totalProductosComprados: 0,
					totalLista: 0,
					descuentoTotal: 0};
			$scope.alertas = [];
			$scope.comerciosCercanos = [];
			ComprarService.simulacion = compra;
			ComprarService.simulada = false;
			$ionicHistory.nextViewOptions({
			      disableBack: true
			    });
			$state.go('menEChango.cerrarChango');								
		 }	
 
})
.controller('cerrarChangoCtrl', function($scope,$state,$ionicHistory,ComprarService ) {
	
	$scope.$on("$ionicView.beforeEnter", function(event, data){
		$scope.compra = ComprarService.simulacion;
		$scope.compra.simulada = ComprarService.simulada;
		$scope.compra.valorLista = $scope.compra.valorLista.toFixed(2);
		$scope.compra.descuentoTotal = $scope.compra.descuentoTotal.toFixed(2); 
		$scope.compra.valorTotal = $scope.compra.valorTotal.toFixed(2);
		
	 });
	
	
	$scope.guardarCompra = function(){
		$scope.compra.correcta = true;
		
		ComprarService.guardarCompra($scope.compra).then(function(){
			$ionicHistory.nextViewOptions({
			      disableBack: true
			    });
			if($scope.compra.simulada){
				$state.go('menEChango.parMetrosDeSimulaciN');	
			}else{
				$state.go('menuPrincipal');	
			}
		})
		
	}
	
	$scope.reportarError = function(){
		//Saraza
		$scope.compra.correcta = false;
		ComprarService.guardarCompra($scope.compra).then(function(){			
			alert('Gracias por tu aporte. ¡Juntos hacemos un eChango mejor!');
			$state.go('menuPrincipal');				
		})
	}
	
	
})
.controller('verificarChangoCtrl', function($scope,$state,$ionicModal,ComprarService,ComerciosService, ListaService ) {
	
	$scope.$on("$ionicView.beforeEnter", function(event, data){
		//las alertas solo tienen los ids de comercios
		$scope.alertas = ComprarService.alertas;
		$scope.chango = ComprarService.chango;
		for (var i=0; i< $scope.alertas.length; i++){
			$scope.alertas[i].descuento = $scope.alertas[i].descuento.toFixed(2); 
		}
		$scope.$apply();		
	 });
	

	 $ionicModal.fromTemplateUrl('alertas-modal.html', {
	        id: '1',
	        scope: $scope,
	        animation: 'slide-in-up'
	    }).then(function(modal) {
	        $scope.modal1 = modal;
	    });

	$scope.closeModal = function() {
	    $scope.modal1.hide();
	};

	$scope.$on('$destroy', function() {
	        $scope.modal1.remove();
	})
	
	$scope.abrirModal = function(alerta){
		ComerciosService.detalleComercio(alerta.comercioId).then(function(comercio){
			$scope.alerta = alerta;
			$scope.alerta.comercio = comercio;
			$scope.modal1.show();
		});
		
	}
	
	$scope.sacarYHacerLista = function(alerta){
		console.log('Comienza remoción de productos');
		for(var i = 0; alerta.productos.length > i; i++){
			sacarDelChango(alerta.productos[i]);
		}
		console.log('productos fuera del chango - comienza creación de lista');
		ListaService.guardarLista("Comprar luego " + alerta.comercio.direccion,
				"Para ahorrar " +alerta.descuento + " pesos",
				alerta.productos, false).then(function(){
					console.log('Lista creada');
					alert("Sacamos los productos del chango");
					 $scope.modal1.hide();
					 ComprarService.alertas = [];
					$state.go('menEChango.eChango');	
				});
	}
	
	function sacarDelChango(producto){
		var productoASacar = null;
		for(var i = 0; $scope.chango.productos.length> i;i++){
			 if($scope.chango.productos[i].ean == producto.ean){
				 productoASacar = $scope.chango.productos[i];
				 producto.cantidad = productoASacar.cantidad;
				 $scope.chango.productos.splice(i, 1);
				 console.log('Producto eliminado --- ' +producto._id );
			 }
		 }	
		 $scope.chango.totalProductosComprados -= productoASacar.cantidad ;
		 $scope.chango.total -= productoASacar.precio_final * productoASacar.cantidad ;
		 $scope.chango.totalLista -= productoASacar.lista * productoASacar.cantidad ;
		 $scope.chango.descuentoTotal -= productoASacar.descuento * productoASacar.cantidad ;
		 $scope.chango.total =Number($scope.chango.total.toFixed(2)) ;
		 $scope.chango.totalLista = Number($scope.chango.totalLista.toFixed(2));
		 $scope.chango.descuentoTotal =  Number($scope.chango.descuentoTotal.toFixed(2));
		 
	 }
	
	
})