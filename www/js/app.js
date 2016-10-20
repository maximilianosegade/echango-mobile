// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js


angular.module('app', ['ionic', 'ngCordova', 'app.controllers', 'app.routes', 'app.services', 'app.directives', 'app.controllers.comercios', 'app.controllers.medioPago','app.services.ubicaciones','app.services.comercios','app.services.producto','app.controllers.ubicaciones','app.controllers.datosAdicionales','app.controllers.agregarTarjetaPromocional','app.services.datosAdicionales','app.services.mediosDePago','app.services.tarjetaPromocional','app.controllers.login','app.services.login','app.services.compras','app.services.escanner','app.services.lista','app.controllers.prepararCompra','app.controllers.chango','app.controllers.lista','app.controllers.escanner', 'app.controllers.nuevaLista', 'app.controllers.escanearTicket', 'app.controllers.simular','app.controllers.registrarse', 'app.controllers.parametrizar'])



.run(function($ionicPlatform, BaseLocal, BaseComercios,BaseProductos, BaseListas, $rootScope, $ionicHistory,$ionicNavBarDelegate) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
      window.PouchDB = PouchDB;
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    
    mockBaseDatos(BaseLocal, BaseComercios, BaseListas, BaseProductos);
    //borrarBase(BaseLocal);
    
  });
  
  $rootScope.myGoBack = function(){
  	$ionicHistory.goBack();
  };
  
  $rootScope.$on('$stateChangeSuccess', function  (event, toState, toParams, fromState, fromParams) {
    
    	if(toState.name.indexOf('eChango') == -1){
    		$ionicNavBarDelegate.showBackButton(true);
    	}else{
    		$ionicNavBarDelegate.showBackButton(false);
    	}
  });
  
})

function borrarBase(BaseLocal){
  BaseLocal.destroy();
}

function mockBaseDatos(BaseLocal, BaseComercios, BaseListas, BaseProductos){
  
  
        // agregarTarjetas(BaseLocal);
         agregarUbicaciones(BaseLocal);
        // agregarCadenas(BaseLocal);
        // agregarComercios(BaseComercios);
         //agregarQuery(BaseComercios);
        // agregarListas(BaseListas);
        // agregarProductos(BaseProductos);

} 
/*
 * El id del objeto precio se corresponde con el _id de comercios
 * 
 * 
 * La promoción es una clave triple entre tarjeta, banco y tarjetaPromocion, si es 0 quiere decir que es para cualqueira
 * 
 * 
 * */
function agregarProductos(BaseProductos){
	BaseProductos.bulkDocs([
	     	        	{
	     					_id: '9780345418012',
	                   nombre: 'The World According To Garp',
	                   		ean: '9780345418012',
	                   etiquetas: ['libro','paperback'],
	                   precios: [{id: '1',
	                	   					lista: 70,
	                	   					promociones:[{plastico:1,
            			   						banco:1,
            			   						tarjeta:1,
            			   						acumulable: 0}]},
				                	   {id: '2',
				                		   lista: 60},
				                	   {id: '3',
				                		   lista: 80}],
            		   
	     	        	
	                 }, {
	     					_id: '7790290001193',
	 	                   nombre: 'Fernet Branca 750ml',
	 	                   ean: '7790290001193',
	 	                   etiquetas: ['Fernet','alcohol'],
	 	                   precios: [{id: '1',
	 	                	   					lista: 90},
	 				                	   {id: '2',
	 				                		   lista: 40},
	 				                	   {id: '3',
	 				                		   lista: 20}]
	 	                 },
	 	                {
		     					_id: '7891136052000',
		                   nombre: 'Campari',
		                   ean: '7891136052000',
		                   etiquetas: ['Campari','alcohol'],
		                   precios: [{id: '1',
		                	   					lista: 70},
					                	   {id: '2',
					                		   lista: 60},
					                	   {id: '3',
					                		   lista: 80}]
		                 },
		 	                {
		     					_id: '088004144708',
		                   nombre: 'Fireball Cinamon whisky 60ml',
		                   ean: '088004144708',
		                   etiquetas: ['Whisky','alcohol'],
		                   precios: [{id: '1',
		                	   					lista: 200,
		                	   					promociones:[{plastico:1,
	            			   						banco:1,
	            			   						tarjeta:1,
	            			   						acumulable: 0,
	            			   						valor: 170},{plastico:2,
		            			   						banco:2,
		            			   						tarjeta:0,
		            			   						acumulable: 0,
		            			   						valor: 170},
		            			   						{plastico:1,
			            			   						banco:0,
			            			   						tarjeta:0,
			            			   						acumulable: 0,
			            			   						valor: 170}]},
					                	   {id: '2',
					                		   lista: 300,
					                		   promociones:[{plastico:1,
	            			   						banco:1,
	            			   						tarjeta:1,
	            			   						acumulable: 0}]},
					                	   {id: '3',
					                		   lista: 270,
					                		   promociones:[{plastico:1,
	            			   						banco:1,
	            			   						tarjeta:1,
	            			   						acumulable: 0}]}]
		                 }
	                 ]);
}

function agregarListas(BaseListas){
	
	
		BaseListas.bulkDocs([
	        	{
					_id: '1',
              nombre: 'Favoritos',
              productos: [{
            	  nombre: 'atún gomez',
            	  cantidad: 2
              },{
            	  nombre: 'Nesquick	x500g',
            	  cantidad: 1
              }]
            }, {
				_id: '2',
            	nombre: 'Asado',
                productos: []
            },
            {
				_id: '3',
            	nombre: 'Cena domingo',
                productos: []
            }
            ]);
	
}

function agregarQuery(BaseComercios){
	var ddoc = {
		  _id: '_design/my_index',
		  views: {
		    by_cadena: {
		      map: function (doc) { emit(doc.nombrecadena); }.toString()
		    }
		  }
		};
	
	BaseComercios.get('_design/my_index').then(function(doc){
		BaseComercios.remove(doc._id, doc._rev).then(function(){
			BaseComercios.put(ddoc).then(function () {
		}).catch(function (err) {
		  // some error (maybe a 409, because it already exists?)
		});
	})
	}).catch(function(error){
			BaseComercios.put(ddoc).then(function () {
		}).catch(function (err) {
		  // some error (maybe a 409, because it already exists?)
		});
			
		});
		
}

function agregarComercios(BaseLocal){
	
		
	
		
	        BaseLocal.bulkDocs([
	        	{
					_id: '1',
              nombre: 'Coto Castrobarros',
              direccion: 'Castrobarros 66, caba, Argentina',
              nombrecadena: 'Coto',
              latitud: '-34.612020',
              longitud:  '-58.420792'
            }, {
				_id: '2',
              nombre: 'Disco Castrobarros',
              direccion: 'Castrobarros 166, caba, Argentina',
              nombrecadena: 'Disco',
              latitud: '-34.613968',
              longitud:  '-58.420387' 
            },
            {
				_id: '3',
              nombre: 'Disco UTN',
              direccion: 'Medrano 850, caba, Argentina',
              nombrecadena: 'Disco',
              latitud: '-34.598658',
              longitud:  '-58.420187' 
            }
            ]);
	
	
	
}

function agregarUbicaciones(BaseLocal){
	//mock de base de datos
    //Busca el documento 'ubicaciones'
    BaseLocal.get('ubicaciones').then(function(doc){
      //si lo encuentra lo borra
    	if(!(doc.ubicaciones && doc.comercios))
      BaseLocal.remove(doc._id, doc._rev).then(function(){
        //si lo borra bien lo vuelve a crear
        BaseLocal.put({
                _id: 'ubicaciones',
              "ubicaciones": [],
            "comercios":[ ]
        });
      });
    }).catch(function (error) {
           //Si no lo encuentra, lo crea
           BaseLocal.put({
        	   _id: 'ubicaciones',
               "ubicaciones": [],
             "comercios":[ ]
            });
         });

}
function agregarCadenas(BaseLocal){
	//Busca el documento 'medioDePagoTarjetasNombres'
    BaseLocal.get('cadenasDisponibles').then(function(doc){
      //si lo encuentra lo borra
      BaseLocal.remove(doc._id, doc._rev).then(function(){
        //si lo borra bien lo vuelve a crear
        BaseLocal.put({
                _id: 'cadenasDisponibles',
              "cadenasDisponibles": [{
              _id: 0,
              nombre: 'Disco',
            }, {
              _id: 1,
              nombre: 'Coto',
            },
            {
              _id: 2,
              nombre: 'Jumbo',
            }
            ]});
      });
    }).catch(function (error) {
           //Si no lo encuentra, lo crea
           BaseLocal.put({
                _id: 'cadenasDisponibles',
              "cadenasDisponibles": [{
              id: 0,
              nombre: 'Disco',
            }, {
              id: 1,
              nombre: 'Coto',
            },
            {
              id: 2,
              nombre: 'Jumbo',
            }
            ]});
         });
	}
	
function agregarTarjetas(BaseLocal){
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

