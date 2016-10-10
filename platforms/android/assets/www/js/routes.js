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
    controller: 'informaciNDeUsuarioCtrl'
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

  .state('gestiNDeCompra', {
    url: '/purchase-management',
    templateUrl: 'templates/gestiNDeCompra.html',
    controller: 'gestiNDeCompraCtrl'
  })

  .state('parametrizaciNDeCompra', {
    url: '/purchase-config',
    templateUrl: 'templates/parametrizaciNDeCompra.html',
    controller: 'parametrizaciNDeCompraCtrl'
  })

  .state('parMetrosDeSimulaciN', {
    url: '/purchase-config-simu',
    templateUrl: 'templates/parMetrosDeSimulaciN.html',
    controller: 'parMetrosDeSimulaciNCtrl'
  })

  .state('eChango', {
    url: '/cart',
    templateUrl: 'templates/eChango.html',
    controller: 'eChangoCtrl'
  })

  .state('verificarChango', {
    url: '/cart-verify',
    templateUrl: 'templates/verificarChango.html',
    controller: 'verificarChangoCtrl'
  })

  .state('cerrarChango', {
    url: '/purchase-close',
    templateUrl: 'templates/cerrarChango.html',
    controller: 'cerrarChangoCtrl'
  })

  .state('compraSimulada', {
    url: '/purchase-close-simu',
    templateUrl: 'templates/compraSimulada.html',
    controller: 'compraSimuladaCtrl'
  })

  .state('listasDeCompra', {
    url: '/purchase-list',
    templateUrl: 'templates/listasDeCompra.html',
    controller: 'listasDeCompraCtrl'
  })

  .state('misListas', {
    url: '/my-lists',
    templateUrl: 'templates/misListas.html',
    controller: 'misListasCtrl'
  })

  .state('simularCompraConLista', {
    url: '/purchase-simulation',
    templateUrl: 'templates/simularCompraConLista.html',
    controller: 'simularCompraConListaCtrl'
  })

  .state('verModificarLista', {
    url: '/purchase-list-abm',
    templateUrl: 'templates/verModificarLista.html',
    controller: 'verModificarListaCtrl'
  })

  .state('ticketEscaneado', {
    url: '/scanned-list',
    templateUrl: 'templates/ticketEscaneado.html',
    controller: 'ticketEscaneadoCtrl'
  })

  .state('combinarListas', {
    url: '/lists-merge',
    templateUrl: 'templates/combinarListas.html',
    controller: 'combinarListasCtrl'
  })

  .state('configuraciNDeEChango', {
    url: '/Config',
    templateUrl: 'templates/configuraciNDeEChango.html',
    controller: 'configuraciNDeEChangoCtrl'
  })

  .state('preferenciasDeConsumo', {
    url: '/Consumer-preferences',
    templateUrl: 'templates/preferenciasDeConsumo.html',
    controller: 'preferenciasDeConsumoCtrl'
  })

  .state('DNdeCompro', {
    url: '/where-i-buy',
    templateUrl: 'templates/DNdeCompro.html',
    controller: 'DNdeComproCtrl'
  })

  .state('misLugares', {
    url: '/my-places',
    templateUrl: 'templates/misLugares.html',
    controller: 'misLugaresCtrl'
  })

  .state('agregarSucursal', {
    url: '/add-supermarket',
    templateUrl: 'templates/agregarSucursal.html',
    controller: 'agregarSucursalCtrl'
  })

  .state('agregarLugar', {
    url: '/add-place',
    templateUrl: 'templates/agregarLugar.html',
    controller: 'agregarLugarCtrl'
  })

  .state('ReaDeCompra', {
    url: '/buy-radius',
    templateUrl: 'templates/ReaDeCompra.html',
    controller: 'ReaDeCompraCtrl'
  })

  .state('mediosDePagoYDescuentos', {
    url: '/pay-discount-methods',
    templateUrl: 'templates/mediosDePagoYDescuentos.html',
    controller: 'mediosDePagoYDescuentosCtrl'
  })

  .state('mediosDePago', {
    url: '/paying-methods',
    templateUrl: 'templates/mediosDePago.html',
    controller: 'mediosDePagoCtrl'
  })

  .state('agregarMedioDePago', {
    url: '/add-paying-method',
    templateUrl: 'templates/agregarMedioDePago.html',
    controller: 'agregarMedioDePagoCtrl'
  })

  .state('descuentos', {
    url: '/discount-cards',
    templateUrl: 'templates/descuentos.html',
    controller: 'descuentosCtrl'
  })

  .state('agregarDescuento', {
    url: '/adding-discounts',
    templateUrl: 'templates/agregarDescuento.html',
    controller: 'agregarDescuentoCtrl'
  })

  .state('cuentaEChango', {
    url: '/echango-account',
    templateUrl: 'templates/cuentaEChango.html',
    controller: 'cuentaEChangoCtrl'
  })

  .state('redesSociales', {
    url: '/social-networks',
    templateUrl: 'templates/redesSociales.html',
    controller: 'redesSocialesCtrl'
  })

  .state('eliminarCuentaEChango', {
    url: '/delete-account',
    templateUrl: 'templates/eliminarCuentaEChango.html',
    controller: 'eliminarCuentaEChangoCtrl'
  })

  .state('reportesEIndicadores', {
    url: '/reports',
    templateUrl: 'templates/reportesEIndicadores.html',
    controller: 'reportesEIndicadoresCtrl'
  })

  .state('comprasRealizadas', {
    url: '/purchase-done',
    templateUrl: 'templates/comprasRealizadas.html',
    controller: 'comprasRealizadasCtrl'
  })

  .state('productosYPrecios', {
    url: '/prices-by-products',
    templateUrl: 'templates/productosYPrecios.html',
    controller: 'productosYPreciosCtrl'
  })

  .state('ahorrosAcumulados', {
    url: '/savings',
    templateUrl: 'templates/ahorrosAcumulados.html',
    controller: 'ahorrosAcumuladosCtrl'
  })

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

  .state('agregarProducto', {
    url: '/add-to-cart',
    templateUrl: 'templates/agregarProducto.html',
    controller: 'agregarProductoCtrl'
  })

$urlRouterProvider.otherwise('/main')

  

});