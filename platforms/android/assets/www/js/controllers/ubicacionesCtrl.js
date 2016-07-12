angular.module('app.controllers.ubicaciones', [])

.controller('ubicacionesCtrl', function($scope,UbicacionesService,$ionicModal) {
  
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
  
UbicacionesService.getUbicaciones().then(function(doc){
  $scope.ubicaciones = doc;
});
$scope.borrar = function(ubicacion){
  UbicacionesService.borrarUbicacion(ubicacion).then(function(doc){
    $scope.ubicaciones = doc;
    $scope.$apply();
  });
};
$scope.editar = function(ubicacion){
  alert(ubicacion.nombre);
};
})
.controller('agregarUbicaciNCtrl', function($scope,  $ionicLoading, UbicacionesService) {
            
  $scope.buscarDireccion = function(ubicacion){
    var coordenadas = UbicacionesService.buscarDireccion(ubicacion.direccion);
  }
            
  $scope.agregarUbicacion = function(){
      var ubicacion = {
        id: 3,
        name: 'Coto Castrobarros22',
        direccion: 'Castrobarros 66, caba, Argentina',
        latitud: '-34.611820',
        longitud:  '-58.420692'        
      }
      UbicacionesService.agregarUbicacion(ubicacion).then(function(){
        var marker = new google.maps.Marker({
      map: $scope.map,
      animation: google.maps.Animation.DROP,
      position: new google.maps.LatLng(ubicacion.latitud,ubicacion.longitud)
      });
      })
};


                    
$scope.mapCreated = function(map) {
    $scope.map = map;
    $scope.$apply();
    /*
    UbicacionesService.getUbicaciones().then(function(doc) {
  doc.forEach(function(element) {
      var marker = new google.maps.Marker({
      map: $scope.map,
      animation: google.maps.Animation.DROP,
      position: new google.maps.LatLng(element.latitud,element.longitud)
  });
    }, this);
});*/
    
  };
  
  $scope.$on('ionGooglePlaceSetLocation',function(event,location){
   
    $scope.map.setCenter(location.geometry.location);
    var marker = new google.maps.Marker({
        map: $scope.map,
        animation: google.maps.Animation.DROP,
        position: location.geometry.location
    });
});

  $scope.centerOnMe = function () {
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
      
      $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      var marker = new google.maps.Marker({
      map: $scope.map,
      animation: google.maps.Animation.DROP,
      position: ubicacion.coordenadas
  });
      $scope.loading.hide();
    }, function (error) {
      alert('Unable to get location: ' + error.message);
    });
  };                    
})