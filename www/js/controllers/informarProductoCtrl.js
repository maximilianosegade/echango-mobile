angular.module('app.controllers.informarProducto', [ 'ngCordova' ]).controller(
		'informarProductoCtrl', function($scope, EscannerService, $state, ProductoService, BasePreciosPorComercio, BaseRelevamiento, BaseCompras, LoginService) {

            var currentEAN;
            var idComercio = EscannerService.getCurrentComercio()._id; // TODO: debería inicializarse con la ID correcta
            var sucursalEncontrada;
            //var currentProd;
            var preciosComercio;
            
	        


            $scope.$on('$ionicView.afterEnter', function() {
                //alert('idComercio: ' + idComercio);
                currentEAN = EscannerService.getCurrentEAN();
                $scope.imagenProducto = new Image();
                $scope.imagenProducto.onload = function() {
                    console.log('Image loading success ->' + $scope.imagenProducto.src);
                };
                $scope.imagenProducto.onerror = function(err) {
                    $scope.imagenProducto.src = 'img/imagen-no-disponible.png';
                    $scope.$apply();
                    document.getElementById("priceInput").focus();
                }

                $scope.imagenProducto.src = 'https://imagenes.preciosclaros.gob.ar/productos/'+ currentEAN +'.jpg';

                $scope.data = {
                    currentPrice: 0,
                    currentDesc: '',
                    currentEAN: Number(currentEAN)
                };
                /*currentProd = {
	     			_id: currentEAN,
	                nombre: '',
	                ean: currentEAN,
	                etiquetas: [],
	                precios: [{
                        id: idComercio,
	                	lista: 0,
	                	promociones:[]	   
	     	        	}]
                    };*/

                // Obtener la descripción del producto 
                ProductoService.getProductoPorEAN(currentEAN).then(function(doc) {
                    
                    //alert(JSON.stringify(doc));
                    $scope.data.currentDesc = doc.nombre;
                    $scope.$apply();
                    //currentProd = doc;
                    //alert(idComercio);
                    // Obtener Precio para la sucursal
                 }).catch(function (err){
                    alert('No se encontró el producto. Error ->' + err);
                    $state.go('menEChango.relevarProducto');
                });

                // Obtener el precio del producto
                BasePreciosPorComercio.get(idComercio).then(function(obj){
                        
                        preciosComercio = obj;
                        //currentProd = precios.precios[currentEAN];
                        //alert(JSON.stringify(currentProd));
                        $scope.data.currentPrice = obj.precios[currentEAN].precio;
                        $scope.$apply();
                        document.getElementById("priceInput").focus();
                      
                   }).catch(function(err) {
                        alert('No se encontró el precio. Error -> ' + err);
                        $state.go('menEChango.relevarProducto');
                   });

		        //$scope.$apply();
	    });

           
        $scope.updateProducto = function () {
            
            if ($scope.data.currentPrice > 0) {
                //currentProd.nombre = $scope.data.currentDesc;
                //currentProd.ean = $scope.data.currentEAN.toString();
                
                //TODO: Actualizar precio
                
                preciosComercio.precios[currentEAN].precio = $scope.data.currentPrice;
                //alert(JSON.stringify(preciosComercio.precios[currentEAN]));
                // TODO: Guardar en una DB aparte para que no rompa los reportes
                var usuario = LoginService.getNombreUsuario();
                var fecha = new Date();
                var idRelevamiento = usuario +  fecha.getTime() + idComercio;
                BaseRelevamiento.put(
                            {
                                
                                "_id": idRelevamiento,
                                "usuario": usuario,
                                "productos": [
                                                {
                                                "ean": currentEAN,
                                                "precio_lista": $scope.data.currentPrice
                                                }
                                            ],
                                "comercio": {
                                                "_id": idComercio
                                            },
                                "fecha": moment(fecha).format().replace(/T/, ' ').replace(/-\d\d:\d\d/, '')

                            }
                        ).then(function(){
                            	BaseRelevamiento.replicate.to('https://webi.certant.com/echango/novedades_subida', {
                                live: false,
                                retry: true
				    	}).then(function(){
				    		    console.log('[Guardadas relevamiento - Sync FINISH].')
				    	}).catch(function(){
				    		    console.log('[Error al relevar - Sync FINISH].')
				    	});
                            });
                      

                alert('Precio informado. ¡Gracias!');
                $state.go('menEChango.relevarProducto');
            } else {
                alert('Se deben completar todos los campos.\nCodigo:' + $scope.data.currentEAN + '\nDesc: ' + $scope.data.currentDesc + '\nPre: $' + $scope.data.currentPrice)
            }
            
        };
                   
		})