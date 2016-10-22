angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('portada', {
    url: '/main',
    templateUrl: 'templates/portada.html',
    controller: 'portadaCtrl'
  })

  .state('menEChango', {
    url: '/menu',
    templateUrl: 'templates/menEChango.html',
    controller: 'menEChangoCtrl'
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('loginFacebook', {
    url: '/login-f',
    templateUrl: 'templates/loginFacebook.html',
    controller: 'loginFacebookCtrl'
  })

  .state('loginGoogle', {
    url: '/login-g',
    templateUrl: 'templates/loginGoogle.html',
    controller: 'loginGoogleCtrl'
  })

  .state('registrarse', {
    url: '/register',
    templateUrl: 'templates/registrarse.html',
    controller: 'registrarseCtrl'
  })

  .state('informaciNDeUsuario', {
    url: '/additional-info',
    templateUrl: 'templates/informaciNDeUsuario.html',
    controller: 'datosAdicionalesCtrl'
  })

  .state('leyendaDeConfirmaciNDeInfo', {
    url: '/user-information-confirm',
    templateUrl: 'templates/leyendaDeConfirmaciNDeInfo.html',
    controller: 'leyendaDeConfirmaciNDeInfoCtrl'
  })

  .state('recuperarContraseA', {
    url: '/password-recov',
    templateUrl: 'templates/recuperarContraseA.html',
    controller: 'recuperarContraseACtrl'
  })

  .state('menuPrincipal', {
    url: '/home',
    templateUrl: 'templates/menuPrincipal.html',
    controller: 'menuPrincipalCtrl'
  })

 .state('menEChango.gestiNDeCompra', {
    url: '/purchase-management',
    views: {
        'side-menu21': {
		    templateUrl: 'templates/gestiNDeCompra.html',
		    controller: 'gestiNDeCompraCtrl'
        }
    }
  })

 .state('menEChango.parametrizaciNDeCompra', {
    url: '/purchase-config',
    views: {
        'side-menu21': {
    templateUrl: 'templates/parametrizaciNDeCompra.html',
    controller: 'parametrizacionCtrl'
 }}
 })

 .state('menEChango.parMetrosDeSimulaciN', {
    url: '/purchase-config-simu',
    views: {
        'side-menu21': {
    templateUrl: 'templates/parMetrosDeSimulaciN.html',
    controller: 'parametrizacionCtrl'
 }}})

 .state('menEChango.eChango', {
    url: '/cart',
    views: {
        'side-menu21': {
    templateUrl: 'templates/eChango.html',
    controller: 'miChangoCtrl'
 }}})

 .state('menEChango.verificarChango', {
    url: '/cart-verify',
    views: {
        'side-menu21': {
    templateUrl: 'templates/verificarChango.html',
    controller: 'verificarChangoCtrl'
 }}})

 .state('menEChango.cerrarChango', {
    url: '/purchase-close',
    views: {
        'side-menu21': {
    templateUrl: 'templates/cerrarChango.html',
    controller: 'cerrarChangoCtrl'
 }}})

 .state('menEChango.compraSimulada', {
    url: '/purchase-close-simu',
    views: {
        'side-menu21': {
    templateUrl: 'templates/compraSimulada.html',
    controller: 'compraSimuladaCtrl'
 }}})

 .state('menEChango.listasDeCompra', {
    url: '/purchase-list',
    views: {
        'side-menu21': {
    templateUrl: 'templates/listasDeCompra.html',
    controller: 'listasDeCompraCtrl'
 }}})

 .state('menEChango.misListas', {
    url: '/my-lists',
    views: {
        'side-menu21': {
    templateUrl: 'templates/misListas.html',
    controller: 'listaCtrl'
 }}})

 .state('menEChango.simularCompraConLista', {
    url: '/purchase-simulation',
    views: {
        'side-menu21': {
    templateUrl: 'templates/simularCompraConLista.html',
    controller: 'listaCtrl'
 }}})

 .state('menEChango.verModificarLista', {
    url: '/purchase-list-abm',
    views: {
        'side-menu21': {
    templateUrl: 'templates/verModificarLista.html',
    controller: 'nuevaListaCtrl'
 }}})

 .state('menEChango.ticketEscaneado', {
    url: '/scanned-list',
    views: {
        'side-menu21': {
    templateUrl: 'templates/ticketEscaneado.html',
    controller: 'escanearTicketCtrl'
 }}})

 .state('menEChango.combinarListas', {
    url: '/lists-merge',
    views: {
        'side-menu21': {
    templateUrl: 'templates/combinarListas.html',
    controller: 'listaCtrl'
 }}})

 .state('menEChango.configuraciNDeEChango', {
    url: '/Config',
    views: {
        'side-menu21': {
    templateUrl: 'templates/configuraciNDeEChango.html',
    controller: 'configuraciNDeEChangoCtrl'
 }}})

 .state('menEChango.preferenciasDeConsumo', {
    url: '/Consumer-preferences',
    views: {
        'side-menu21': {
    templateUrl: 'templates/preferenciasDeConsumo.html',
    controller: 'preferenciasDeConsumoCtrl'
 }}})

 .state('menEChango.DNdeCompro', {
    url: '/where-i-buy',
    views: {
        'side-menu21': {
    templateUrl: 'templates/DNdeCompro.html',
    controller: 'comerciosCtrl'
 }}})

 .state('menEChango.misLugares', {
    url: '/my-places',
    views: {
        'side-menu21': {
    templateUrl: 'templates/misLugares.html',
    controller: 'ubicacionesCtrl'
 }}})

 .state('menEChango.agregarSucursal', {
    url: '/add-supermarket',
    views: {
        'side-menu21': {
    templateUrl: 'templates/agregarSucursal.html',
    controller: 'comerciosABMCtrl'
 }}})

 .state('menEChango.agregarLugar', {
    url: '/add-place',
    views: {
        'side-menu21': {
    templateUrl: 'templates/agregarLugar.html',
    controller: 'agregarUbicaciNCtrl'
 }}})

 .state('menEChango.ReaDeCompra', {
    url: '/buy-radius',
    views: {
        'side-menu21': {
    templateUrl: 'templates/ReaDeCompra.html',
    controller: 'ReaDeCompraCtrl'
 }}})

 .state('menEChango.mediosDePagoYDescuentos', {
    url: '/pay-discount-methods',
    views: {
        'side-menu21': {
    templateUrl: 'templates/mediosDePagoYDescuentos.html',
    controller: 'mediosDePagoYDescuentosCtrl'
 }}})

 .state('menEChango.mediosDePago', {
    url: '/paying-methods',
    views: {
        'side-menu21': {
    templateUrl: 'templates/mediosDePago.html',
    controller: 'agregarMedioDePagoCtrl'
 }}})

 .state('menEChango.agregarMedioDePago', {
    url: '/add-paying-method',
    views: {
        'side-menu21': {
    templateUrl: 'templates/agregarMedioDePago.html',
    controller: 'agregarMedioDePagoCtrl'
 }}})

 .state('menEChango.descuentos', {
    url: '/discount-cards',
    views: {
        'side-menu21': {
    templateUrl: 'templates/descuentos.html',
    controller: 'agregarTarjetaPromocionalCtrl'
 }}})

 .state('menEChango.agregarDescuento', {
    url: '/adding-discounts',
    templateUrl: 'templates/agregarDescuento.html',
    controller: 'agregarDescuentoCtrl'
 })

 .state('menEChango.cuentaEChango', {
    url: '/echango-account',
    views: {
        'side-menu21': {
    templateUrl: 'templates/cuentaEChango.html',
    controller: 'cuentaEChangoCtrl'
 }}})

 .state('menEChango.redesSociales', {
    url: '/social-networks',
    views: {
        'side-menu21': {
    templateUrl: 'templates/redesSociales.html',
    controller: 'redesSocialesCtrl'
 }}})

 .state('menEChango.eliminarCuentaEChango', {
    url: '/delete-account',
    views: {
        'side-menu21': {
    templateUrl: 'templates/eliminarCuentaEChango.html',
    controller: 'eliminarCuentaEChangoCtrl'
 }}})

 .state('menEChango.reportesEIndicadores', {
    url: '/reports',
    views: {
        'side-menu21': {
    templateUrl: 'templates/reportesEIndicadores.html',
    controller: 'reportesEIndicadoresCtrl'
 }}})

 .state('menEChango.comprasRealizadas', {
    url: '/purchase-done',
    views: {
        'side-menu21': {
    templateUrl: 'templates/comprasRealizadas.html',
    controller: 'comprasRealizadasCtrl'
 }}})

 .state('menEChango.productosYPrecios', {
    url: '/prices-by-products',
    views: {
        'side-menu21': {
    templateUrl: 'templates/productosYPrecios.html',
    controller: 'productosYPreciosCtrl'
 }}})

 .state('menEChango.ahorrosAcumulados', {
    url: '/savings',
    views: {
        'side-menu21': {
    templateUrl: 'templates/ahorrosAcumulados.html',
    controller: 'ahorrosAcumuladosCtrl'
 }}})

 .state('menEChango.relevarProducto', {
    url: '/product-assessment',
    views: {
      'side-menu21': {
        templateUrl: 'templates/relevarProducto.html',
        controller: 'relevarProductoCtrl'
      }
    }
 })

 .state('menEChango.informarProducto', {
    url: '/product-scan-detail',
    views: {
      'side-menu21': {
        templateUrl: 'templates/informarProducto.html',
        controller: 'informarProductoCtrl'
      }
    }
 })

 .state('menEChango.agregarProducto', {
    url: '/add-to-cart',
    views: {
        'side-menu21': {
    templateUrl: 'templates/agregarProducto.html',
    controller: 'agregarProductoCtrl'
 }}})

$urlRouterProvider.otherwise('/main')

  

});