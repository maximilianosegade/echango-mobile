angular.module('app.controllers.chango', [])
.controller('miChangoCtrl', function($scope,ComprarService,EscannerService) {

 $scope.$on("$ionicView.beforeEnter", function(event, data){
		 
	 $scope.listaActual = ComprarService.listaSeleccionada();
	 $scope.nuevoProducto = '123';
 });
 
 
 $scope.escannear = function(){
	 EscannerService.scanBarcode().then(function(codigo){
		 $scope.nuevoProducto =codigo;
		 $scope.$apply();
	 });
 }
 
})