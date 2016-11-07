   
angular.module('app.controllers.datosAdicionales', [])
.controller('datosAdicionalesCtrl', function($scope,BaseLocal,$ionicModal,DatosAdicionalesService,$state) {
  
    var dbLocal = BaseLocal;

    $scope.datosAdicionales = {
        sexo: "No informa",
        edad: "No informa",
        regularidadDeCompra: "No informa",
        estadoCivil: "No informa",
        lugarDeCompra: "No informa",
        composicionFamiliar: "No informa"
    };

    // Opciones

    $scope.sexos = ["Masculino","Femenino","No informa"];
    $scope.edades = ["0 a 10 Años","11 a 17 Años","18 a 22 Años","23 a 30 Años","31 a 40 Años","41 a 47 Años","48 a 59 Años","+ 60 Años","No informa"];
    $scope.estados = ["Soltero/a","Casado/a","Divorciado/a","Viudo/a","No informa"];
    $scope.regularidades = ["Diaria", "Semanal", "Mensual", "Variada", "No informa"];
    $scope.composiciones = ["Sin hijos","1 o 2 hijos","3 o más hijos","No Informa"];
    $scope.lugares = ["Supermercado","Minimercado","Almacén de Barrio","Chinos","No Informa"];

   // Obtener datos persistidos en Pouch

    DatosAdicionalesService.getDatosAdicionales().then(function(obj){
        if(obj) {
            $scope.datosAdicionales = obj;
            $scope.$apply();
        }
    });

    /*DatosAdicionalesService.updateScopeFromDB();*/

    /* Funciones modal INICIO*/
    $ionicModal.fromTemplateUrl('sexo-modal.html', {
        id: '1',
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal1 = modal;
    });

    $ionicModal.fromTemplateUrl('edad-modal.html', {
        id: '2',
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal2 = modal;
    });

    $ionicModal.fromTemplateUrl('estado-modal.html', {
        id: '3',
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal3 = modal;
    });

    $ionicModal.fromTemplateUrl('regularidad-modal.html', {
        id: '4',
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal4 = modal;
    });

    $ionicModal.fromTemplateUrl('composicion-modal.html', {
        id: '5',
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal5 = modal;
    });

    $ionicModal.fromTemplateUrl('lugares-modal.html', {
        id: '6',
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal6 = modal;
    });


$scope.openModal = function(index) {
    switch(index){
        case 1:
            $scope.modal1.show();
            break;
        case 2:
            $scope.modal2.show();
            break;
        case 3:
            $scope.modal3.show();
            break;
        case 4:
            $scope.modal4.show();
            break;
        case 5:
            $scope.modal5.show();
            break;
        case 6:
            $scope.modal6.show();
            break;
        
        default:
            break;
    }
  };

    $scope.closeModalSeleccionSexo = function(sexo) {
        $scope.datosAdicionales.sexo = sexo;
        $scope.$apply();
        $scope.modal1.hide();
    }

    $scope.closeModalSeleccionEdad = function(edad) {
        $scope.datosAdicionales.edad = edad;
        $scope.$apply();
        $scope.modal2.hide();
    }

    $scope.closeModalSeleccionEstadoCivil = function(estadoCivil) {
        $scope.datosAdicionales.estadoCivil = estadoCivil;
        $scope.$apply();
        $scope.modal3.hide();
    }

    $scope.closeModalSeleccionRegularidadCompra = function(regularidadCompra) {
        $scope.datosAdicionales.regularidadDeCompra = regularidadCompra;
        $scope.$apply();
        $scope.modal4.hide();
    }

    $scope.closeModalSeleccionComposicion = function(composicion) {
        $scope.datosAdicionales.composicionFamiliar = composicion;
        $scope.$apply();
        $scope.modal5.hide();
    }

    $scope.closeModalSeleccionLugarCompra = function(lugar) {
        $scope.datosAdicionales.lugarDeCompra = lugar;
        $scope.$apply();
        $scope.modal6.hide();
    }

/* FUNCION DE AGREGAR QUE SE LLAMA DESDE EL MODAL*/ 

$scope.guardar = function(){
    var timeStamp = String(new Date().getTime());
    if ($scope.datosAdicionales.edad &&
        $scope.datosAdicionales.regularidadDeCompra &&
        $scope.datosAdicionales.estadoCivil &&
        $scope.datosAdicionales.sexo &&
        $scope.datosAdicionales.composicionFamiliar &&
        $scope.datosAdicionales.lugarDeCompra){

        // Actualizar datos
        DatosAdicionalesService.updateDatosAdicionales($scope.datosAdicionales);
        $state.go('leyendaDeConfirmaciNDeInfo');

    } else {
        alert('Faltan datos requeridos');
        return;
    };

};


})