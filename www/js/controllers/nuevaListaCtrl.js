angular.module('app.controllers.nuevaLista', [])
.controller('nuevaListaCtrl', function($scope,$ionicHistory,$state,ListaService, ProductoService,EscannerService) {

	$scope.productos = [];
	$scope.lista = {};
	
 $scope.$on("$ionicView.beforeEnter", function(event, data){
		 
 });
 
 $scope.elegirLista = function (lista){
	 ComprarService.seleccionarLista(lista);
		$ionicHistory.nextViewOptions({
		      disableBack: false
		    });
		 $state.go('menu.miChango');
 }
 
 $scope.escannear = function(){
	 EscannerService.scanBarcode().then(function(codigo){
		 ProductoService.getProductoPorEAN(codigo).then(function (producto){			 
			 producto.cantidad = 1;
			 //producto.precioActivo = obtenerPorId(producto.precios, comercio._id);
			 
			 $scope.productos.push(producto);
			 $scope.$apply();
		 });
		 
	 });
 }
 
 $scope.borrar =  function (producto){
	 removerElemento($scope.productos, producto);
}
 
 $scope.guardar = function(){
	 if($scope.lista.nombre){
		 ListaService.guardarLista($scope.lista.nombre, $scope.productos).then(function(){
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
 
});