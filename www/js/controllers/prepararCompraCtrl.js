angular.module('app.controllers.prepararCompra', [])
.controller('confirmarMediosDePagoCtrl', function($scope,$state, BaseLocal, ComprarService, $cordovaDatePicker) {

	 var dbLocal = BaseLocal;
	 $scope.$on("$ionicView.beforeEnter", function(event, data){
		 
		 $scope.listaSeleccionada = ComprarService.listaSeleccionada();
		 $scope.comercioSeleccionado = ComprarService.comercioSeleccionado();
		 $scope.simular = ComprarService.simular;

			// Obtener medios de pago registrados
		 dbLocal.get('mediosDePagoRegistrados').then(function(doc){
			    $scope.mediosDePagoRegistrados = doc.mediosDePagoRegistrados;
			    $scope.$apply();
			}).catch(function(err){
			    BaseLocal.put({
			                _id: 'mediosDePagoRegistrados',
			                mediosDePagoRegistrados: $scope.mediosDePagoRegistrados
			    }).catch(function(err){
			        "No se pudo hacer put"
			    });
			})
			;
			dbLocal.get('tarjetasPromocionalesRegistradas').then(function(doc){
		        // Lo encontró
		        $scope.tarjetasPromocionalesRegistradas = doc.tarjetasPromocionalesRegistradas;
		        $scope.$apply(); 
		    }).catch(function(err){
		        // Si no existe, crearlo
		        dbLocal.put({
		            _id: 'tarjetasPromocionalesRegistradas',
		             tarjetasPromocionalesRegistradas: $scope.tarjetasPromocionalesRegistradas
		        }).then(function (response) {
		            // handle response
		        }).catch(function (err) {
		            alert('error al crear')
		        });
		    });
		    
		  }); 
	 
	 $scope.simularCompra = function () {
		/* var options = {
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
					 ComprarService.simularCompra($scope.listaSeleccionada,$scope.comercioSeleccionado,
								$scope.mediosDePagoRegistrados, $scope.tarjetasPromocionalesRegistradas,fecha ).then(function(simulacion){
									ComprarService.simulacion = simulacion;
		
									$state.go('menu.simulacion');
								})
				 	});
				 }catch(e){
			 //Para cuando estamos simulando y no tenemos cordova
					 ComprarService.simularCompra($scope.listaSeleccionada,$scope.comercioSeleccionado,
								$scope.mediosDePagoRegistrados, $scope.tarjetasPromocionalesRegistradas,new Date() ).then(function(simulacion){
									ComprarService.simulacion = simulacion;
		
									$state.go('menu.simulacion');
								});
				 	};
		 }		*/ 
		 ComprarService.simularCompra($scope.listaSeleccionada,$scope.comercioSeleccionado,
					$scope.mediosDePagoRegistrados, $scope.tarjetasPromocionalesRegistradas,new Date() ).then(function(simulacion){
						ComprarService.simulacion = simulacion;

						$state.go('menu.simulacion');
					});
	 	};
		
})