   
angular.module('app.controllers.medioPago', [])
.controller('agregarMedioDePagoCtrl', function($scope,BaseLocal,$ionicModal) {
  
    var dbLocal = BaseLocal;

    //var dbRemote = new PouchDB('http://localhost:5984/dbname');

/* Funciones modal INICIO*/
$ionicModal.fromTemplateUrl('my-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
}).then(function(modal) {
    $scope.modal = modal;
});

$scope.openModal = function() {
    $scope.modal.show();
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
    var timeStamp = String(new Date().getTime());

var item = {
        "_id": timeStamp,
        "expense": $scope.item.expense,
        "amount": $scope.item.amount,
        "hora": timeStamp
};

dbLocal.put(
    item
).then(function (response) {
    //handler del create
    $scope.items.push(item);   // Add to items array
    $scope.closeModal();      // Close the modal
}).catch(function (err) {
    console.log(err);
});
};
$scope.item = {};
$scope.items = [];

/* Traer todos lso documentos al empezar*/
dbLocal.allDocs({
    include_docs: true
}).then(function (result) {
    console.log('re    var dbLocal = new s is',result.rows);
    for(var i=0;i<result.rows.length;i++){
        var obj = {
            "_id": result.rows[i].doc.id,
            "expense": result.rows[i].doc.expense,
            "amount": result.rows[i].doc.amount,
            "hora": result.rows[i].doc.hora,
            "rev": result.rows[i].doc.rev
        }
        $scope.items.push(obj);
        $scope.$apply();
    }
    console.log($scope.items);
}).catch(function (err) {
    console.log(err);
});
})