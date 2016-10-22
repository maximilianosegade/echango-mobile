   
angular.module('app.controllers.agregarTarjetaPromocional', [])
.controller('agregarTarjetaPromocionalCtrl', function($scope,$state,BaseLocal,$ionicModal,TarjetaPromocionalService,ComprarService) {
  
    var dbLocal = BaseLocal;
    
    $scope.$on("$ionicView.beforeEnter", function(event, data){
    	$scope.simular = ComprarService.simular;
    	TarjetaPromocionalService.getTarjetasPromocionales().then(function(doc){
            $scope.tarjetasPromocionales = doc.tarjetasPromocionales;
            $scope.$apply();
        });
        // Obtener tarjetas promocionales registradas desde Pouch
    	TarjetaPromocionalService.getTarjetasPromocionalesRegistradas().then(function(doc){
            $scope.tarjetasPromocionalesRegistradas = doc.tarjetasPromocionalesRegistradas;
            $scope.$apply();
        });
    });

    //$scope.tarjetasPromocionales = ['Comunidad COTO','DISCO','DIA Discount','Cencosud'];
    //$scope.tarjetasPromocionalesRegistradas = [];
    $scope.tarjetaPromocionalSeleccionada = '';


    $scope.seleccionar = function(item){
   	 if($scope.simular){
   		 $scope.elegirDescuento(item);
   	 }
    };
    
    $scope.elegirDescuento = function (item){
   	 ComprarService.seleccionarDescuento(item).then(function(){
   		 $state.go('menEChango.parametrizaciNDeCompra');		 
   	 });
   		
    }

   
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
        
        if (validarItem($scope.tarjetaPromocionalSeleccionada)){
            $scope.tarjetasPromocionalesRegistradas.push($scope.tarjetaPromocionalSeleccionada);
            // Actualizar datos en Pouch
            TarjetaPromocionalService.updateTarjetasPromocionalesRegistradas($scope.tarjetasPromocionalesRegistradas);
            $scope.$apply();

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
            TarjetaPromocionalService.updateTarjetasPromocionalesRegistradas($scope.tarjetasPromocionalesRegistradas);            
            $scope.$apply();
 

};

var validarItem = function(tarjeta){
    for(i=0; i < $scope.tarjetasPromocionalesRegistradas.length; i++){
        if(tarjeta._id == $scope.tarjetasPromocionalesRegistradas[i]._id){
            alert('Item repetido');
            return false;
        }
    }
    return true;
};

})