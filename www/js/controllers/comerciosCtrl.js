angular.module('app.controllers.comercios', [])

.controller('comerciosCtrl', function($scope,$state, BaseComercios, BaseLocal,UbicacionesService,$ionicModal,$ionicHistory,ComerciosService,ComprarService,ListaService) {
	
	$scope.$on("$ionicView.beforeEnter", function(event, data){
		$scope.simular = ComprarService.simular;
				
    		
    UbicacionesService.getComerciosFavoritos().then(function(doc){
    	
      $scope.comercios = doc;
      $scope.$apply();
    });
  }); 
  
  $scope.borrar = function(comercio){
    UbicacionesService.borrarComercio(comercio).then(function(doc){
      $scope.comerciosGuardados = doc;
      $scope.$apply();
    });
  };

  
  
var dbLocal = BaseLocal;

$scope.seleccionar = function(index){
  	 if($scope.simular){
  		 $scope.elegirComercio(index);
  	 }else{
  		 editar(index);
  	 }
   };
   
   function editar(index){
	   
	   UbicacionesService.indice = index;	
	   $state.go('menEChango.agregarSucursal');	
	   
   }
   
   $scope.elegirComercio = function (index){
	   UbicacionesService.indice = index;
  	 ComprarService.seleccionarComercio( $scope.comercios[index]).then(function(){
  		 if(ComprarService.simulacion){
		 	$state.go('menEChango.parMetrosDeSimulaciN');	
		 }else{
			 $state.go('menEChango.parametrizaciNDeCompra');
		 }	 
  	 });
  		
   } 




/* Funciones modal INICIO*/
$ionicModal.fromTemplateUrl('comercios-modal.html', {
    id: '1',
    scope: $scope,
    animation: 'slide-in-up'
}).then(function(modal) {
    $scope.modal1 = modal;
});

$ionicModal.fromTemplateUrl('cadenas-modal.html', {
    id: '2',
    scope: $scope,
    animation: 'slide-in-up'
}).then(function(modal) {
    $scope.modal2 = modal;
});

$scope.openModal = function(index) {
    if(index == 1) {
        $scope.modal1.show();
    } else {
        $scope.modal2.show();
    }
  };

$scope.closeModalSeleccionCadena = function(cadena) {
    $scope.cadenaSeleccionada = cadena;
    ComerciosService.comerciosPorCadena(cadena).then(function(comercios){
    	$scope.comercios = comercios;
    });
    $scope.$apply();
    $scope.modal2.hide();
};

$scope.closeModalSeleccionComercio = function(comercio) {
    $scope.comercioSeleccionado = comercio;
    $scope.$apply();
    $scope.modal1.hide();
};



$scope.closeModal = function() {
    $scope.modal.hide();
};

$scope.$on('$destroy', function() {
        $scope.modal.remove();
});

/* Funciones modal FIN*/

/* FUNCION DE AGREGAR QUE SE LLAMA DESDE EL MODAL*/ 

$scope.agregar = function(){
    if ($scope.cadenaSeleccionada && $scope.comercioSeleccionado){
                
        //Agregar al array
        $scope.comercioSeleccionado.id = $scope.comercioSeleccionado._id;
        if($scope.comerciosGuardados){
        	 removerElemento($scope.comerciosGuardados,$scope.comercioSeleccionado);
        }else{
        	$scope.comerciosGuardados = [];
        }
        removerElemento($scope.comerciosGuardados,$scope.comercioSeleccionado);
            $scope.comerciosGuardados.push($scope.comercioSeleccionado);
            $scope.$apply();
        // Actualizar datos en Pouch
        UbicacionesService.agregarComercioFavorito($scope.comercioSeleccionado);     


    } else {
        alert('Faltan datos requeridos');
        return;
    };
    $scope.cadenaSeleccionada = '';
    $scope.comercioSeleccionado = '';
};

 $scope.deleteItem = function (item) {
    
  $scope.cadenasDisponibles.splice($scope.cadenasDisponibles.indexOf(item), 1);
  var timeStamp = String(new Date().getTime());
  // Actualizar DB
  BaseLocal.get('cadenasDisponibles').then(function(doc) {
            return BaseLocal.put({
                _id: 'cadenasDisponibles',
                _rev: doc._rev,
                cadenasDisponibles: $scope.cadenasDisponibles
            });
        }).then(function(response) {
                                

        }).catch(function (err) {
                BaseLocal.put({
                _id: 'cadenasDisponibles',
                _rev: doc._rev,
                cadenasDisponibles: $scope.cadenasDisponibles
            }).catch(function(err){
                alert('error al eliminar de la DB');
            });
            $scope.$apply();
        });
  
};

})
.controller('comerciosABMCtrl', function($scope,$state, BaseComercios, BaseLocal,UbicacionesService,$ionicModal,$ionicHistory,ComerciosService,ComprarService,ListaService) {
	$scope.$on("$ionicView.beforeEnter", function(event, data){
	
		$scope.indice = UbicacionesService.indice;
		
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
    
    }); 	
	
	$scope.agregar = function(){
	    if ($scope.comercio){	                
	    	UbicacionesService.actualizarComercioFavorito($scope.comercio, $scope.indice).then(function(){
	     		 $state.go('menEChango.DNdeCompro');		 
	     	 });

	    } else {
	        alert('Faltan datos requeridos');
	        return;
	    };
	};
	
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
	$scope.openModal = function(index) {
	    if(index == 1) {
	        $scope.modal1.show();
	    } else if (index == 2){
	        $scope.modal2.show();
	    }else if (index == 3){
	        $scope.modal3.show();
	    }else if (index == 4){
	        $scope.modal4.show();
	    }
	  };


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
	 
	 
	
})	;
