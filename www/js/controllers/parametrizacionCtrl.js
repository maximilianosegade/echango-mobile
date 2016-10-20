angular.module('app.controllers.parametrizar', [])
.controller('parametrizacionCtrl', function($scope,$ionicHistory,$state,ListaService, ComprarService) {
	
	 $scope.$on("$ionicView.beforeEnter", function(event, data){
		ComprarService.obtenerParametrosSimulacion().then(function(doc){
			 $scope.comercio = doc.comercio
			 $scope.medioDePago = doc.medioDePago;
			 $scope.descuento = doc.descuento;
			 $scope.lista = doc.lista;
		 });		
		 
 });
})