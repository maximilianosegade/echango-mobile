   
angular.module('app.controllers.datosAdicionales', [])
.controller('datosAdicionalesCtrl', function($scope,BaseLocal,$ionicModal) {
  
    var dbLocal = BaseLocal;

    $scope.datosAdicionales = [{
        nombre: '',
        password: '',
        sexo: '',
        edad: '',
        regularidadCompra: '',
        estadoCivil: '',
        lugarCompraAlmacenBarrio: false,
        lugarCompraSupermercado: false,
        lugarCompraMinimercado: false,
        lugarCompraMinimercadoChino: false
    }];

    // Opciones

    $scope.sexos = ["Masculino","Femenino","No informa"];
    $scope.edades = ["0 - 10 Años","11 - 17 Años","18 - 22 Años","23 - 30 Años","31 - 40 Años","41 - 47 Años","48 - 59 Años","+ 60 Años"];
    $scope.estados = ["Soltero/a","Casado/a","Divorciado/a","Viudo/a","No informa"];
    $scope.regularidades = ["Diaria", "Semanal", "Mensual", "Variada", "No informa"];

   // Obtener datos persistidos en Pouch

    BaseLocal.get('datosAdicionales').then(function (doc) {
        $scope.datosAdicionales.sexo = doc.sexo;
        $scope.datosAdicionales.estadoCivil = doc.estadoCivil;
        $scope.datosAdicionales.regularidadCompra = doc.regularidadCompra;
        $scope.datosAdicionales.edad = doc.edad;
        $scope.datosAdicionales.nombre = doc.nombre;
        $scope.datosAdicionales.password = doc.password;
        $scope.datosAdicionales.lugarCompraAlmacenBarrio = doc.lugarCompraAlmacenBarrio;
        $scope.datosAdicionales.lugarCompraMinimercado = doc.lugarCompraMinimercado;
        $scope.datosAdicionales.lugarCompraMinimercadoChino = doc.lugarCompraMinimercadoChino;
        $scope.datosAdicionales.lugarCompraSupermercado = doc.lugarCompraSupermercado;
        $scope.$apply();

    }).catch(function (err) {
        alert('Error de get datosAdicionales');
       
    });

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
        $scope.datosAdicionales.regularidadCompra = regularidadCompra;
        $scope.$apply();
        $scope.modal4.hide();
    }


/*$scope.closeModal = function() {
    $scope.modal.hide();
};

$scope.$on('$destroy', function() {
        $scope.modal.remove();
})*/

/* Funciones modal FIN*/

/* FUNCION DE AGREGAR QUE SE LLAMA DESDE EL MODAL*/ 

$scope.guardar = function(){
    var timeStamp = String(new Date().getTime());
    if ($scope.datosAdicionales.nombre && 
        $scope.datosAdicionales.password &&
        $scope.datosAdicionales.edad &&
        $scope.datosAdicionales.regularidadCompra &&
        $scope.datosAdicionales.estadoCivil &&
        $scope.datosAdicionales.sexo){

        // Actualizar datos
        BaseLocal.get('datosAdicionales').then(function(doc) {
            return BaseLocal.put({
                _id: 'datosAdicionales',
                _rev: doc._rev,
                sexo: $scope.datosAdicionales.sexo,
                estadoCivil: $scope.datosAdicionales.estadoCivil,
                regularidadCompra: $scope.datosAdicionales.regularidadCompra,
                edad: $scope.datosAdicionales.edad,
                nombre: $scope.datosAdicionales.nombre,
                password: $scope.datosAdicionales.password,
                lugarCompraAlmacenBarrio: $scope.datosAdicionales.lugarCompraAlmacenBarrio,
                lugarCompraMinimercado: $scope.datosAdicionales.lugarCompraMinimercado,
                lugarCompraMinimercadoChino: $scope.datosAdicionales.lugarCompraMinimercadoChino,
                lugarCompraSupermercado: $scope.datosAdicionales.lugarCompraSupermercado,
            });
        }).then(function(response) {
              alert('Datos guardados correctamente!')
        }).catch(function (err) {
             alert('No se pudo guardar');
        });

    } else {
        alert('Faltan datos requeridos');
        return;
    };

};

 $scope.deleteItem = function (item) {
  $scope.mediosDePagoRegistrados.splice($scope.mediosDePagoRegistrados.indexOf(item), 1);
};

$scope.item = {};
$scope.mediosDePagoRegistrados = [];
})