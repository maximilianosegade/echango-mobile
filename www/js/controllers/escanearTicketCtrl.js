angular.module('app.controllers.escanearTicket', ['ionic','ngCordova'])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.controller('escanearTicketCtrl', function($scope, $ionicActionSheet, $ionicLoading, $ionicPlatform, $cordovaCamera, $ionicModal) {

  $ionicPlatform.ready(function() {

    $scope.datosParseados = {
      'cadenaSupermercado': '',
      'fechaDeCompra': '',
      'productosLeidos': []
    }

    $scope.currentItem = {
      'ean': '',
      'cantidad': '',
      'index': 0
    }


    var self = this;

    this.showLoading = function() {
      $ionicLoading.show({
        template: '<ion-spinner></ion-spinner>'
      });
    };

    this.hideLoading = function(){
      $ionicLoading.hide();
    };

    this.getPicture = function(index){

      var sourceType = index === 0 ? Camera.PictureSourceType.PHOTOLIBRARY : Camera.PictureSourceType.CAMERA;
      var options = {
        quality: 100,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: sourceType,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false,
        correctOrientation:true
      };

      $cordovaCamera.getPicture(options).then(function(imageData) {
        var image = document.getElementById('pic');
        image.src = "data:image/jpeg;base64," + imageData;
        $scope.testOcrad();
        
      }, function(err) {
          console.log(err);
      });

      
    };
    
  });

  $scope.showActionSheet = function(){
    //$scope.textos = [];

    $scope.datosParseados.productosLeidos = [];
    var hideSheet = $ionicActionSheet.show({
      buttons: [
       { text: 'Elegir Foto' },
       { text: 'Tomar Foto' }
      ],
      cancelText: 'Cancel',
      cancel: function() {
        console.log('cancel');
      },
      buttonClicked: function(index) {
        getPicture(index);
        
       return true;
      }
    });
  };

  //$scope.showActionSheet();
  //$scope.textos = [];

  
  $scope.testOcrad = function(){
    self.showLoading();
    OCRAD(document.getElementById("pic"), function(text){
      self.hideLoading();
      //console.log(text);
      $scope.textos = text.split("\n");
      alert($scope.textos);
      $scope.parsearTexto();
      $scope.$apply();
    });

  } ; 
//$scope.cadenaSupermercado = '';
//$scope.fechaDeCompra = '';
//$scope.productosLeidos = [];

$scope.parsearTexto = function() {
  var modo = 0;
  var eanLeido = false;
  var cantLeida = false;
  for (var i = 0; i < $scope.textos.length; i++) {
    var lineaActual = $scope.textos[i];
    if (lineaActual != '') {
    switch (modo) {
      case 0:
        $scope.datosParseados.cadenaSupermercado = lineaActual;
        modo++;
        break;
      case 1:
        if (lineaActual.search('Fecha') > -1) {
          var splittedText = lineaActual.split(' ');
          $scope.datosParseados.fechaDeCompra = splittedText[1];
        };
        break;
      case 2:
      // Leyendo Cantidad
        if (!cantLeida) {
          var splittedText = lineaActual.split(' ');
          var cantidad = splittedText[0];
          cantLeida = true;
        } else {
          if (!eanLeido) {
            // Leyendo EAN
           var ean = lineaActual.substr(0,12);
//            var ean = lineaActual;
            eanLeido = true;
          }
        } 

        if (cantLeida && eanLeido) {
          // Agregar productosLeidos
          var obj = {
            "ean": ean,
            "cantidad": cantidad,
          };
          $scope.datosParseados.productosLeidos.push(obj);
          $scope.$apply();
          eanLeido = false;
          cantLeida = false;
          //alert($scope.productosLeidos.length);
        }

        break;
      default:
        break;
      }
    } else {
        modo++;
    }
  }
  //alert($scope.productosLeidos);

  for (var i = 0; i < $scope.datosParseados.productosLeidos.length; i++) {
    alert('Codigo: ' + $scope.datosParseados.productosLeidos[i].ean + '\nCant: ' + $scope.datosParseados.productosLeidos[i].cantidad);
  }
//$scope.$apply();
  return;
}

 $scope.deleteItem = function (item) {
    $scope.datosParseados.productosLeidos.splice($scope.datosParseados.productosLeidos.indexOf(item), 1);
    $scope.$apply();
 

};

$scope.editItem = function(item) {
  //alert('Codigo: ' + item.ean + '\nCant: ' + item.cantidad);
  $scope.currentItem.index = $scope.datosParseados.productosLeidos.indexOf(item);
  $scope.currentItem.ean = item.ean;
  $scope.currentItem.cantidad = item.cantidad;
  $scope.openModal();
}

    /* Funciones modal INICIO*/
    $ionicModal.fromTemplateUrl('editItem-modal.html', {
        id: '1',
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal1 = modal;
        
    });

$scope.openModal = function() {
    $scope.modal1.show();
};

$scope.closeAndConfirmModal = function() {
    $scope.datosParseados.productosLeidos[$scope.currentItem.index].ean = $scope.currentItem.ean;
    $scope.datosParseados.productosLeidos[$scope.currentItem.index].cantidad = $scope.currentItem.cantidad;
    $scope.$apply();
    $scope.closeModal();
};

$scope.closeModal = function () {
    $scope.modal1.hide();
}

$scope.$on('$destroy', function() {
        $scope.modal.remove();
})

});


