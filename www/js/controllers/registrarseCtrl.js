angular.module('app.controllers.registrarse', [])
.controller('registrarseCtrl', function($scope,BaseLocal,$ionicModal,$state,$q,$ionicLoading,LoginService,$ionicActionSheet) {
  
    var dbLocal = BaseLocal;

    $scope.currentUser = LoginService.getCurrentUser();
    $scope.data = {};

    $scope.createUser = function() {
        if (validarUsuario()){
            alert('Usuario creado!');
            LoginService.setCurrentUser($scope.currentUser);
            $state.go('informaciNDeUsuario')
        } else {
            alert('No se pudo crear el usuario, verifique que la dirección de e-mail sea correcta,\n y que la contraseña contenga al menos una mayúscula, una minúscula y 2 números.');
        }

    }

    var validarUsuario = function() {
        

        return validarMail() && validarPass();
    }

    var validarMail = function() {
        // Al tratarse de un input-type="email", se valida al momento de ingresarlo que se trate de un mail, dejando el campo vacío si no lo es.
        // Podrían surgir validaciones futuras respecto del mail.
        return $scope.currentUser.email;
    }

    var validarPass = function() {
        var password = $scope.currentUser.password;
        //• Entre 6 y 10 caracteres alfanuméricos.
        //•	Se distingue entre mayúsculas y minúsculas.
        //•	Debe contener un mínimo de 2 números.
        //•	Debe contener al menos una minúscula y una mayúscula.
        

        return  validarLongitud(password) 
                && validarMayusculasMinusculas(password)
                && validarNumeros(password) 
                && password == $scope.data.passwordConfirm;
    }

    var validarLongitud = function(texto) {
        return texto.length > 5 && texto.length < 11;
    }

    var validarMayusculasMinusculas = function(texto) {
        return  (texto.toUpperCase() != texto)
                && (texto.toLowerCase() != texto)
    }

    var validarNumeros = function (texto) {
        var cantNumeros = 0;
        for (i = 0; i < texto.length; i++) {
            if (texto[i] >= '0' && texto[i] <= '9'){
                cantNumeros++;
            }
                
        }
        return cantNumeros > 1;
    }


})