angular.module('app.services.comercios', [])
.service("ComerciosService", function($rootScope, $q, $http, BaseLocal, BaseComercios) {
    
    const URL_COMERCIOS_CERCANOS = 
          'http://marte.certant.com/msegade/echango/comercios_cercanos.js'
    const RADIO_DEFAULT = 0.1;
    
    var baseLocal = BaseLocal;
	
	function mapNombreCadena(doc) {
        emit(doc.cadena);    
    }
    
	this.comerciosPorCadena = function(cadena){
		
        return BaseComercios.allDocs({
            startkey: cadena._id.toString(),
            endkey: cadena._id.toString() + '\uffff',
            include_docs : true
        }).then(function (res) {
            return res.rows;
        }).catch(function (err) {
            return null;
        });
            
    }
    
    /*
    Obtiene los comercios en una zona geografica determinada.
    Se toma como centro el punto geografico definido por ('lat', 'long').
    El parametro 'radio' (opcional), indica delimita el radio de dicha
    zona en KM. Si no se especifica se toma el valor default RADIO_DEFAULT.
    */
    var comerciosCercanosAUnPuntoGeografico = function(lat, long, radio){
		
        var url = URL_COMERCIOS_CERCANOS +  
            '?lat=' + lat +
            '&long=' + long;
        
        if (radio)
            url += '&radio=' + radio;
        
        console.debug('[Comercios cercanos ('+lat+', '+long+') - query]: ' + url);
        
        // TODO: Invocar servicio REST
        //comerciosQuery = $http.jsonp(url);
        comerciosQuery = new Promise(function(resolve, reject){
           resolve({data: ['12-1-186']}) 
        });
        
        return comerciosQuery;    
    }
    
    /*
    Obtiene los comercios en zonas geograficas determinadas por el array
    'puntos', que contiene objetos del tipo: {lat:-34.546454, long:-58.65465465}.
    El parametro 'radio' (opcional), indica delimita el radio de dicha
    zona en KM. Si no se especifica se toma el valor default RADIO_DEFAULT.
    */
    var comerciosCercanosASerieDePuntosGeograficos = function(puntos, radio){		
        
        var puntosConsultados = 0;
        var comerciosCercanos = [];

        return new Promise(function(resolve, reject){
            
            for(var i=0; i<puntos.length; i++){

                (function(){
                    var punto = puntos[i];
                    var lat = punto.lat;
                    var long = punto.long;

                    var query = comerciosCercanosAUnPuntoGeografico(lat, long, radio);

                    query.then(function(response){                            
                        console.debug('[Comercios cercanos ('+lat+', '+long+') - response]: ' + 
                            JSON.stringify(response.data));

                        for (var j=0; j<response.data.length; j++)
                            comerciosCercanos.push(response.data[j]);

                        puntosConsultados++;
                        if (puntosConsultados == puntos.length)
                            resolve(comerciosCercanos);
                    }).catch(function(err){
                        console.error('[Comercios cercanos]: ' + JSON.stringify(err));
                        reject(err);
                    });

                })();

            }
        
        });

    }
    
    this.comerciosCercanosPosicionActual = function(){        
        console.log('[ID Comercios - Ubicacion actual].');
        
        var promise = new Promise(function(resolve, reject){
            
            navigator.geolocation.getCurrentPosition(function (pos) {

                resolve(comerciosCercanosASerieDePuntosGeograficos([{
                    lat: pos.coords.latitude,
                    long: pos.coords.longitude
                }]));

            }, function (error) {
                console.error('[ID Comercios - Ubicacion actual]: ' + error.message);    
                resolve([]);
            });
            
        });
                                  
        return promise;        
    }
    
    this.comerciosCercanosUbicacionesSeleccionadas = function(){
        console.log('[ID Comercios - Ubicaciones seleccionadas].');
        
        var promise = new Promise(function(resolve, reject){
            
            baseLocal.get('ubicaciones').then(function(resp){
                var puntosGeograficos = [];

                for (var i=0; i<resp.ubicaciones.length; i++){
                    puntosGeograficos.push({
                        lat: resp.ubicaciones[i].latitud,
                        long: resp.ubicaciones[i].longitud                    
                    });
                }

                // TODO: Definir radio.
                resolve(comerciosCercanosASerieDePuntosGeograficos(puntosGeograficos));
            }).catch(function(err){
                console.error('[ID Comercios - Ubicaciones seleccionadas]: ' + err)
                resolve([]);
            })
            
        });
        
        return promise;
        
    } 
    
    this.comerciosSeleccionados = function(){        
        console.log('[ID Comercios - Preferidos].')
        
        var promise = new Promise(function(resolve, reject){
            
            baseLocal.get('ubicaciones').then(function(resp){
                var idComercios = [];
                
                for (var i=0; i<resp.comercios.length; i++){
                    idComercios.push(resp.comercios[i]._id);
                }

                // TODO: Definir radio.
                resolve(idComercios);
            }).catch(function(err){
                console.error('[ID Comercios - Preferidos]: ' + err)
                resolve([]);
            });
            
        });
        
        return promise;
        
    } 
        
});