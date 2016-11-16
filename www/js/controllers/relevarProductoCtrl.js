angular.module('app.controllers.relevarProducto', [ 'ngCordova' ]).controller(
		'relevarProductoCtrl', function($scope, /*$cordovaBarcodeScanner,*/ EscannerService, $state, $ionicModal, ComerciosService, BaseLocal, ComprarService, UbicacionesService) {

			$scope.datos = {};

			$scope.scanBarcode = function() {
                /*
				$cordovaBarcodeScanner.scan().then(function(imageData) {
					alert(imageData.text);
					console.log("Barcode Format -> " + imageData.format);
					console.log("Cancelled -> " + imageData.cancelled);
				}, function(error) {
					console.log("An error happened -> " + error);
				});
                */
				if($scope.datos.currentComercio && $scope.datos.currentComercio.nombre != 'Sin selección') {
					EscannerService.scanBarcode().then(function(barcode) {
                    //alert(barcode);
                    var ean = EscannerService.getCurrentEAN();
                    //alert(ean);
                    $state.go('menEChango.informarProducto');
                });

				} else {
					alert('Debe especificar un comercio antes de continuar');
				}


			};

			/*ComprarService.obtenerParametrosSimulacion().then(function(doc){
				EscannerService.setCurrentComercio(doc.comercio);
				$scope.datos.currentComercio = doc.comercio;
				//alert(JSON.stringify(doc.comercio));
	
			 });	*/

			UbicacionesService.getComerciosFavoritos().then(function(doc){
				//alert(JSON.stringify(doc[0]));
				if(doc[0].direccion != 'Sin selección') {
					$scope.datos.currentComercio = {
					'_id': doc[0]._id,
					'nombre': doc[0].cadena,
					'direccion': doc[0].direccion
				};
				
				EscannerService.setCurrentComercio($scope.datos.currentComercio);
				$scope.$apply();

				}
      			//$scope.comercios = doc;
      			//$scope.$apply();
    			});
 			  
			//$scope.datos.currentComercio = EscannerService.getCurrentComercio();



			    /* Funciones modal INICIO*/
	$ionicModal.fromTemplateUrl('provincias-modal.html', {
	    id: '1',
	    scope: $scope,
	    animation: 'slide-in-up'
	}).then(function(modal) {
	    $scope.modal1 = modal;
	});

	$ionicModal.fromTemplateUrl('localidades-modal.html', {
	    id: '2',
	    scope: $scope,
	    animation: 'slide-in-up'
	}).then(function(modal) {
	    $scope.modal2 = modal;
	});
	$ionicModal.fromTemplateUrl('cadenas-modal.html', {
	    id: '3',
	    scope: $scope,
	    animation: 'slide-in-up'
	}).then(function(modal) {
	    $scope.modal3 = modal;
	});

	$ionicModal.fromTemplateUrl('comercios-modal.html', {
	    id: '4',
	    scope: $scope,
	    animation: 'slide-in-up'
	}).then(function(modal) {
	    $scope.modal4 = modal;
	});

	$ionicModal.fromTemplateUrl('relevar-comercio.html', {
       		 id: '5',
        	scope: $scope,
        	animation: 'slide-in-up'
    	}).then(function(modal) {
        $scope.modal5 = modal;
    });

	$scope.openModal = function(index) {
		switch(index) {
			case 1:
		       $scope.modal1.show();
			   break;
			case 2:
		       $scope.modal2.show();
			   break;
			case 3:
		       $scope.modal3.show();
			   break;
			case 4:
		       $scope.modal4.show();
			   break;
			case 5:
		       $scope.modal5.show();
			   break;
			default:
				break;

	    } 
	  };

		ComerciosService.provincias().then(function(doc){
            console.log('[Agregar comercio] - Cargando provincias / localidades...')
			$scope.provincias = doc;
            // Inicialmente, solo Capital, por ende fuerzo la posicion 0.
            $scope.localidades = doc[0].localidades;
            return BaseLocal.get('cadenasDisponibles');
	    }).then(function(cadenas){
            console.log('[Agregar comercio] - Cargando cadenas de supermercados...')
            $scope.cadenas = cadenas.cadenasDisponibles;
		});
    
	
	
	$scope.seleccionarComercio = function(){
	    if ($scope.comercio){	                
	    	
	     		 //$state.go('menEChango.DNdeCompro');	
				
				$scope.datos.currentComercio = {
					'_id': $scope.comercio._id,
					'nombre': $scope.cadena.nombre,
					'direccion': $scope.comercio.direccion
				};
				
				EscannerService.setCurrentComercio($scope.datos.currentComercio);
				$scope.$apply();
				//alert(JSON.stringify($scope.comercio));
				$scope.modal5.hide();
	     	

	    } else {
	        alert('Faltan datos requeridos');
	        return;
	    };
	};
	
	/* Funciones modal INICIO*/



	$scope.closeModalSeleccionProvincia = function(provincia) {
	    $scope.provincia = provincia;
	    $scope.localidades = provincia.localidades;
	    $scope.$apply();
	    $scope.modal1.hide();
	};
	$scope.closeModalSeleccionLocalidad = function(localidad) {
	    $scope.localidad = localidad;
	    $scope.$apply();
	    $scope.modal2.hide();
	};
	

	$scope.closeModalSeleccionCadena = function(cadena) {
	    $scope.cadena = cadena;	    
	    ComerciosService.comerciosFiltrados($scope.provincia.nombre,$scope.localidad.nombre,$scope.cadena._id).then(function(comercios){
	       $scope.comercios = comercios;
	       $scope.$apply();
	    });
        $scope.modal3.hide();	   
	};

	$scope.closeModalSeleccionComercio = function(comercio) {
	    $scope.comercio = comercio;
	    //agregar punto al mapa
	    var ubicacion = {};
	    ubicacion.latitud = comercio.latitud;
	    ubicacion.longitud = comercio.longitud;
	    agregarMarcador(ubicacion);
	    $scope.$apply();
	    $scope.modal4.hide();
	};

	/* Funciones modal FIN*/
	
	
	/*Funciones mapa*/
	
	 $scope.mapCreated = function(map) {
		    $scope.map = map;		    
		    $scope.$apply();   
		  };
	
	 function agregarMarcador(ubicacion){
		    var position = new google.maps.LatLng(ubicacion.latitud, ubicacion.longitud);
		    $scope.map.setCenter(position);
		    if($scope.marker != null){
		      //limpiar marcador
		      $scope.marker.setMap(null);
		    }
		    $scope.marker = new google.maps.Marker({
		        map: $scope.map,
		        animation: google.maps.Animation.DROP,
		        position: position
		    });
		  }
	 
	   $scope.$on('ionGooglePlaceCenterOnMe',function (event) {
	     
	    console.log("Centering");
	    if (!$scope.map) {
	      return;
	    }

	    $scope.loading = $ionicLoading.show({
	      content: 'Getting current location...',
	      showBackdrop: false
	    });

	    navigator.geolocation.getCurrentPosition(function (pos) {
	      console.log('Got pos', pos);
	      $scope.loading.hide();
	      var position = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
	      $scope.ubicacionAEditar.latitud =pos.coords.latitude;
	      $scope.ubicacionAEditar.longitud =pos.coords.longitude;
	      
	      agregarMarcador($scope.ubicacionAEditar);
	      agregarAreaCompra($scope.ubicacionAEditar);         
	        
	    }, function (error) {
	      alert('Unable to get location: ' + error.message);
	    });
		  });    
	 
	 
	



		});