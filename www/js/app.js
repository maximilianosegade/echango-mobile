// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.services', 'app.directives', 'app.controllers.medioPago','app.services.ubicaciones','app.controllers.ubicaciones','app.controllers.datosAdicionales','app.controllers.agregarTarjetaPromocional','app.services.datosAdicionales'])

.run(function($ionicPlatform, BaseLocal) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    
    //mockBaseDatos(BaseLocal);
    //borrarBase(BaseLocal);
    
  });
})

function borrarBase(BaseLocal){
  BaseLocal.destroy();
}

function mockBaseDatos(BaseLocal){
  
  //mock de base de datos
    //Busca el documento 'ubicaciones'
    BaseLocal.get('ubicaciones').then(function(doc){
      //si lo encuentra lo borra
      BaseLocal.remove(doc._id, doc._rev).then(function(){
        //si lo borra bien lo vuelve a crear
        BaseLocal.put({
                _id: 'ubicaciones',
              "ubicaciones": [{
              id: 1,
              nombre: 'Coto Castrobarros',
              direccion: 'Castrobarros 66, caba, Argentina',
              latitud: '-34.612020',
              longitud:  '-58.420792'
            }, {
              id: 0,
              nombre: 'Disco Castrobarros',
              direccion: 'Castrobarros 166, caba, Argentina',
              latitud: '-34.613968',
              longitud:  '-58.420387' 
            },
            {
              id: 2,
              nombre: 'Disco UTN',
              direccion: 'Medrano 850, caba, Argentina',
              latitud: '-34.598658',
              longitud:  '-58.420187' 
            }
            ]});
      });
    }).catch(function (error) {
           //Si no lo encuentra, lo crea
           BaseLocal.put({
                _id: 'ubicaciones',
              "ubicaciones": [{
              id: 0,
              nombre: 'Coto Castrobarros',
              direccion: 'Castrobarros 66, caba, Argentina',
              latitud: '-34.612020',
              longitud:  '-58.420792'
            }, {
              id: 1,
              nombre: 'Disco Castrobarros',
              direccion: 'Castrobarros 166, caba, Argentina',
              latitud: '-34.613968',
              longitud:  '-58.420387' 
            },
            {
              id: 2,
              nombre: 'Disco UTN',
              direccion: 'MEdrano 850, caba, Argentina',
              latitud: '-34.598658',
              longitud:  '-58.420187' 
            }
            ]});
         });
         
         //Busca el documento 'medioDePagoTarjetasNombres'
    BaseLocal.get('medioDePagoTarjetasNombres').then(function(doc){
      //si lo encuentra lo borra
      BaseLocal.remove(doc._id, doc._rev).then(function(){
        //si lo borra bien lo vuelve a crear
        BaseLocal.put({
                _id: 'medioDePagoTarjetasNombres',
              "medioDePagoTarjetasNombres": [{
              id: 0,
              nombre: 'Visa Crédito',
            }, {
              id: 1,
              nombre: 'MasterCard',
            },
            {
              id: 2,
              nombre: 'American Express',
            }
            ]});
      });
    }).catch(function (error) {
           //Si no lo encuentra, lo crea
           BaseLocal.put({
                _id: 'medioDePagoTarjetasNombres',
              "medioDePagoTarjetasNombres": [{
              id: 0,
              nombre: 'Visa Crédito',
            }, {
              id: 1,
              nombre: 'MasterCard',
            },
            {
              id: 2,
              nombre: 'American Express',
            }
            ]});
         });

    //Busca el documento 'medioDePagoTarjetasBancos'
    BaseLocal.get('medioDePagoTarjetasBancos').then(function(doc){
      //si lo encuentra lo borra
      BaseLocal.remove(doc._id, doc._rev).then(function(){
        //si lo borra bien lo vuelve a crear
        BaseLocal.put({
                _id: 'medioDePagoTarjetasBancos',
              "medioDePagoTarjetasBancos": [{
              id: 0,
              nombre: 'Santander Río',
            }, {
              id: 1,
              nombre: 'Galicia',
            },
            {
              id: 2,
              nombre: 'Francés',
            }
            ]});
      });
    }).catch(function (error) {
           //Si no lo encuentra, lo crea
           BaseLocal.put({
                _id: 'medioDePagoTarjetasBancos',
              "medioDePagoTarjetasBancos": [{
              id: 0,
              nombre: 'Santander Río',
            }, {
              id: 1,
              nombre: 'Galicia',
            },
            {
              id: 2,
              nombre: 'Francés',
            }
            ]});
         });

} 
