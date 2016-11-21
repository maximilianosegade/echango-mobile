angular.module('app.controllers.parametrizar', [])
.controller('parametrizacionCtrl', function($scope,$ionicHistory,$state,ListaService, ComprarService,$cordovaDatePicker) {
	
	 $scope.$on("$ionicView.beforeEnter", function(event, data){
		 ComprarService.simulacion = ListaService.simular;
		ComprarService.obtenerParametrosSimulacion().then(function(doc){
			 $scope.comercio = doc.comercio;
			 $scope.medioDePago = doc.medioDePago;
			 $scope.descuento = doc.descuento;
			 $scope.lista = doc.lista;
		 });			 
	 });	 
	 
	 $scope.elegirLista = function(){
		 ComprarService.simular = true;
	     $state.go('menEChango.misListas');
	 }
	 
	 $scope.elegirMedioDePago = function(){
		 ComprarService.simular = true;
	     $state.go('menEChango.mediosDePago');
	 }
	 
	 $scope.elegirComercio= function(){
		 ComprarService.simular = true;
	     $state.go('menEChango.DNdeCompro');
	 }
	 
	 $scope.elegirDescuento = function(){
		 ComprarService.simular = true;
		 var parametros = {
			 comercio: $scope.comercio,
			 medioDePago: $scope.medioDePago,
			 descuento: null,
			 lista: $scope.lista
		 }
		 ComprarService.actualizarParametrosSimulacion(parametros);
		 $scope.descuento = null;
		 $scope.$apply();
		 $state.go('menEChango.descuentos');
	 }
	 
	 
	 $scope.simularCompra = function () {
		 /*var options = {
				    date: new Date(),
				    mode: 'date', // or 'time'
				    minDate: new Date(),
				    allowOldDates: false,
				    allowFutureDates: true,
				    doneButtonLabel: 'LISTO',
				    doneButtonColor: '#F2F3F4',
				    cancelButtonLabel: 'CANCELAR',
				    cancelButtonColor: '#000000'
				  };
			try {
				 $cordovaDatePicker.show(options).then(function(fecha){
					 ComprarService.simularCompra($scope.lista,$scope.comercio,
								$scope.medioDePago, $scope.descuento,fecha ).then(function(simulaciones){
									ComprarService.simulaciones = simulaciones;
									ComprarService.simulada = true;
									$state.go('menEChango.listaSimulaciones');
									//$state.go('menEChango.cerrarChango');
								})
				 	});
				 }catch(e){
			 //Para cuando estamos simulando y no tenemos cordova
					 ComprarService.simularCompra($scope.lista,$scope.comercio,
								$scope.medioDePago, $scope.descuento,new Date() ).then(function(simulaciones){
									ComprarService.simulaciones = simulaciones;
									ComprarService.simulada = true;
									$state.go('menEChango.listaSimulaciones');
								});
				 	};
		 }		*/
		 ComprarService.simularCompra($scope.lista,$scope.comercio,
					$scope.medioDePago, $scope.descuento,new Date() ).then(function(simulaciones){
						ComprarService.simulaciones = simulaciones;
						ComprarService.simulada = true;
						$state.go('menEChango.listaSimulaciones');
					});
	 	};
	 
})
.controller('listaSimulacionCtrl', function($scope,$state, ComprarService) {
	$scope.$on("$ionicView.beforeEnter", function(event, data){
		$scope.simulaciones = ComprarService.simulaciones;
				 
	 });	 
	
	$scope.seleccionar = function(simulacion){
		ComprarService.simulacion= simulacion;
		ComprarService.simulada = true;
		$state.go('menEChango.cerrarChango');
	}
})
