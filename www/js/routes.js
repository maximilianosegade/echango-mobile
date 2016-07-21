angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('menu.eChango', {
    url: '/page1',
    views: {
      'side-menu21': {
        templateUrl: 'templates/eChango.html',
        controller: 'eChangoCtrl'
      }
    }
  })

  .state('menu', {
    url: '/side-menu21',
    templateUrl: 'templates/menu.html',
    abstract:true
  })

  .state('menu.login', {
    url: '/page4',
    views: {
      'side-menu21': {
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
      }
    }
  })

  .state('menu.socialLogin', {
    url: '/page5',
    views: {
      'side-menu21': {
        templateUrl: 'templates/socialLogin.html',
        controller: 'socialLoginCtrl'
      }
    }
  })

  .state('menu.datosAdicionales', {
    url: '/page6',
    views: {
      'side-menu21': {
        templateUrl: 'templates/datosAdicionales.html',
        controller: 'datosAdicionalesCtrl'
      }
    }
  })

  .state('menu.agregarUbicaciN', {
    url: '/page7?ubicacion',
    views: {
      'side-menu21': {
        templateUrl: 'templates/agregarUbicaciN.html',
        controller: 'agregarUbicaciNCtrl'
      }
    }
  })

  .state('menu.miChango', {
    url: '/page8',
    views: {
      'side-menu21': {
        templateUrl: 'templates/miChango.html',
        controller: 'miChangoCtrl'
      }
    }
  })

  .state('menu.configuraciN', {
    url: '/page9',
    views: {
      'side-menu21': {
        templateUrl: 'templates/configuraciN.html',
        controller: 'configuraciNCtrl'
      }
    }
  })

  .state('menu.misListas', {
    url: '/page10',
    views: {
      'side-menu21': {
        templateUrl: 'templates/misListas.html',
        controller: 'misListasCtrl'
      }
    }
  })

  .state('menu.detalleProducto', {
    url: '/page11',
    views: {
      'side-menu21': {
        templateUrl: 'templates/detalleProducto.html',
        controller: 'detalleProductoCtrl'
      }
    }
  })

  .state('configurarCompra', {
    url: '/page12',
    templateUrl: 'templates/configurarCompra.html',
    controller: 'configurarCompraCtrl'
  })

  .state('mapa', {
    url: '/page13',
    templateUrl: 'templates/mapa.html',
    controller: 'mapaCtrl'
  })

  .state('confirmarMediosDePago', {
    url: '/page14',
    templateUrl: 'templates/confirmarMediosDePago.html',
    controller: 'confirmarMediosDePagoCtrl'
  })

  .state('menu.agregarMedioDePago', {
    url: '/page15',
    views: {
      'side-menu21': {
        templateUrl: 'templates/agregarMedioDePago.html',
        controller: 'agregarMedioDePagoCtrl'
      }
    }
  })

  .state('menu.agregarTarjetaPromocional', {
    url: '/page16',
    views: {
      'side-menu21': {
        templateUrl: 'templates/agregarTarjetaPromocional.html',
        controller: 'agregarTarjetaPromocionalCtrl'
      }
    }
  })

  .state('elijaUnChango', {
    url: '/page17',
    templateUrl: 'templates/elijaUnChango.html',
    controller: 'elijaUnChangoCtrl'
  })

  .state('menu.escanear', {
    url: '/page18',
    views: {
      'side-menu21': {
        templateUrl: 'templates/escanear.html',
        controller: 'escanearCtrl'
      }
    }
  })

  .state('menu.confirmarEscaneo', {
    url: '/page19',
    views: {
      'side-menu21': {
        templateUrl: 'templates/confirmarEscaneo.html',
        controller: 'confirmarEscaneoCtrl'
      }
    }
  })

  .state('relevamiento', {
    url: '/page20',
    templateUrl: 'templates/relevamiento.html',
    controller: 'relevamientoCtrl'
  })

  .state('menu.ubicaciones', {
    url: '/page21',
    views: {
      'side-menu21': {
        templateUrl: 'templates/ubicaciones.html',
        controller: 'ubicacionesCtrl'
      }
    }
  })
  
  .state('menu.preferenciasDeAplicaciN', {
    url: '/page22',
    views: {
      'side-menu21': {
        templateUrl: 'templates/preferenciasDeAplicaciN.html',
        controller: 'preferenciasDeAplicaciNCtrl'
      }
    }
  })

  .state('menu.nuevaLista', {
    url: '/page23',
    views: {
      'side-menu21': {
        templateUrl: 'templates/nuevaLista.html',
        controller: 'nuevaListaCtrl'
      }
    }
  })
    .state('menu.consultarPrecio', {
    url: '/page24',
    views: {
      'side-menu21': {
        templateUrl: 'templates/consultarPrecio.html',
        controller: 'consultarPrecioCtrl'
      }
    }
  })

  .state('menu.relevarPrecio', {
    url: '/page25',
    views: {
      'side-menu21': {
        templateUrl: 'templates/relevarPrecio.html',
        controller: 'relevarPrecioCtrl'
      }
    }
  })

$urlRouterProvider.otherwise('/side-menu21/page1')

  

});