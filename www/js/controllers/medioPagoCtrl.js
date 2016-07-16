   
angular.module('app.controllers.medioPago', [])
.controller('agregarMedioDePagoCtrl', function($scope,BaseLocal,$ionicModal) {
  
    var dbLocal = BaseLocal;
    PouchDB.debug.enable('*');
// Obtener tarjetas
dbLocal.get('medioDePagoTarjetasNombres').then(function(doc){
    $scope.tarjetas = doc.medioDePagoTarjetasNombres;
});

// Obtener bancos
dbLocal.get('medioDePagoTarjetasBancos').then(function(doc){
    $scope.bancos = doc.medioDePagoTarjetasBancos;
});

// Obtener medios de pago registrados
dbLocal.get('mediosDePagoRegistrados').then(function(doc){
    $scope.mediosDePagoRegistrados = doc.mediosDePagoRegistrados;
    $scope.$apply();
}).catch(function(err){
    BaseLocal.put({
                _id: 'mediosDePagoRegistrados',
                _rev: doc._rev,
                mediosDePagoRegistrados: $scope.mediosDePagoRegistrados
    }).catch(function(err){
        "No se pudo hacer put"
    });
})
;


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
        BaseLocal.get('mediosDePagoRegistrados').then(function(doc) {
            return BaseLocal.put({
                _id: 'mediosDePagoRegistrados',
                _rev: doc._rev,
                mediosDePagoRegistrados: $scope.mediosDePagoRegistrados
            });
        }).then(function(response) {
                
        }).catch(function (err) {
                BaseLocal.put({
                _id: 'mediosDePagoRegistrados',
                _rev: timeStamp,
                mediosDePagoRegistrados: $scope.mediosDePagoRegistrados
            }).catch(function(err){
                alert('error al crear');
            });
            $scope.$apply();
        });


    } else {
        alert('Faltan datos requeridos');
        return;
    };
    $scope.bancoSeleccionado = '';
    $scope.tarjetaSeleccionada = '';
};

 $scope.deleteItem = function (item) {
    
  $scope.mediosDePagoRegistrados.splice($scope.mediosDePagoRegistrados.indexOf(item), 1);
  var timeStamp = String(new Date().getTime());
  // Actualizar DB
  BaseLocal.get('mediosDePagoRegistrados').then(function(doc) {
            return BaseLocal.put({
                _id: 'mediosDePagoRegistrados',
                _rev: doc._rev,
                mediosDePagoRegistrados: $scope.mediosDePagoRegistrados
            });
        }).then(function(response) {
                                

        }).catch(function (err) {
                BaseLocal.put({
                _id: 'mediosDePagoRegistrados',
                _rev: doc._rev,
                mediosDePagoRegistrados: $scope.mediosDePagoRegistrados
            }).catch(function(err){
                alert('error al eliminar de la DB');
            });
            $scope.$apply();
        });
  
};

$scope.item = {};
$scope.mediosDePagoRegistrados = [];
})