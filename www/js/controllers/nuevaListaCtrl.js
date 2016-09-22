angular.module('app.controllers.nuevaLista', [])
.controller('nuevaListaCtrl', function($scope,$ionicHistory,$state,ListaService, ProductoService,EscannerService,$ionicModal) {

	$scope.productos = [];
	$scope.lista = {};
	$scope.busqueda = {};
	$scope.editando = false;
	
 $scope.$on("$ionicView.beforeEnter", function(event, data){
		 if(ListaService.listaEditar != null){
			 $scope.lista = ListaService.listaEditar;
			 $scope.productos = ListaService.listaEditar.productos;
			 $scope.editando = ListaService.editando;
			 ListaService.listaEditar = null;
		 }else{
			 	$scope.productos = [];
				$scope.lista = {};
				$scope.busqueda = {};
				$scope.editando = false;
		 }
 });
 
 $scope.elegirLista = function (lista){
	 ComprarService.seleccionarLista(lista);
		$ionicHistory.nextViewOptions({
		      disableBack: false
		    });
		 $state.go('menu.miChango');
 }
 
 $scope.buscarPorNombre = function(){
	 
	 ProductoService.getProductoPorNombre($scope.busqueda.nombreBuscado).then(function(productos){
		 $scope.productosCandidatos = productos;
		 $scope.$apply();
	 });
 }
 
 function agregarProducto(producto){
	 producto.cantidad = 1;
	 for(var i = 0; $scope.productos.length> i;i++){
		 if($scope.productos[i]._id = producto._id){
			 $scope.productos[i].cantidad++;
			 return;
		 }
	 }
	 $scope.productos.push(producto);
	 $scope.$apply();
 } 
 
 $scope.escannear = function(){
	 EscannerService.scanBarcode().then(function(codigo){
		 ProductoService.getProductoPorEAN(codigo).then(function (producto){			 
			 producto.cantidad = 1;
			 //producto.precioActivo = obtenerPorId(producto.precios, comercio._id);
			 
			 agregarProducto(producto);
		 });
		 
	 });
 }
 
 $scope.borrar =  function (producto){
	 removerElemento($scope.productos, producto);
}
 
 $scope.guardar = function(){
	 if($scope.lista.nombre){
		 ListaService.guardarLista($scope.lista.nombre, $scope.productos, $scope.editando).then(function(){
			 alert("Lista guardada");
			 $ionicHistory.nextViewOptions({
			      disableBack: false
			    });
			 $state.go('menu.misListas');
			 
		 }).catch(function(err){
			 if(err.status = 409){
				 alert("Ya existe una lista con este nombre");
			 }else{
				 alert("Ocurrió un error");				 
			 }
			 return;
		 });
	 }else{
		alert('Ingrese un nombre para la lista');
        return;		 
	 }
 }
 
 /*MODAL*/
 $ionicModal.fromTemplateUrl('productos-modal.html', {
	    id: '1',
	    scope: $scope,
	    animation: 'slide-in-up'
	}).then(function(modal) {
	    $scope.modal = modal;
	});

	$scope.openModal = function() {
	   
	        $scope.modal.show();
	    
	  };
	  $scope.elegirProducto = function(producto) {
		  	agregarProducto(producto);
		    $scope.$apply();
		    $scope.modal.hide();
		};

		$scope.closeModal = function() {
		    $scope.modal.hide();
		};
 
});