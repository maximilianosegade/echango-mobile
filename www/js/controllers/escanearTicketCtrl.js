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
  $scope.textos = [];

  
  $scope.testOcrad = function(){
    self.showLoading();
    OCRAD(document.getElementById("pic"), function(text){
      self.hideLoading();
      console.log(text);
      $scope.textos = text.split("\n");
      self.parsearTexto();  
      $scope.$apply();
    });

  } ; 
$scope.cadenaSupermercado = '';
$scope.fechaDeCompra = '';
$scope.productosLeidos = [];
var modosLectura = ['supermercado','fecha','productos','fin'];
// Modos Lectura
// 0 Cadena de Supermercado
// 1 Fecha de Compra
// 2 Producto
// 3 Fin

var modo = 0;
var precioLeido = false;
var codigoLeido = false;

  this.parsearTexto = function() {
    alert($scope.textos);
    for (var i = 0; i < $scope.textos.length; i++) {
      var lineaActual = $scope.textos[i];
      if (lineaActual != '') {
        switch (modo) {
          case 0:
            $scope.cadenaSupermercado = lineaActual;
            alert($scope.cadenaSupermercado);
            modo++;
            break;
          case 1:
          // Buscando la fecha en el encabezado
            if (lineaActual.search('Fecha')>-1) {
              var splittedText = lineaActual.split(' ');
              $scope.fechaDeCompra = splittedText[1];
              alert($scope.fechaDeCompra);
              
            }
            break;
          case 2:
          // Leyendo productos
            if (!precioLeido) {
              var splittedText = lineaActual.split(' ');
              precio = splittedText[2];
              precioLeido = true;
            } else {
              if (!codigoLeido) {
                codigo = lineaActual.substr(0,12);
                codigoLeido = true;
              }
            }
            if (precioLeido && codigoLeido) {
              var obj = {
                "ean" : codigo,
                "precio" : precio
              }
              $scope.productosLeidos.push(obj);
              $scope.$apply();
              codigoLeido = false;
              precioLeido = false;
            }
            break;
          
        }
      } else {
        modo++;
      }
    }
  }


});
