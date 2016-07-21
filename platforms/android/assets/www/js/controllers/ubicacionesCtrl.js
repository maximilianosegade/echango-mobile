angular.module('app.controllers.ubicaciones', [])

.controller('ubicacionesCtrl', function($scope,$state,UbicacionesService,$ionicModal) {
  
    $scope.$on("$ionicView.beforeEnter", function(event, data){
    
    UbicacionesService.getUbicaciones().then(function(doc){
      $scope.ubicaciones = doc;
    });
    console.log("State Params: ", data.stateParams);
  });
    
    /* Funciones modal INICIO*/
  $ionicModal.fromTemplateUrl('my-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
  }).then(function(modal) {
      $scope.modal = modal;
  });

  $scope.openModal = function(ubicacion) {
    $scope.ubicacionAEditar = ubicacion;
      $scope.modal.show();
  };

  $scope.closeModal = function() {
      $scope.modal.hide();
  };

  $scope.$on('$destroy', function() {
          $scope.modal.remove();
  });

  /* Funciones modal FIN*/
    
function alertar(mensaje){
  alert(mensaje);
}

  $scope.borrar = function(ubicacion){
    UbicacionesService.borrarUbicacion(ubicacion).then(function(doc){
      $scope.ubicaciones = doc;
      $scope.$apply();
    });
  };
 
  $scope.editar = function(ubicacion){
    //$scope.modal.hide();
   // $scope.ubicacionAEditar = ubicacion;
    $scope.$apply();
    var ubiJson = angular.toJson(ubicacion);
     $state.go('menu.agregarUbicaciN', {'ubicacion': ubiJson});
    
      
  };/*
  $scope.editar = function(){
    UbicacionesService.agregarUbicacion($scope.ubicacionAEditar);
      $scope.modal.hide();
  };*/
})

.controller('agregarUbicaciNCtrl', function($scope,$state, $stateParams,$ionicHistory,  $ionicLoading, UbicacionesService) {
  if($stateParams.ubicacion != null){
     $scope.ubicacionAEditar = angular.fromJson($stateParams.ubicacion);
  }else{
     $scope.ubicacionAEditar = {
        id: new Date().getTime(),
        nombre: '',
        direccion: '',
        latitud: '',
        longitud:  ''        
      }
  }
  
  function agregarMarcador(mapa, ubicacion){
    var position = new google.maps.LatLng(ubicacion.latitud, ubicacion.longitud);
    mapa.setCenter(position);
    var marker = new google.maps.Marker({
        map: mapa,
        animation: google.maps.Animation.DROP,
        position: position
    });
  }
  
  function agregarAreaCompra(ubicacion){
    var position = new google.maps.LatLng(ubicacion.latitud, ubicacion.longitud);
    var cityCircle = new google.maps.Circle({
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


                    
$scope.mapCreated = function(map) {
    $scope.map = map;
    $scope.$apply();   
  };
  
  $scope.$on('ionGooglePlaceSetLocation',function(event,location){
        
   $scope.ubicacionAEditar.latitud = location.geometry.location.lat();
   $scope.ubicacionAEditar.longitud = location.geometry.location.lng();
   $scope.ubicacionAEditar.direccion = location.formatted_address;
   agregarMarcador($scope.map, $scope.ubicacionAEditar);
   agregarAreaCompra($scope.ubicacionAEditar);
   /* $scope.map.setCenter(location.geometry.location);
    var marker = new google.maps.Marker({
        map: $scope.map,
        animation: google.maps.Animation.DROP,
        position: location.geometry.location
    });*/
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
      
      agregarMarcador($scope.map,$scope.ubicacionAEditar);
      agregarAreaCompra($scope.ubicacionAEditar);
          /*
      $scope.map.setCenter(position);
      var marker = new google.maps.Marker({
      map: $scope.map,
      animation: google.maps.Animation.DROP,
      position: position
  });*/
        
    }, function (error) {
      alert('Unable to get location: ' + error.message);
    });
  });                    
})