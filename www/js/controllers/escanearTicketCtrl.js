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

.controller('escanearTicketCtrl', function($scope, $ionicActionSheet, $ionicLoading, $ionicPlatform, $cordovaCamera, $ionicModal, BaseProductos, ProductoService, ListaService, $state) {

  var idProductos = [];
  $scope.showUpdateDesc = false;
  $ionicPlatform.ready(function() {

    $scope.datosParseados = {
      'cadenaSupermercado': '',
      'fechaDeCompra': '',
      'productosLeidos': []
    }

    $scope.currentItem = {
      'ean': '',
      'nombre': '',
      'cantidad': '',
      'index': 0
    }

    $scope.currentList = {
      'nombre': '',
      'desc': ''
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
    $scope.datosParseados = {
      'cadenaSupermercado': '',
      'fechaDeCompra': '',
      'productosLeidos': []
    };
    idProductos = [];
    $scope.showUpdateDesc = false;
    $scope.$apply();
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
          
          var cantidad = Number(splittedText[0].replace(",","."));
          cantLeida = true;
        } else {
          if (!eanLeido) {
            // Leyendo EAN
           var ean = lineaActual.substr(0,13);
           var lastSpace = 0;

           for (k = lineaActual.length - 1; k > 0; k--  ) {
              if (lineaActual[k] == ' '){
                lastSpace = k;
                break;
              } 
           }

           var nombre = lineaActual.substr(13,lastSpace - 13);
//            var ean = lineaActual;
            eanLeido = true;
          }
        } 

        if (cantLeida && eanLeido) {
          // Agregar productosLeidos
          /*var obj = {
            
            "ean": ean,
            "desc": desc,
            "cantidad": cantidad,
          };*/
           var currentProd = {
                      	  _id: ean,
	                        nombre: nombre,
	                        ean: ean

                    };

            currentProd.cantidad = cantidad;
            idProductos.push({ id: currentProd.ean});            
            $scope.datosParseados.productosLeidos.push(currentProd);
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

  /*for (var i = 0; i < $scope.datosParseados.productosLeidos.length; i++) {
    alert('Codigo: ' + $scope.datosParseados.productosLeidos[i].ean + '\nDesc: ' + $scope.datosParseados.productosLeidos[i].nombre + '\nCant: ' + $scope.datosParseados.productosLeidos[i].cantidad);
  }*/
//$scope.$apply();

  //$scope.actualizarDescripciones();
  $scope.showUpdateDesc = true;
  $scope.$apply();
  return;
}

 $scope.deleteItem = function (item) {
    $scope.datosParseados.productosLeidos.splice($scope.datosParseados.productosLeidos.indexOf(item), 1);
    $scope.$apply();
 

};

$scope.actualizarDescripciones = function() {
  //alert('Cantidad de productos a Buscar en DB:\n' + idProductos.length);
  BaseProductos.bulkGet({docs: idProductos}).then(function(response){
    
      var prods = response.results;

      /*
      for (var i = 0; i < $scope.datosParseados.productosLeidos.length; i++) {
        for (k = 0; k < prods.length; i++) {
            if(prods[k].id = $scope.datosParseados.productosLeidos[i].ean && prods[k].docs[0].ok ) {
              $scope.datosParseados.productosLeidos[i].nombre = prods[k].docs[0].ok.nombre;
              $scope.$apply();
              alert(JSON.stringify($scope.datosParseados.productosLeidos[i]));
            }
          
        }
      }*/

      for (var i = 0; i < prods.length; i++) {
        try {
            if(prods[i].docs[0].ok) {
              //alert(JSON.stringify(prods[i].docs[0].ok))
              $scope.datosParseados.productosLeidos[i].nombre = prods[i].docs[0].ok.nombre  ;
              $scope.$apply();
            }
            ;
        } catch(err) {
            alert('Error alert -> ' + err);
        }
        //alert(JSON.stringify(prods[i].docs[0]));
      }


  }).catch(function(err){
      alert('Error bulk -> ' + err);
  });
    

  
  /*
  for (var i = 0; i < $scope.datosParseados.productosLeidos.length; i++) {
      
    
  }*/

};


$scope.editItem = function(item) {
  //alert('Codigo: ' + item.ean + '\nCant: ' + item.cantidad);
  $scope.currentItem.index = $scope.datosParseados.productosLeidos.indexOf(item);
  $scope.currentItem.ean = item.ean;
  $scope.currentItem.cantidad = item.cantidad;
  $scope.currentItem.nombre = item.nombre;
  $scope.openModal(1);
}

    /* Funciones modal INICIO*/
    $ionicModal.fromTemplateUrl('editItem-modal.html', {
        id: '1',
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal1 = modal;
        
    });

    $ionicModal.fromTemplateUrl('editList-modal.html', {
        id: '2',
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal2 = modal;
        
    });

$scope.openModal = function(index) {
  switch(index) {
        case 1:
            $scope.modal1.show();
            break;
        case 2:
            $scope.modal2.show();
            break;
        default:
            break;

  }
    
};

$scope.closeAndConfirmModal = function(index) {

    switch(index) {
      case 1:
          $scope.datosParseados.productosLeidos[$scope.currentItem.index].ean = $scope.currentItem.ean;
          $scope.datosParseados.productosLeidos[$scope.currentItem.index].nombre = $scope.currentItem.nombre;
          $scope.datosParseados.productosLeidos[$scope.currentItem.index].cantidad = $scope.currentItem.cantidad;
          idProductos[$scope.currentItem.index].id = $scope.currentItem.ean;
          $scope.$apply();
          $scope.closeModal(1);
          break;
      case 2:
          //Guardar lista
          if($scope.currentList.nombre){
		
            ListaService.guardarLista($scope.currentList.nombre,$scope.currentList.desc, $scope.datosParseados.productosLeidos, false).then(function(){

                alert('¡Lista guardada!')
                $scope.closeModal(2);
                //$state.go('menEChango.misListas');
                $state.go('menEChango.listasDeCompra');
                          
              
            }).catch(function(err){
              if(err.status = 409){
                alert("Ya existe una lista con este nombre ->" + err);
              }else{
                alert("Ocurrió un error");				 
              }
              return;
            });
          }else{
            alert('Ingrese un nombre para la lista');
                		 
          }
          break;
      default:
          break;
    }
    $scope.$apply();
    
};

$scope.closeModal = function (index) {
  switch(index) {
    case 1:
      $scope.modal1.hide();
      break;
    case 2:
      $scope.modal2.hide();
      break;
    default:
      break;
  }
}

$scope.$on('$destroy', function() {
        $scope.modal.remove();
})

});


