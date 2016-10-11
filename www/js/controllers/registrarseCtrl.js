angular.module('app.controllers.registrarse', [])
.controller('registrarseCtrl', function($scope,BaseLocal,$ionicModal,$state,$q,$ionicLoading,LoginService,$ionicActionSheet) {
  
    var dbLocal = BaseLocal;

    $scope.currentUser = LoginService.getCurrentUser();
    $scope.data = {};
    

    $scope.createUser = function() {
        $scope.errores = [];
        if (validarUsuario()){
            alert('Usuario creado!');
            LoginService.setCurrentUser($scope.currentUser);
            $state.go('informaciNDeUsuario')
        } 

    }

    var validarUsuario = function() {
        

        return validarMail() && validarPass();
    }

    var validarMail = function() {
        // Al tratarse de un input-type="email", se valida al momento de ingresarlo que se trate de un mail, dejando el campo vacío si no lo es.
        // Podrían surgir validaciones futuras respecto del mail, como validar contra el backend que no esté en uso.
        if (!$scope.currentUser.email) {
            $scope.errores.push("Debe ingresar una dirección de e-mail válida.")
        }
        return $scope.currentUser.email;
    }

    var validarPass = function() {
        var password = $scope.currentUser.password;
        //• Entre 6 y 10 caracteres alfanuméricos.
        //•	Se distingue entre mayúsculas y minúsculas.
        //•	Debe contener un mínimo de 2 números.
        //•	Debe contener al menos una minúscula y una mayúscula.
        if (!password) {
            $scope.errores.push("Ingrese una contraseña. Debe contener entre 6 y 10 caracteres, al menos 1 mayúscula y una minúscula y 2 números.")
            return password;
        }

        if (password != $scope.data.passwordConfirm) {
            $scope.errores.push("Las contraseñas deben coincidir entre sí.")
        }

        return  validarLongitud(password) 
                && validarMayusculasMinusculas(password)
                && validarNumeros(password) 
                && password == $scope.data.passwordConfirm;
    }

    var validarLongitud = function(texto) {
        if (texto.length < 6 || texto.length > 10) {
            $scope.errores.push("La contraseña debe tener entre 6 y 10 caracteres.");
        }
        return texto.length > 5 && texto.length < 11;
    }

    var validarMayusculasMinusculas = function(texto) {
        if (texto.toUpperCase() == texto) {
            $scope.errores.push("La contraseña debe tener al menos una minúscula.")
        } 

        if (texto.toLowerCase() == texto) {
            $scope.errores.push("La contraseña debe tener al menos una mayúscula.")
        }

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
        if (cantNumeros < 2) {
            $scope.errores.push("La contraseña tiene menos de 2 números.")
        }

        return cantNumeros > 1;
    }


})