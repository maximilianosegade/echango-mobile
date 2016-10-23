angular.module('app.controllers.chango', [])
.controller('miChangoCtrl', function($scope,EscannerService, ProductoService,ComprarService) {

	$scope.chango =  {productos:[],
			total:0,
			cantidadElementos: 0};
	
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
	 $scope.escannear = function(){
		 EscannerService.scanBarcode().then(function(codigo){
			 ProductoService.getProductoPorEAN(codigo).then(function (producto){	
				 producto.cantidad = 1;
				 producto.precio = obtenerPorId(producto.precios, $scope.comercio._id);
				 $scope.chango.total += producto.precio.lista;
				 sacarDePendientes(producto);
				 agregarAlChango(producto);			
				 $scope.$apply();
			 });
			 
		 });
	 }
 
	 function sacarDePendientes(producto){
		 if($scope.lista == null){
			 return;
		 }
		 
		 for(var i = 0; $scope.lista.productos.length> i;i++){
			 if($scope.lista.productos[i]._id = producto._id){
				 $scope.lista.productos[i].cantidad--;
				 if($scope.lista.productos[i].cantidad<1){
					 $scope.lista.productos.splice(i, 1);
				 }
				 return;
			 }
		 }
		 
	 }
 
	 function agregarAlChango(producto){
		 $scope.chango.cantidadElementos++;
		 for(var i = 0; $scope.chango.productos.length> i;i++){
			 if($scope.chango.productos[i]._id = producto._id){
				 $scope.chango.productos[i].cantidad++;
				 return;
			 }
		 }	
		 $scope.chango.productos.push(producto)	 
	 }
 
})
.controller('cerrarChangoCtrl', function($scope,ComprarService, ) {
	$scope.$on("$ionicView.beforeEnter", function(event, data){
		$scope.simulacion = ComprarService.simulacion;
		
		if($scope.simulacion){
			$scope.compra = $scope.simulacion;
		}
	 });
	
})