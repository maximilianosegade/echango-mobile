// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js


angular.module('app', ['ionic', 'ngCordova', 'app.controllers', 'app.routes', 'app.services', 'app.directives', 'app.controllers.comercios', 'app.controllers.medioPago','app.services.ubicaciones','app.services.comercios','app.services.producto','app.services.reporte','app.controllers.ubicaciones','app.controllers.datosAdicionales','app.controllers.agregarTarjetaPromocional','app.services.datosAdicionales','app.services.mediosDePago','app.services.tarjetaPromocional','app.controllers.login','app.services.login','app.services.mapas','app.services.compras','app.services.escanner','app.services.lista','app.controllers.prepararCompra','app.controllers.chango','app.controllers.lista','app.controllers.escanner', 'app.controllers.nuevaLista', 'app.controllers.escanearTicket', 'app.controllers.simular','app.controllers.registrarse', 'app.controllers.parametrizar','app.controllers.reporte','app.controllers.relevarProducto','app.controllers.informarProducto'])

.run(function($ionicPlatform, BaseLocal, BaseComercios, BasePreciosPorComercio, BaseProductos, BaseListas, DBSync,$rootScope, $ionicHistory,$ionicNavBarDelegate) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar
	// above the keyboard
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
    DBSync.init();      
    DBSync.syncPreciosPorComercio();
    
    // borrarBase(BaseLocal);

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
  
		parametriaSimulacion(BaseLocal);
		ubicacionesYcomercios(BaseLocal);
         agregarTarjetas(BaseLocal);
         agregarUbicaciones(BaseLocal);
         agregarProvincias(BaseComercios);
         agregarRadioCompra(BaseLocal);
         agregarCadenas(BaseLocal);
        // agregarComercios(BaseComercios);
         // agregarQuery(BaseComercios);
        // agregarListas(BaseListas);
       // agregarProductos(BaseProductos);

} 

function ubicacionesYcomercios(db){
	
	db.get('ubicaciones').then(function(doc){
           if(doc.ubicaciones){        		   
     	   for(var i = doc.ubicaciones.length; 3 >    i ; i++){
     		  doc.ubicaciones[i] = {
                      "nombre": "Sin selección",
                      "direccion": "Sin selección"
                    };
        	   }
           }
           if(doc.comercios){ 
     	  for(var j= doc.comercios.length; 3 >    j ; j++){
     		  doc.comercios[j] = {
                      "nombre": "Sin selección",
                      "direccion": "Sin selección"
                    };
        	   }
           }
           db.put(doc);
         });
   }

function agregarProvincias(db){
	db.put({
        _id: 'provincias',
	    provincias: [{
            nombre: 'Capital Federal',
            localidades : [                                
                {nombre: 'Agronomía'},
                {nombre: 'Almagro'},
                {nombre: 'Balvanera'},
                {nombre: 'Barracas'},
                {nombre: 'Belgrano'},
                {nombre: 'Boedo'},
                {nombre: 'Caballito'},
                {nombre: 'Chacarita'},
                {nombre: 'Coghlan'},
                {nombre: 'Colegiales'},
                {nombre: 'Constitución'},
                {nombre: 'Flores'},
                {nombre: 'Floresta'},
                {nombre: 'La Boca'},
                {nombre: 'La Paternal'},
                {nombre: 'Liniers'},
                {nombre: 'Mataderos'},
                {nombre: 'Monte Castro'},
                {nombre: 'Montserrat'},
                {nombre: 'Nueva Pompeya'},
                {nombre: 'Nuñez'},
                {nombre: 'Palermo'},
                {nombre: 'Parque Avellaneda'},
                {nombre: 'Parque Chacabuco'},
                {nombre: 'Parque Chas'},
                {nombre: 'Parque Patricios'},
                {nombre: 'Puerto Madero'},
                {nombre: 'Recoleta'},
                {nombre: 'Retiro'},
                {nombre: 'Saavedra'},
                {nombre: 'San Cristóbal'},
                {nombre: 'San Nicolás'},
                {nombre: 'San Telmo'},
                {nombre: 'Versalles'},
                {nombre: 'Villa Crespo'},
                {nombre: 'Villa Devoto'},
                {nombre: 'Villa General Mitre'},
                {nombre: 'Villa Lugano'},
                {nombre: 'Villa Luro'},
                {nombre: 'Villa Ortúzar'},
                {nombre: 'Villa Pueyrredón'},
                {nombre: 'Villa Real'},
                {nombre: 'Villa Riachuelo'},
                {nombre: 'Villa Santa Rita'},
                {nombre: 'Villa Soldati'},
                {nombre: 'Villa Urquiza'},
                {nombre: 'Villa del Parque'},
                {nombre: 'Vélez Sarsfield'}
            ]
        }]
    }).then(function(resp){
        console.log('[DB Agregar provincias] - OK.');
    }).catch(function(err){
        console.error('[DB Agregar provincias] - Error. ' + err);
    });
}

function parametriaSimulacion(BaseLocal){
	 BaseLocal.get('parametrosSimulacion').then(function(doc){
			// si está no hay que hacer nada
		}).catch(function(){
			BaseLocal.put({
				_id : "parametrosSimulacion",
				comercio: null,
				medioDePago: null,
				descuento: null,
				lista: null
			});
		});
}
function   agregarRadioCompra(BaseLocal){
	BaseLocal.get('radio').then(function(doc){
		// si está no hay que hacer nada
	}).catch(function(){
		BaseLocal.put({
			_id : "radio",
			radio: 400
		});
	});
}

/*
 * El id del objeto precio se corresponde con el _id de comercios
 * 
 * 
 * La promoción es una clave triple entre tarjeta, banco y tarjetaPromocion, si
 * es 0 quiere decir que es para cualqueira
 * 
 * 
 */
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
				                		   lista: 60,
				                		   promociones:[{plastico:1,
           			   						banco:1,
           			   						tarjeta:1,
           			   						acumulable: 0}]},
				                	   {id: '3',
				                		   lista: 80,
				                		   promociones:[]}],
            		   
	     	        	
	                 }, {
	     					_id: '7790290001193',
	 	                   nombre: 'Fernet Branca 750ml',
	 	                   ean: '7790290001193',
	 	                   etiquetas: ['Fernet','alcohol'],
	 	                   precios: [{id: '1',
	 	                	   					lista: 90,
	 				                		   promociones:[]},
	 				                	   {id: '2',
	 				                		   lista: 40,
					                		   promociones:[]},
	 				                	   {id: '3',
	 				                		   lista: 20,
					                		   promociones:[]}]
	 	                 },
	 	                {
		     					_id: '7891136052000',
		                   nombre: 'Campari',
		                   ean: '7891136052000',
		                   etiquetas: ['Campari','alcohol'],
		                   precios: [{id: '1',
		                	   					lista: 70,
						                		   promociones:[]},
					                	   {id: '2',
					                		   lista: 60,
					                		   promociones:[]},
					                	   {id: '3',
					                		   lista: 80,
					                		   promociones:[]}]
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
		      map: function (doc) { emit(doc.cadena); }.toString()
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
	// mock de base de datos
    // Busca el documento 'ubicaciones'
    BaseLocal.get('ubicaciones').then(function(doc){
      // si lo encuentra lo borra
    	if(!(doc.ubicaciones && doc.comercios))
      BaseLocal.remove(doc._id, doc._rev).then(function(){
        // si lo borra bien lo vuelve a crear
        BaseLocal.put({
                _id: 'ubicaciones',
              "ubicaciones": [ {
                  "nombre": "Sin selección",
                  "direccion": "Sin selección"
                },
                {
                  "nombre": "Sin selección",
                  "direccion": "Sin selección"
                },
                {
                    "nombre": "Sin selección",
                    "direccion": "Sin selección"
                  }],
            "comercios":[ {
                "nombre": "Sin selección",
                "direccion": "Sin selección"
              },
              {
                "nombre": "Sin selección",
                "direccion": "Sin selección"
              },
              {
                  "nombre": "Sin selección",
                  "direccion": "Sin selección"
                } ]
        });
      });
    }).catch(function (error) {
           // Si no lo encuentra, lo crea
           BaseLocal.put({
        	   _id: 'ubicaciones',
               "ubicaciones": [ {
                   "nombre": "Sin selección",
                   "direccion": "Sin selección"
                 },
                 {
                   "nombre": "Sin selección",
                   "direccion": "Sin selección"
                 },
                 {
                     "nombre": "Sin selección",
                     "direccion": "Sin selección"
                   }],
             "comercios":[ {
                 "nombre": "Sin selección",
                 "direccion": "Sin selección"
               },
               {
                 "nombre": "Sin selección",
                 "direccion": "Sin selección"
               },
               {
                   "nombre": "Sin selección",
                   "direccion": "Sin selección"
                 }]
            });
         });

}
function agregarCadenas(BaseLocal){
    var cadenasDisponibles = {
        _id: 'cadenasDisponibles',
        "cadenasDisponibles": [{
            _id: 12,
            nombre: 'COTO',
        }, {
            _id: 15,
            nombre: 'DIA',
        },
        {
            _id: 10,
            nombre: 'CARREFOUR',
        }
        ]
    }
    
	// Busca el documento 'medioDePagoTarjetasNombres'
    BaseLocal.get('cadenasDisponibles').then(function(doc){
      // si lo encuentra lo borra
      BaseLocal.remove(doc._id, doc._rev).then(function(){
        // si lo borra bien lo vuelve a crear
        BaseLocal.put(cadenasDisponibles);
      });
    }).catch(function (error) {
        // Si no lo encuentra, lo crea
        BaseLocal.put(cadenasDisponibles);
    });
}

function agregarTarjetas(BaseLocal){
	
	BaseLocal.get('tarjetas').then(function(doc){
	      // si lo encuentra lo borra
	      BaseLocal.remove(doc._id, doc._rev).then(function(){
	        // si lo borra bien lo vuelve a crear
	        BaseLocal.put({
	        	 _id: 'tarjetas',
	        	 "tarjetas":[
{
"_id":1,
"nombre":"Mastercard - Débito",
"bancos":[
{
"_id":2,
"nombre":"HIPOTECARIO"
},
{
"_id":3,
"nombre":"ITAU"
},
{
"_id":4,
"nombre":"MACRO"
},
{
"_id":5,
"nombre":"BNA"
},
{
"_id":6,
"nombre":"BAPRO"
},
{
"_id":7,
"nombre":"BPN"
},
{
"_id":8,
"nombre":"SANTANDER RIO"
},
{
"_id":9,
"nombre":"SUPERVIELLE"
},
{
"_id":10,
"nombre":"CITIBANK"
},
{
"_id":11,
"nombre":"DB"
},
{
"_id":12,
"nombre":"HSBC"
},
{
"_id":13,
"nombre":"ICBC"
},
{
"_id":14,
"nombre":"Tarjeta Naranja"
},
{
"_id":15,
"nombre":"Banco Ciudad"
},
{
"_id":16,
"nombre":"Banco Columbia"
},
{
"_id":17,
"nombre":"Banco Comafi"
},
{
"_id":18,
"nombre":"Banco Credicoop"
},
{
"_id":19,
"nombre":"Banco de Valores"
},
{
"_id":20,
"nombre":"Banco Galicia"
},
{
"_id":21,
"nombre":"Banco Meridian"
},
{
"_id":22,
"nombre":"Banco Patagonia"
},
{
"_id":23,
"nombre":"BBVA"
}
]
},
{
"_id":2,
"nombre":"Mastercard - Crédito",
"bancos":[
{
"_id":2,
"nombre":"HIPOTECARIO"
},
{
"_id":3,
"nombre":"ITAU"
},
{
"_id":4,
"nombre":"MACRO"
},
{
"_id":5,
"nombre":"BNA"
},
{
"_id":6,
"nombre":"BAPRO"
},
{
"_id":7,
"nombre":"BPN"
},
{
"_id":8,
"nombre":"SANTANDER RIO"
},
{
"_id":9,
"nombre":"SUPERVIELLE"
},
{
"_id":10,
"nombre":"CITIBANK"
},
{
"_id":11,
"nombre":"DB"
},
{
"_id":12,
"nombre":"HSBC"
},
{
"_id":13,
"nombre":"ICBC"
},
{
"_id":14,
"nombre":"Tarjeta Naranja"
},
{
"_id":15,
"nombre":"Banco Ciudad"
},
{
"_id":16,
"nombre":"Banco Columbia"
},
{
"_id":17,
"nombre":"Banco Comafi"
},
{
"_id":18,
"nombre":"Banco Credicoop"
},
{
"_id":19,
"nombre":"Banco de Valores"
},
{
"_id":20,
"nombre":"Banco Galicia"
},
{
"_id":21,
"nombre":"Banco Meridian"
},
{
"_id":22,
"nombre":"Banco Patagonia"
},
{
"_id":23,
"nombre":"BBVA"
}
]
},
{
"_id":3,
"nombre":"Tarjeta Naranja - Débito",
"bancos":[
{
"_id":14,
"nombre":"Tarjeta Naranja"
},
{
"_id":20,
"nombre":"Banco Galicia"
}
]
},
{
"_id":4,
"nombre":"Tarjeta Naranja - Crédito",
"bancos":[
{
"_id":14,
"nombre":"Tarjeta Naranja"
},
{
"_id":20,
"nombre":"Banco Galicia"
}
]
},
{
"_id":5,
"nombre":"Visa - Débito",
"bancos":[
{
"_id":1,
"nombre":"AMERICAN EXPRESS"
},
{
"_id":2,
"nombre":"HIPOTECARIO"
},
{
"_id":3,
"nombre":"ITAU"
},
{
"_id":4,
"nombre":"MACRO"
},
{
"_id":5,
"nombre":"BNA"
},
{
"_id":6,
"nombre":"BAPRO"
},
{
"_id":7,
"nombre":"BPN"
},
{
"_id":8,
"nombre":"SANTANDER RIO"
},
{
"_id":9,
"nombre":"SUPERVIELLE"
},
{
"_id":10,
"nombre":"CITIBANK"
},
{
"_id":11,
"nombre":"DB"
},
{
"_id":12,
"nombre":"HSBC"
},
{
"_id":13,
"nombre":"ICBC"
},
{
"_id":14,
"nombre":"Tarjeta Naranja"
},
{
"_id":15,
"nombre":"Banco Ciudad"
},
{
"_id":16,
"nombre":"Banco Columbia"
},
{
"_id":17,
"nombre":"Banco Comafi"
},
{
"_id":18,
"nombre":"Banco Credicoop"
},
{
"_id":19,
"nombre":"Banco de Valores"
},
{
"_id":20,
"nombre":"Banco Galicia"
},
{
"_id":21,
"nombre":"Banco Meridian"
},
{
"_id":22,
"nombre":"Banco Patagonia"
},
{
"_id":23,
"nombre":"BBVA"
}
]
},
{
"_id":6,
"nombre":"Visa - Crédito",
"bancos":[
{
"_id":1,
"nombre":"AMERICAN EXPRESS"
},
{
"_id":2,
"nombre":"HIPOTECARIO"
},
{
"_id":3,
"nombre":"ITAU"
},
{
"_id":4,
"nombre":"MACRO"
},
{
"_id":5,
"nombre":"BNA"
},
{
"_id":6,
"nombre":"BAPRO"
},
{
"_id":7,
"nombre":"BPN"
},
{
"_id":8,
"nombre":"SANTANDER RIO"
},
{
"_id":9,
"nombre":"SUPERVIELLE"
},
{
"_id":10,
"nombre":"CITIBANK"
},
{
"_id":11,
"nombre":"DB"
},
{
"_id":12,
"nombre":"HSBC"
},
{
"_id":13,
"nombre":"ICBC"
},
{
"_id":14,
"nombre":"Tarjeta Naranja"
},
{
"_id":15,
"nombre":"Banco Ciudad"
},
{
"_id":16,
"nombre":"Banco Columbia"
},
{
"_id":17,
"nombre":"Banco Comafi"
},
{
"_id":18,
"nombre":"Banco Credicoop"
},
{
"_id":19,
"nombre":"Banco de Valores"
},
{
"_id":20,
"nombre":"Banco Galicia"
},
{
"_id":21,
"nombre":"Banco Meridian"
},
{
"_id":22,
"nombre":"Banco Patagonia"
},
{
"_id":23,
"nombre":"BBVA"
}
]
},
{
"_id":7,
"nombre":"Amex - Débito",
"bancos":[
{
"_id":1,
"nombre":"AMERICAN EXPRESS"
},
{
"_id":4,
"nombre":"MACRO"
},
{
"_id":8,
"nombre":"SANTANDER RIO"
},
{
"_id":12,
"nombre":"HSBC"
},
{
"_id":14,
"nombre":"Tarjeta Naranja"
},
{
"_id":20,
"nombre":"Banco Galicia"
},
{
"_id":22,
"nombre":"Banco Patagonia"
}
]
},
{
"_id":8,
"nombre":"Amex - Crédito",
"bancos":[
{
"_id":1,
"nombre":"AMERICAN EXPRESS"
},
{
"_id":4,
"nombre":"MACRO"
},
{
"_id":8,
"nombre":"SANTANDER RIO"
},
{
"_id":12,
"nombre":"HSBC"
},
{
"_id":14,
"nombre":"Tarjeta Naranja"
},
{
"_id":20,
"nombre":"Banco Galicia"
},
{
"_id":22,
"nombre":"Banco Patagonia"
}
]
},
{
"_id":9,
"nombre":"Cabal - Débito",
"bancos":[
{
"_id":18,
"nombre":"Banco Credicoop"
}
]
},
{
"_id":10,
"nombre":"Cabal - Crédito",
"bancos":[
{
"_id":18,
"nombre":"Banco Credicoop"
}
]
}
]
	        });
	      });
	    }).catch(function (error) {
	           // Si no lo encuentra, lo crea
	           BaseLocal.put({
	                _id: 'tarjetas',
	                "tarjetas":[
{
"_id":1,
"nombre":"Mastercard - Débito",
"bancos":[
{
"_id":2,
"nombre":"HIPOTECARIO"
},
{
"_id":3,
"nombre":"ITAU"
},
{
"_id":4,
"nombre":"MACRO"
},
{
"_id":5,
"nombre":"BNA"
},
{
"_id":6,
"nombre":"BAPRO"
},
{
"_id":7,
"nombre":"BPN"
},
{
"_id":8,
"nombre":"SANTANDER RIO"
},
{
"_id":9,
"nombre":"SUPERVIELLE"
},
{
"_id":10,
"nombre":"CITIBANK"
},
{
"_id":11,
"nombre":"DB"
},
{
"_id":12,
"nombre":"HSBC"
},
{
"_id":13,
"nombre":"ICBC"
},
{
"_id":14,
"nombre":"Tarjeta Naranja"
},
{
"_id":15,
"nombre":"Banco Ciudad"
},
{
"_id":16,
"nombre":"Banco Columbia"
},
{
"_id":17,
"nombre":"Banco Comafi"
},
{
"_id":18,
"nombre":"Banco Credicoop"
},
{
"_id":19,
"nombre":"Banco de Valores"
},
{
"_id":20,
"nombre":"Banco Galicia"
},
{
"_id":21,
"nombre":"Banco Meridian"
},
{
"_id":22,
"nombre":"Banco Patagonia"
},
{
"_id":23,
"nombre":"BBVA"
}
]
},
{
"_id":2,
"nombre":"Mastercard - Crédito",
"bancos":[
{
"_id":2,
"nombre":"HIPOTECARIO"
},
{
"_id":3,
"nombre":"ITAU"
},
{
"_id":4,
"nombre":"MACRO"
},
{
"_id":5,
"nombre":"BNA"
},
{
"_id":6,
"nombre":"BAPRO"
},
{
"_id":7,
"nombre":"BPN"
},
{
"_id":8,
"nombre":"SANTANDER RIO"
},
{
"_id":9,
"nombre":"SUPERVIELLE"
},
{
"_id":10,
"nombre":"CITIBANK"
},
{
"_id":11,
"nombre":"DB"
},
{
"_id":12,
"nombre":"HSBC"
},
{
"_id":13,
"nombre":"ICBC"
},
{
"_id":14,
"nombre":"Tarjeta Naranja"
},
{
"_id":15,
"nombre":"Banco Ciudad"
},
{
"_id":16,
"nombre":"Banco Columbia"
},
{
"_id":17,
"nombre":"Banco Comafi"
},
{
"_id":18,
"nombre":"Banco Credicoop"
},
{
"_id":19,
"nombre":"Banco de Valores"
},
{
"_id":20,
"nombre":"Banco Galicia"
},
{
"_id":21,
"nombre":"Banco Meridian"
},
{
"_id":22,
"nombre":"Banco Patagonia"
},
{
"_id":23,
"nombre":"BBVA"
}
]
},
{
"_id":3,
"nombre":"Tarjeta Naranja - Débito",
"bancos":[
{
"_id":14,
"nombre":"Tarjeta Naranja"
},
{
"_id":20,
"nombre":"Banco Galicia"
}
]
},
{
"_id":4,
"nombre":"Tarjeta Naranja - Crédito",
"bancos":[
{
"_id":14,
"nombre":"Tarjeta Naranja"
},
{
"_id":20,
"nombre":"Banco Galicia"
}
]
},
{
"_id":5,
"nombre":"Visa - Débito",
"bancos":[
{
"_id":1,
"nombre":"AMERICAN EXPRESS"
},
{
"_id":2,
"nombre":"HIPOTECARIO"
},
{
"_id":3,
"nombre":"ITAU"
},
{
"_id":4,
"nombre":"MACRO"
},
{
"_id":5,
"nombre":"BNA"
},
{
"_id":6,
"nombre":"BAPRO"
},
{
"_id":7,
"nombre":"BPN"
},
{
"_id":8,
"nombre":"SANTANDER RIO"
},
{
"_id":9,
"nombre":"SUPERVIELLE"
},
{
"_id":10,
"nombre":"CITIBANK"
},
{
"_id":11,
"nombre":"DB"
},
{
"_id":12,
"nombre":"HSBC"
},
{
"_id":13,
"nombre":"ICBC"
},
{
"_id":14,
"nombre":"Tarjeta Naranja"
},
{
"_id":15,
"nombre":"Banco Ciudad"
},
{
"_id":16,
"nombre":"Banco Columbia"
},
{
"_id":17,
"nombre":"Banco Comafi"
},
{
"_id":18,
"nombre":"Banco Credicoop"
},
{
"_id":19,
"nombre":"Banco de Valores"
},
{
"_id":20,
"nombre":"Banco Galicia"
},
{
"_id":21,
"nombre":"Banco Meridian"
},
{
"_id":22,
"nombre":"Banco Patagonia"
},
{
"_id":23,
"nombre":"BBVA"
}
]
},
{
"_id":6,
"nombre":"Visa - Crédito",
"bancos":[
{
"_id":1,
"nombre":"AMERICAN EXPRESS"
},
{
"_id":2,
"nombre":"HIPOTECARIO"
},
{
"_id":3,
"nombre":"ITAU"
},
{
"_id":4,
"nombre":"MACRO"
},
{
"_id":5,
"nombre":"BNA"
},
{
"_id":6,
"nombre":"BAPRO"
},
{
"_id":7,
"nombre":"BPN"
},
{
"_id":8,
"nombre":"SANTANDER RIO"
},
{
"_id":9,
"nombre":"SUPERVIELLE"
},
{
"_id":10,
"nombre":"CITIBANK"
},
{
"_id":11,
"nombre":"DB"
},
{
"_id":12,
"nombre":"HSBC"
},
{
"_id":13,
"nombre":"ICBC"
},
{
"_id":14,
"nombre":"Tarjeta Naranja"
},
{
"_id":15,
"nombre":"Banco Ciudad"
},
{
"_id":16,
"nombre":"Banco Columbia"
},
{
"_id":17,
"nombre":"Banco Comafi"
},
{
"_id":18,
"nombre":"Banco Credicoop"
},
{
"_id":19,
"nombre":"Banco de Valores"
},
{
"_id":20,
"nombre":"Banco Galicia"
},
{
"_id":21,
"nombre":"Banco Meridian"
},
{
"_id":22,
"nombre":"Banco Patagonia"
},
{
"_id":23,
"nombre":"BBVA"
}
]
},
{
"_id":7,
"nombre":"Amex - Débito",
"bancos":[
{
"_id":1,
"nombre":"AMERICAN EXPRESS"
},
{
"_id":4,
"nombre":"MACRO"
},
{
"_id":8,
"nombre":"SANTANDER RIO"
},
{
"_id":12,
"nombre":"HSBC"
},
{
"_id":14,
"nombre":"Tarjeta Naranja"
},
{
"_id":20,
"nombre":"Banco Galicia"
},
{
"_id":22,
"nombre":"Banco Patagonia"
}
]
},
{
"_id":8,
"nombre":"Amex - Crédito",
"bancos":[
{
"_id":1,
"nombre":"AMERICAN EXPRESS"
},
{
"_id":4,
"nombre":"MACRO"
},
{
"_id":8,
"nombre":"SANTANDER RIO"
},
{
"_id":12,
"nombre":"HSBC"
},
{
"_id":14,
"nombre":"Tarjeta Naranja"
},
{
"_id":20,
"nombre":"Banco Galicia"
},
{
"_id":22,
"nombre":"Banco Patagonia"
}
]
},
{
"_id":9,
"nombre":"Cabal - Débito",
"bancos":[
{
"_id":18,
"nombre":"Banco Credicoop"
}
]
},
{
"_id":10,
"nombre":"Cabal - Crédito",
"bancos":[
{
"_id":18,
"nombre":"Banco Credicoop"
}
]
},
{
"_id":99,
"nombre":"Efectivo",
"bancos":[
{
"_id":99,
"nombre":"No aplica"
}
]
}
]});
	         });
}