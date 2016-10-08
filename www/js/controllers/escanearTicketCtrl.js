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

.controller('escanearTicketCtrl', function($scope, $ionicActionSheet, $ionicLoading, $ionicPlatform, $cordovaCamera) {

  $ionicPlatform.ready(function() {

    $scope.showAnalyzeButton = false;

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
        $scope.showAnalyzeButton = true;
      }, function(err) {
          console.log(err);
      });

    };
    
  });

  $scope.showActionSheet = function(){
    $scope.textos = [];
    $scope.cadenaSupermercado = '';
    $scope.fechaDeCompra = '';
    $scope.productosLeidos = [];
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

  $scope.showActionSheet();
  //$scope.textos = [];

  
  $scope.testOcrad = function(){
    self.showLoading();
    OCRAD(document.getElementById("pic"), function(text){
      self.hideLoading();
      //console.log(text);
      $scope.textos = text.split("\n");
      alert($scope.textos);
      $scope.$apply();
      $scope.parsearTexto();
    });

  } ; 
//$scope.cadenaSupermercado = '';
//$scope.fechaDeCompra = '';
//$scope.productosLeidos = [];

$scope.parsearTexto = function() {
  var modo = 0;
  var eanLeido = false;
  var precioLeido = false;
  for (var i = 0; i < $scope.textos.length; i++) {
    var lineaActual = $scope.textos[i];
    if (lineaActual != '') {
    switch (modo) {
      case 0:
        $scope.cadenaSupermercado = lineaActual;
        modo++;
        break;
      case 1:
        if (lineaActual.search('Fecha') > -1) {
          var splittedText = lineaActual.split(' ');
          $scope.fechaDeCompra = splittedText[1];
        };
        break;
      case 2:
      // Leyendo Precio
        if (!precioLeido) {
          var splittedText = lineaActual.split(' ');
        var precio = splittedText[2];
//          var precio = lineaActual;
          precioLeido = true;
        } else {
          if (!eanLeido) {
            // Leyendo EAN
           var ean = lineaActual.substr(0,12);
//            var ean = lineaActual;
            eanLeido = true;
          }
        } 

        if (precioLeido && eanLeido) {
          // Agregar productosLeidos
          var obj = {
            "codigo": ean,
            "precio": precio,
          };
          //alert(obj.codigo + '\nPrecio:' + obj.precio);
          $scope.productosLeidos.push(obj);
          $scope.$apply();
          precioLeido = false;
          eanLeido = false;
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

  for (var i = 0; i < $scope.productosLeidos.length; i++) {
    alert('Codigo: ' + $scope.productosLeidos[i].codigo + '\nPrecio: ' + $scope.productosLeidos[i].precio);
  }
//$scope.$apply();
  return;
}

});
