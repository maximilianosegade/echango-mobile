angular.module('app.controllers.ubicaciones', [])

.controller('ubicacionesCtrl', function($scope,$state,UbicacionesService,$ionicModal) {
  
    $scope.$on("$ionicView.beforeEnter", function(event, data, viewData){
      viewData.enableBack = true;
    
    UbicacionesService.getUbicaciones().then(function(doc){
      $scope.ubicaciones = doc;
    });
  }); 

  $scope.borrar = function(ubicacion){
    UbicacionesService.borrarUbicacion(ubicacion).then(function(doc){
      $scope.ubicaciones = doc;
      $scope.$apply();
    });
  };
  
  $scope.seleccionar = function(index){
		UbicacionesService.indice = index;	
		UbicacionesService.ubicacionAEditar = $scope.ubicaciones[index];
	  	   $state.go('menEChango.agregarLugar');
	  		
	  	 }
 
  $scope.editar = function(ubicacion){    
    $scope.$apply();
    var ubiJson = angular.toJson(ubicacion);
     $state.go('menu.agregarUbicaciN', {'ubicacion': ubiJson});
  };
})

.controller('agregarUbicaciNCtrl', function($scope,$state, $stateParams,$ionicHistory,  $ionicLoading, UbicacionesService) {
	
	
	$scope.$on("$ionicView.beforeEnter", function(event, data){
		$scope.ubicacionAEditar = UbicacionesService.ubicacionAEditar;
		$scope.indice = UbicacionesService.indice;		
		UbicacionesService.getRadio().then(function(radio){
		      $scope.radio = Number(radio);
		    });
		if(!$scope.ubicacionAEditar.latitud){
			$scope.ubicacionAEditar = {};
		}
			   
	  }); 

	  
	$scope.guardarDireccion = function(){
		
		if ($scope.ubicacionAEditar.nombre && $scope.ubicacionAEditar.direccion){	                
			UbicacionesService.agregarUbicacion($scope.ubicacionAEditar, $scope.indice).then(function(doc){
		        $ionicHistory.nextViewOptions({
		          disableBack: true
		        });
		    
		      $state.go('menEChango.misLugares');
		      });

	    } else {
	        alert('Faltan datos requeridos');
	        return;
	    };	      
	      
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
  
  function agregarAreaCompra(ubicacion){
    var position = new google.maps.LatLng(ubicacion.latitud, ubicacion.longitud);
    if($scope.areaCompra != null){
      //limpiar círculo área compra
      $scope.areaCompra.setMap(null);
    }
    $scope.areaCompra = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#00FF00',
      fillOpacity: 0.35,
      map: $scope.map,
      center: position,
      radius: $scope.radio
    }); 
  }
  
  $scope.mapCreated = function(map) {
    $scope.map = map;
    if($stateParams.ubicacion != null){
     $scope.ubicacionAEditar = angular.fromJson($stateParams.ubicacion);
     agregarMarcador($scope.ubicacionAEditar);
     agregarAreaCompra($scope.ubicacionAEditar);
  }else{
     $scope.ubicacionAEditar = {
        id: new Date().getTime(),
        nombre: '',
        direccion: '',
        latitud: '',
        longitud:  ''        
      }
  }
    $scope.$apply();   
  };
    
         
  $scope.buscarDireccion = function(ubicacion){
    var coordenadas = UbicacionesService.buscarDireccion(ubicacion.direccion);
  }
  

  
  $scope.$on('ionGooglePlaceSetLocation',function(event,location){
        
   $scope.ubicacionAEditar.latitud = location.geometry.location.lat();
   $scope.ubicacionAEditar.longitud = location.geometry.location.lng();
   $scope.ubicacionAEditar.direccion = location.formatted_address;
   agregarMarcador($scope.ubicacionAEditar);
   agregarAreaCompra($scope.ubicacionAEditar);
});

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
})

.controller('radioCompraCtrl', function($scope,$state,  UbicacionesService) {
	$scope.$on("$ionicView.beforeEnter", function(event, data){
		$scope.data = {};
	    UbicacionesService.getRadio().then(function(radio){
	      $scope.data.radio = radio;
	    });
	  }); 
	
	
	$scope.actualizarRadio = function(){
		UbicacionesService.actualizarRadio($scope.data.radio);
	}
	
	
})