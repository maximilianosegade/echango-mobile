angular.module('app.controllers.informarProducto', [ 'ngCordova' ]).controller(
		'informarProductoCtrl', function($scope, EscannerService, $state, ProductoService) {

            var currentEAN;
            var idComercio = 1; // TODO: debería inicializarse con la ID correcta
            var sucursalEncontrada;
            var currentProd;


            $scope.$on('$ionicView.afterEnter', function() {
                currentEAN = EscannerService.getCurrentEAN();
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
                        id: idComercio.toString(),
	                	lista: 0,
	                	promociones:[]	   
	     	        	}]
                    };


                ProductoService.getProductoPorEAN(currentEAN).then(function(doc) {
                
                    $scope.data.currentDesc = doc.nombre;
                    sucursalEncontrada = false;
                    for (i=0;i<doc.precios.length;i++) {
                        if (currentProd.precios[i].id == idComercio.toString()){
                            $scope.data.currentPrice = doc.precios[i].lista ;
                            sucursalEncontrada = true;
                            $scope.$apply();
                            break;
                        };
                    } 
                    currentProd = doc;
                    
                    if (!sucursalEncontrada) {
                        var nuevoPrecio = {id: idComercio.toString(),
		                lista: 0,
						promociones:[]};
                        currentProd.precios.push(nuevoPrecio);
                  }


                }).catch(function (err){
                    alert('No se encontró el producto. Error ->' + err)
                

            });
		    $scope.$apply();
	    });

           
        $scope.updateProducto = function () {
            
            if ($scope.data.currentDesc && ($scope.data.currentPrice > 0) && $scope.data.currentEAN) {
                currentProd.nombre = $scope.data.currentDesc;
                currentProd.ean = $scope.data.currentEAN.toString();
                for (i=0;i<currentProd.precios.length;i++) {
                    if (currentProd.precios[i].id == idComercio.toString()){
                        
                        currentProd.precios[i].lista = $scope.data.currentPrice;
                        ProductoService.updateProducto(currentProd);
                        
                        break;
                    };
                }                
                
                $state.go('menEChango.relevarProducto');
            } else {
                alert('Se deben completar todos los campos.\nCodigo:' + $scope.data.currentEAN + '\nDesc: ' + $scope.data.currentDesc + '\nPre: $' + $scope.data.currentPrice)
            }
            
        };
                   
		})