angular.module('app.controllers.comercios', [])

.controller('comerciosCtrl', function($scope, BaseComercios, BaseLocal,UbicacionesService,$ionicModal,ComerciosService) {
	
	$scope.$on("$ionicView.beforeEnter", function(event, data){
    
    UbicacionesService.getComerciosFavoritos().then(function(doc){
    	
      $scope.comerciosGuardados = doc;
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
   
// Obtener comercios
/*dbLocal.get('medioDePagoComerciosNombres').then(function(doc){
    $scope.comercios = doc.medioDePagoComerciosNombres;
});*/


// Obtener medios de pago registrados
dbLocal.get('cadenasDisponibles').then(function(doc){
    $scope.cadenasDisponibles = doc.cadenasDisponibles;
    $scope.$apply();
}).catch(function(err){
    BaseLocal.put({
                _id: 'cadenasDisponibles',
                cadenasDisponibles: $scope.cadenasDisponibles
    }).catch(function(err){
        "No se pudo hacer put";
    });
})
;


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
    ComerciosService.comerciosPorCadena(cadena.nombre).then(function(comercios){
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

$scope.item = {};
$scope.cadenasDisponibles = [];
});