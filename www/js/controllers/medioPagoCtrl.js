   
angular.module('app.controllers.medioPago', [])
.controller('agregarMedioDePagoCtrl', function($scope,BaseLocal,$ionicModal,MediosDePagoService) {
  
    var dbLocal = BaseLocal;
    $scope.item = {};
    $scope.mediosDePagoRegistrados = [];
   
// Obtener tarjetas
MediosDePagoService.getTarjetas().then(function(doc){
    $scope.tarjetas = doc.medioDePagoTarjetasNombres;
});

// Obtener bancos
MediosDePagoService.getBancos().then(function(doc){
    $scope.bancos = doc.medioDePagoTarjetasBancos;
});

// Obtener medios de pago registrados

MediosDePagoService.getMediosDePagoRegistrados().then(function(doc){
    if(doc.mediosDePagoRegistrados) {
        $scope.mediosDePagoRegistrados = doc.mediosDePagoRegistrados;
        $scope.$apply();
    }

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
        var timeStamp = String(new Date().getTime());
        //Agregar al array
            $scope.mediosDePagoRegistrados.push(obj);
            $scope.$apply();
        // Actualizar datos en Pouch
            MediosDePagoService.updateMediosDePagoRegistrados($scope.mediosDePagoRegistrados);

    } else {
        alert('Faltan datos requeridos');
        return;
    };
    $scope.bancoSeleccionado = '';
    $scope.tarjetaSeleccionada = '';
};

 $scope.deleteItem = function (item) {
    
    $scope.mediosDePagoRegistrados.splice($scope.mediosDePagoRegistrados.indexOf(item), 1);
    $scope.$apply();
    
    // Actualizar DB
    
    MediosDePagoService.updateMediosDePagoRegistrados($scope.mediosDePagoRegistrados);

};


})