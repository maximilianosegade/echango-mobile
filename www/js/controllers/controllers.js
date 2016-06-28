angular.module('app.controllers', [])
  
.controller('eChangoCtrl', function($scope) {

})
      
.controller('loginCtrl', function($scope) {

})
   
.controller('socialLoginCtrl', function($scope) {

})
   
.controller('datosAdicionalesCtrl', function($scope) {

})
   
.controller('agregarUbicaciNCtrl', function($scope,  $ionicLoading, ServiciosBD) {
            
  $scope.agregarUbicacion = function(){
      var ubicacion = {
        id: 3,
        name: 'Coto Castrobarros22',
        direccion: 'Castrobarros 66, caba, Argentina',
        latitud: '-34.611820',
        longitud:  '-58.420692'        
      }
      ServiciosBD.agregarUbicacion(ubicacion).then(function(){
        var marker = new google.maps.Marker({
      map: $scope.map,
      animation: google.maps.Animation.DROP,
      position: new google.maps.LatLng(ubicacion.latitud,ubicacion.longitud)
      });
      })
};
                    
$scope.mapCreated = function(map) {
    $scope.map = map;
    ServiciosBD.getUbicaciones().then(function(doc) {
  doc.forEach(function(element) {
      var marker = new google.maps.Marker({
      map: $scope.map,
      animation: google.maps.Animation.DROP,
      position: new google.maps.LatLng(element.latitud,element.longitud)
  });
    }, this);
});
    
  };

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
   
.controller('miChangoCtrl', function($scope) {

})
   
.controller('configuraciNCtrl', function($scope) {

})
   
.controller('misListasCtrl', function($scope) {

})
   
.controller('detalleProductoCtrl', function($scope) {

})
   
.controller('configurarCompraCtrl', function($scope) {

})
   
.controller('mapaCtrl', function($scope) {

})
   
.controller('confirmarMediosDePagoCtrl', function($scope) {

})
   /*
.controller('agregarMedioDePagoCtrl', function($scope) {
  
})*/
   
.controller('agregarTarjetaPromocionalCtrl', function($scope) {

})
   
.controller('elijaUnChangoCtrl', function($scope) {

})
   
.controller('escanearCtrl', function($scope) {

})
   
.controller('confirmarEscaneoCtrl', function($scope) {

})
   
.controller('relevamientoCtrl', function($scope) {

})

.controller('ubicacionesCtrl', function($scope,ServiciosBD) {
ServiciosBD.getUbicaciones().then(function(doc){
  $scope.ubicaciones = doc;
});
$scope.borrar = function(ubicacion){
  
};
})

.controller('MapCtrl', function($scope, $ionicLoading) {
  $scope.mapCreated = function(map) {
    $scope.map = map;
  };



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
      position: pos.coords
  });
      $scope.loading.hide();
    }, function (error) {
      alert('Unable to get location: ' + error.message);
    });
  };
});

 