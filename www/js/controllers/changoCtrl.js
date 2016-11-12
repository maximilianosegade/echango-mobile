angular.module('app.controllers.chango', [])
.controller('miChangoCtrl', function($scope, $state,$ionicModal,EscannerService, ProductoService,ComprarService) {

	$scope.chango =  {productos:[],
			total:0,
			totalProductosComprados: 0,
			totalLista: 0,
			descuentoTotal: 0};
	
	$scope.$on("$ionicView.beforeEnter", function(event, data){
		ComprarService.obtenerParametrosSimulacion().then(function(doc){
			 $scope.comercio = doc.comercio;
			 $scope.medioDePago = doc.medioDePago;
			 $scope.descuento = doc.descuento;
			 $scope.lista = doc.lista;
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
	    $scope.modal = modal;
	});

	 function abrirModal() {
	   $scope.modal.show();	    
	  };

	  function agregarAlChangoYCerrarModal(){
			 sacarDePendientes($scope.producto);
			 agregarAlChango($scope.producto);
		    $scope.$apply();
		    $scope.modal.hide();
	  }
	  
	$scope.cerrarYagregar = function() {
		agregarAlChangoYCerrarModal()
	}
	
	$scope.cerrar = function() {
		if($scope.producto.editar){
			//vuelvo a agregar el producto que saqué al entrar en la pantalla de edición
			agregarAlChango($scope.producto);			
		}
		 $scope.modal.hide();
	}
	
	$scope.editar = function(producto){
		$scope.producto = producto;		
		$scope.producto.editar = true;
		 sacarDelChango($scope.producto);
		abrirModal();
	}
	
	
	
	/*MODAL selección productos*/

	
	$scope.imagenProducto = function(){
		return 'https://imagenes.preciosclaros.gob.ar/productos/'+$scope.producto.ean +'.jpg' ; 
	}
	
	 $scope.escannear = function(){
		 EscannerService.scanBarcode().then(function(codigo){
			 ProductoService.getProductoPorEAN(codigo).then(function (producto){	
				  ProductoService.obtenerDetalleProducto(producto,$scope.comercio,
							$scope.medioDePago, $scope.descuento,new Date()).then(function(prod){
								producto =prod;
								 $scope.producto = producto;
								 abrirModal();    
							})
			 });
			 
		 });
	 }
 
	 function sacarDePendientes(producto){
		 if($scope.lista == null){
			 return;
		 }
		 
		 for(var i = 0; $scope.lista.productos.length> i;i++){
			 if($scope.lista.productos[i]._id == producto._id){
				 $scope.lista.productos[i].cantidad -= producto.cantidad;
				 if($scope.lista.productos[i].cantidad<1){
					 $scope.lista.productos.splice(i, 1);
				 }
				 return;
			 }
		 }
		 
	 }
 
	 function agregarAlChango(producto){
		 
		 producto.ean = producto._id;
		 producto.precio_lista = producto.lista;
		 producto.desc_valor = producto.descuento;
		 producto.precio_final = producto.precio_final;
		 $scope.chango.totalProductosComprados += producto.cantidad ;
		 if($scope.producto.precio_final == 0){
			 //No había precio y lo modifico a mano el usuario
			 $scope.producto.precio_final = $scope.producto.lista;
		 }
		 $scope.chango.total += $scope.producto.precio_final * $scope.producto.cantidad ;
		 $scope.chango.totalLista += $scope.producto.lista * $scope.producto.cantidad ;
		 $scope.chango.descuentoTotal += $scope.producto.descuento * $scope.producto.cantidad ;
		 for(var i = 0; $scope.chango.productos.length> i;i++){
			 if($scope.chango.productos[i]._id == producto._id){
				 $scope.chango.productos[i].cantidad+= producto.cantidad;
				 return;
			 }
		 }	
		 $scope.chango.productos.push(producto)	 
	 }
	 
	 function sacarDelChango(producto){
		 $scope.chango.totalProductosComprados -= producto.cantidad ;
		 $scope.chango.total -= $scope.producto.aPagar * $scope.producto.cantidad ;
		 $scope.chango.totalLista -= $scope.producto.lista * $scope.producto.cantidad ;
		 $scope.chango.descuentoTotal -= $scope.producto.descuento * $scope.producto.cantidad ;
		 for(var i = 0; $scope.chango.productos.length> i;i++){
			 if($scope.chango.productos[i]._id == producto._id){
				 $scope.chango.productos.splice(i, 1);
				 return;
			 }
		 }	
	 }
	 
	 $scope.verificarChango = function () {
		 
			/*var compra = ComprarService.verificarChango($scope.chango,$scope.comercio,
										$scope.medioDePago, $scope.descuento,new Date() );
							
			ComprarService.simulacion = compra;
			ComprarService.simulada = false;*/
			$state.go('menEChango.verificarChango');								
		 }	
	 
	 $scope.cerrarChango = function () {
		 
			var compra = ComprarService.cerrarChango($scope.chango,$scope.comercio,
										$scope.medioDePago, $scope.descuento,new Date() );
							
			ComprarService.simulacion = compra;
			ComprarService.simulada = false;
			$state.go('menEChango.cerrarChango');								
		 }	
 
})
.controller('cerrarChangoCtrl', function($scope,$state,$ionicHistory,ComprarService ) {
	
	$scope.$on("$ionicView.beforeEnter", function(event, data){
		$scope.compra = ComprarService.simulacion;
		$scope.compra.simulada = ComprarService.simulada;
		
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
.controller('verificarChangoCtrl', function($scope,$state,$ionicModal,ComprarService ) {
	
	$scope.$on("$ionicView.beforeEnter", function(event, data){
		$scope.alertas = ComprarService.alertas;		
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
	        $scope.modal.remove();
	})
	
	$scope.abrirModal = function(producto){
		$scope.alerta = alerta
		$scope.modal1.show();
	}
	
	
	
})