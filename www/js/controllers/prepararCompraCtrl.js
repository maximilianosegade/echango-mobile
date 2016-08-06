angular.module('app.controllers.prepararCompra', [])
.controller('confirmarMediosDePagoCtrl', function($scope, BaseLocal) {

	 var dbLocal = BaseLocal;
	 $scope.$on("$ionicView.beforeEnter", function(event, data){
		 
		 

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
	 
	
})