angular.module('app.services.comercios', [])
.service("ComerciosService", function($rootScope, $q, $http, BaseLocal, BaseComercios) {
    
    const URL_COMERCIOS_CERCANOS = 
          'http://marte.certant.com/msegade/echango/comercios_cercanos.js'
        
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
    Obtiene los comercios en una zona geografica determinada por un
    punto central y un radio.
    Recibe un array de posiciones, del estilo: 
        {
            lat: -34.454645,
            long: -58.54564654
        }
    El parametro 'radio' (opcional), indica delimita el radio de dicha
    zona en KM. Si no se especifica se toma el valor default en el servidor.
    */
    var comerciosCercanosPuntosGeograficos = function(posiciones, radio){
		
        var url = URL_COMERCIOS_CERCANOS + '?';
        
        for (var i=0; i<posiciones.length; i++){
            url += 
                ('lat' + i + '=' + posiciones[i].lat + '&' +
                'long' + i + '=' + posiciones[i].long + '&');            
        }
                
        if (radio)
            url += 'radio=' + radio;
        
        console.debug('[Comercios cercanos - query]: ' + url);
        
        // TODO: Invocar servicio REST
        //comerciosQuery = $http.jsonp(url);
        comerciosQuery = new Promise(function(resolve, reject){
           resolve(['12-1-186','12-1-91']);
        });
        
        return comerciosQuery;    
    }    
    
    this.comerciosCercanosPosicionActual = function(){        
        console.log('[ID Comercios - Ubicacion actual].');
        
        var promise = new Promise(function(resolve, reject){
            
            navigator.geolocation.getCurrentPosition(function (pos) {

                var queryComerciosCercanos = 
                    comerciosCercanosPuntosGeograficos([{
                        lat: pos.coords.latitude,
                        long: pos.coords.longitude
                    }]);
                
                queryComerciosCercanos.then(function(idComercios){
                    resolve(idComercios);
                }).catch(function(err){
                    console.error('[ID Comercios - Ubicacion actual]: ' + err);    
                    resolve([]);
                });

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
                
                if (resp.ubicaciones){ 
                    for (var i=0; i<resp.ubicaciones.length; i++){
                        puntosGeograficos.push({
                            lat: resp.ubicaciones[i].latitud,
                            long: resp.ubicaciones[i].longitud                    
                        });
                    }
                }

                return comerciosCercanosPuntosGeograficos(puntosGeograficos);
                
            }).then(function(idComercios){
                resolve(idComercios);
            }).catch(function(err){
                console.error('[ID Comercios - Ubicaciones seleccionadas]: ' + err)
                resolve([]);
            });
            
        });
        
        return promise;
        
    } 
    
    this.comerciosSeleccionados = function(){        
        console.log('[ID Comercios - Preferidos].')
        
        var promise = new Promise(function(resolve, reject){
            
            baseLocal.get('ubicaciones').then(function(resp){
                var idComercios = [];
                
                if (resp.comercios){   
                    for (var i=0; i<resp.comercios.length; i++){
                        idComercios.push(resp.comercios[i]._id);
                    }
                }

                resolve(idComercios);
            }).catch(function(err){
                console.error('[ID Comercios - Preferidos]: ' + err);
                resolve([]);
            });
            
        });
        
        return promise;
        
    } 
        
});