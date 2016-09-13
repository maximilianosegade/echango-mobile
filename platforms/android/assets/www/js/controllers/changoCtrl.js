angular.module('app.controllers.chango', [])
.controller('miChangoCtrl', function($scope,ComprarService,EscannerService, ProductoService,ComprarService) {

	var comercio = ComprarService.comercioSeleccionado();
	
 $scope.$on("$ionicView.beforeEnter", function(event, data){
		 
	 $scope.listaActual = ComprarService.listaSeleccionada();
	 $scope.nuevoProducto = '123';
 });
 
 /*
  * Levanta el código de barras con EscannerService.scanBarcode()
  * Busca el producto en la base interna con ProductoService.getProductoPorEAN
  * 
  * */
 $scope.escannear = function(){
	 EscannerService.scanBarcode().then(function(codigo){
		 ProductoService.getProductoPorEAN(codigo).then(function (producto){			 
			 $scope.nuevoProducto =producto.nombre;
			 $scope.nuevoPrecio = obtenerPorId(producto.precios, comercio._id);
			 $scope.$apply();
		 });
		 
	 });
 }
 
})