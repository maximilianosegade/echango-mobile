angular.module('app.controllers.ubicaciones', [])

.controller('ubicacionesCtrl', function($scope,$state,UbicacionesService,$ionicModal) {
  
    $scope.$on("$ionicView.beforeEnter", function(event, data){
    
    UbicacionesService.getUbicaciones().then(function(doc){
      $scope.ubicaciones = doc;
    });
    console.log("State Params: ", data.stateParams);
  }); 

  $scope.borrar = function(ubicacion){
    UbicacionesService.borrarUbicacion(ubicacion).then(function(doc){
      $scope.ubicaciones = doc;
      $scope.$apply();
    });
  };
 
  $scope.editar = function(ubicacion){    
    $scope.$apply();
    var ubiJson = angular.toJson(ubicacion);
     $state.go('menu.agregarUbicaciN', {'ubicacion': ubiJson});
  };
})

.controller('agregarUbicaciNCtrl', function($scope,$state, $stateParams,$ionicHistory,  $ionicLoading, UbicacionesService) {
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
      radius: areaCompra
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
    
      //TODO: modificar por valor traido de la base
      var areaCompra = 1000; //7 cuadras
   
  $scope.buscarDireccion = function(ubicacion){
    var coordenadas = UbicacionesService.buscarDireccion(ubicacion.direccion);
  }
  

$scope.guardarDireccion = function(){
      UbicacionesService.agregarUbicacion($scope.ubicacionAEditar).then(function(doc){
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
    
      $state.go('menu.ubicaciones');
      });
      
};
  
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