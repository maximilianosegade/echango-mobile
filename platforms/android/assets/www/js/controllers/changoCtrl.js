angular.module('app.controllers.chango', [])
.controller('miChangoCtrl', function($scope,ComprarService,EscannerService, ProductoService,ComprarService) {

	var comercio = ComprarService.comercioSeleccionado();
	$scope.chango =  {};
	$scope.chango.total = 0;
	
 $scope.$on("$ionicView.beforeEnter", function(event, data){
		 
	 $scope.listaActual = ComprarService.listaSeleccionada();
	 
 });
 
 /*
  * Levanta el código de barras con EscannerService.scanBarcode()
  * Busca el producto en la base interna con ProductoService.getProductoPorEAN
  * 
  * */
 $scope.escannear = function(){
	 EscannerService.scanBarcode().then(function(codigo){
		 ProductoService.getProductoPorEAN(codigo).then(function (producto){	
			 producto.cantidad = 1;
			 producto.precio = obtenerPorId(producto.precios, comercio._id);
			 $scope.chango.total += producto.precio.lista;
			 sacarDePendientes(producto);
			 agregarAlChango(producto);			
			 $scope.$apply();
		 });
		 
	 });
 }
 
 function sacarDePendientes(producto){
	 if($scope.listaActual == null){
		 return;
	 }
	 
	 for(var i = 0; $scope.listaActual.productos.length> i;i++){
		 if($scope.listaActual.productos[i]._id = producto._id){
			 $scope.listaActual.productos[i].cantidad--;
			 if($scope.listaActual.productos[i].cantidad<1){
				 $scope.listaActual.productos.splice(i, 1);
			 }
			 return;
		 }
	 }
	 
 }
 
 function agregarAlChango(producto){
	 if($scope.chango.productos == null){
		 $scope.chango.productos = [];
		 $scope.chango.productos.push(producto)
		 return; 
	 }
	
	 for(var i = 0; $scope.chango.productos.length> i;i++){
		 if($scope.chango.productos[i]._id = producto._id){
			 $scope.chango.productos[i].cantidad++;
			 return;
		 }
	 }
	
	 $scope.chango.productos.push(producto)
	 
 }
 
})