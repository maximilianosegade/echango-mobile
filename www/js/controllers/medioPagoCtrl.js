   
angular.module('app.controllers.medioPago', [])
.controller('agregarMedioDePagoCtrl', function($scope,BaseLocal,$ionicModal) {
  
    var dbLocal = BaseLocal;
// Obtener tarjetas
dbLocal.get('medioDePagoTarjetasNombres').then(function(doc){
  $scope.tarjetas = doc.medioDePagoTarjetasNombres;
});

// Obtener bancos
dbLocal.get('medioDePagoTarjetasBancos').then(function(doc){
  $scope.bancos = doc.medioDePagoTarjetasBancos;
});

/* Funciones modal INICIO*/
$ionicModal.fromTemplateUrl('tarjetas-modal.html', {
    id: '1',
    scope: $scope,
    animation: 'slide-in-up'
}).then(function(modal) {
    $scope.modal1 = modal;
});

$ionicModal.fromTemplateUrl('bancos-modal.html', {
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

$scope.closeModalSeleccionTarjeta = function(tarjeta) {
    $scope.tarjetaSeleccionada = tarjeta;
    $scope.$apply();
    $scope.modal1.hide();
}

$scope.closeModalSeleccionBanco = function(banco) {
    $scope.bancoSeleccionado = banco;
    $scope.$apply();
    $scope.modal2.hide();
}

$scope.closeModal = function() {
    $scope.modal.hide();
};

$scope.$on('$destroy', function() {
        $scope.modal.remove();
});

/* Funciones modal FIN*/

/* FUNCION DE AGREGAR QUE SE LLAMA DESDE EL MODAL*/ 

$scope.agregar = function(){
    if ($scope.bancoSeleccionado && $scope.tarjetaSeleccionada){
        var obj = {
            "_id":$scope.mediosDePagoRegistrados.length,
            "banco":$scope.bancoSeleccionado,
            "tarjeta":$scope.tarjetaSeleccionada
        };
        $scope.mediosDePagoRegistrados.push(obj);
        $scope.$apply();

    } else {
        alert('Faltan datos requeridos');
        return;
    };
    $scope.bancoSeleccionado = '';
    $scope.tarjetaSeleccionada = '';
};

 $scope.deleteItem = function (item) {
  $scope.mediosDePagoRegistrados.splice($scope.mediosDePagoRegistrados.indexOf(item), 1);
};

$scope.item = {};
$scope.mediosDePagoRegistrados = [];
})