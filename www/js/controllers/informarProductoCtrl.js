angular.module('app.controllers.informarProducto', [ 'ngCordova' ]).controller(
		'informarProductoCtrl', function($scope, EscannerService, $state, ProductoService) {

            var currentEAN;
            var idComercio = EscannerService.getCurrentComercio()._id; // TODO: debería inicializarse con la ID correcta
            var sucursalEncontrada;
            var currentProd;
            
	        


            $scope.$on('$ionicView.afterEnter', function() {
                //alert('idComercio: ' + idComercio);
                currentEAN = EscannerService.getCurrentEAN();
                $scope.imagenProducto = 'https://imagenes.preciosclaros.gob.ar/productos/'+ currentEAN +'.jpg' ; 
                $scope.data = {
                    currentPrice: 0,
                    currentDesc: '',
                    currentEAN: Number(currentEAN)
                };
                currentProd = {
	     			_id: currentEAN,
	                nombre: '',
	                ean: currentEAN,
	                etiquetas: [],
	                precios: [{
                        id: idComercio,
	                	lista: 0,
	                	promociones:[]	   
	     	        	}]
                    };


                ProductoService.getProductoPorEAN(currentEAN).then(function(doc) {
                    
                    $scope.data.currentDesc = doc.nombre;
                    // Obtener Precio para la sucursal

                    currentProd = doc;
                    $scope.$apply();



                }).catch(function (err){
                    alert('No se encontró el producto. Error ->' + err)
                

            });
		    $scope.$apply();
	    });

           
        $scope.updateProducto = function () {
            
            if ($scope.data.currentDesc && ($scope.data.currentPrice > 0) && $scope.data.currentEAN) {
                currentProd.nombre = $scope.data.currentDesc;
                currentProd.ean = $scope.data.currentEAN.toString();
                //TODO: Actualizar precio

                
                $state.go('menEChango.relevarProducto');
            } else {
                alert('Se deben completar todos los campos.\nCodigo:' + $scope.data.currentEAN + '\nDesc: ' + $scope.data.currentDesc + '\nPre: $' + $scope.data.currentPrice)
            }
            
        };
                   
		})