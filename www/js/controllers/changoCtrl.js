angular.module('app.controllers.chango', [])
.controller('miChangoCtrl', function($scope, $state,$ionicModal,EscannerService, ProductoService,ComprarService) {

	$scope.chango =  {productos:[],
			total:0,
			totalProductos: 0,
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

	
	
	
	 $scope.escannear = function(){
		 EscannerService.scanBarcode().then(function(codigo){
			 ProductoService.getProductoPorEAN(codigo).then(function (producto){	
				 producto = ProductoService.obtenerDetalleProducto(producto,$scope.comercio,
							$scope.medioDePago, $scope.descuento,new Date());
				 producto.cantidad = 1;
				 
				 $scope.producto = producto;
				 abrirModal();    
							
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
		 $scope.chango.totalProductos += producto.cantidad ;
		 $scope.chango.total += $scope.producto.aPagar * $scope.producto.cantidad ;
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
		 $scope.chango.totalProductos -= producto.cantidad ;
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
	 
	 $scope.cerrarChango = function () {
		 
			var compra = ComprarService.cerrarChango($scope.chango,$scope.comercio,
										$scope.medioDePago, $scope.descuento,new Date() );
							
			ComprarService.simulacion = compra;
			ComprarService.simulada = false;
			$state.go('menEChango.cerrarChango');								
		 }	
 
})
.controller('cerrarChangoCtrl', function($scope,$state,ComprarService ) {
	
	$scope.$on("$ionicView.beforeEnter", function(event, data){
		$scope.compra = ComprarService.simulacion;
		$scope.compra.simulada = ComprarService.simulada;
		
	 });
	
	
	$scope.guardarCompra = function(){
		$scope.compra.correcta = true;
		ComprarService.guardarCompra($scope.compra).then(function(){
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
			alert('Gracias por tu aporte. Juntos hacemos un eChango mejor!');
			$state.go('menuPrincipal');				
		})
	}
	
	
})