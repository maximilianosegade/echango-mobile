   
angular.module('app.controllers.agregarTarjetaPromocional', [])
.controller('agregarTarjetaPromocionalCtrl', function($scope,BaseLocal,$ionicModal) {
  
    var dbLocal = BaseLocal;

    $scope.tarjetasPromocionales = ['Comunidad COTO','DISCO','DIA Discount','Cencosud'];
    $scope.tarjetasPromocionalesRegistradas = [];
    $scope.tarjetaPromocionalSeleccionada = '';

    // Obtener tarjetas promocionales registradas desde Pouch

    dbLocal.get('tarjetasPromocionalesRegistradas').then(function(doc){
        // Lo encontró
        $scope.tarjetasPromocionalesRegistradas = doc.tarjetasPromocionalesRegistradas;
        $scope.$apply(); 
    }).catch(function(err){
        // Si no existe, crearlo
        dbLocal.put({
            _id: 'tarjetasPromocionalesRegistradas',
             tarjetasPromocionalesRegistradas: $scope.tarjetasPromocionalesRegistradas
        }).then(function (response) {
            // handle response
        }).catch(function (err) {
            alert('error al crear')
        });
    });
   
    /* Funciones modal INICIO*/
    $ionicModal.fromTemplateUrl('my-modal.html', {
        id: '1',
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal1 = modal;
    });

$scope.openModal = function() {
    $scope.modal1.show();
};

$scope.closeModal = function(item) {
    $scope.tarjetaPromocionalSeleccionada = item;
    $scope.$apply();
    $scope.modal1.hide();
};

$scope.$on('$destroy', function() {
        $scope.modal.remove();
})

/* Funciones modal FIN*/

/* FUNCION DE AGREGAR QUE SE LLAMA DESDE EL MODAL*/ 

$scope.agregar = function(){
    if ($scope.tarjetaPromocionalSeleccionada){
        var timeStamp = String(new Date().getTime());
        var obj = {
            "id": $scope.tarjetasPromocionalesRegistradas.length,
            "nombre": $scope.tarjetaPromocionalSeleccionada
        }
        if (validarItem($scope.tarjetaPromocionalSeleccionada)){
            $scope.tarjetasPromocionalesRegistradas.push(obj);
            // Actualizar datos en Pouch
            BaseLocal.get('tarjetasPromocionalesRegistradas').then(function(doc) {
            return BaseLocal.put({
                _id: 'tarjetasPromocionalesRegistradas',
                _rev: doc._rev,
                tarjetasPromocionalesRegistradas: $scope.tarjetasPromocionalesRegistradas
                 });
             }).then(function(response) {

                
        }).catch(function (err) {
                // Error, no existia el doc -> crearlo
                BaseLocal.put({
                _id: 'tarjetasPromocionalesRegistradas',
                tarjetasPromocionalesRegistradas: $scope.tarjetasPromocionalesRegistradas
            }).catch(function(err){
                alert('error al crear');
            });
            $scope.$apply();
        });
        }
        // Agregar al array
        $scope.tarjetaPromocionalSeleccionada = '';
        $scope.$apply();
    } else {
        alert('Faltan datos requeridos');
        return;
    };

};

 $scope.deleteItem = function (item) {
  $scope.tarjetasPromocionalesRegistradas.splice($scope.tarjetasPromocionalesRegistradas.indexOf(item), 1);
    // Actualizar DB
  BaseLocal.get('tarjetasPromocionalesRegistradas').then(function(doc) {
            return BaseLocal.put({
                _id: 'tarjetasPromocionalesRegistradas',
                _rev: doc._rev,
                tarjetasPromocionalesRegistradas: $scope.tarjetasPromocionalesRegistradas
            });
        }).then(function(response) {
                                

        }).catch(function (err) {
                BaseLocal.put({
                _id: 'tarjetasPromocionalesRegistradas',
                 tarjetasPromocionalesRegistradas: $scope.tarjetasPromocionalesRegistradas
            }).catch(function(err){
                alert('error al eliminar de la DB');
            });
            $scope.$apply();
        });  

};

var validarItem = function(unNombreDeTarjeta){
    for(i=0; i < $scope.tarjetasPromocionalesRegistradas.length; i++){
        if(unNombreDeTarjeta == $scope.tarjetasPromocionalesRegistradas[i].nombre){
            alert('Item repetido');
            return false;
        }
    }
    return true;
};

})