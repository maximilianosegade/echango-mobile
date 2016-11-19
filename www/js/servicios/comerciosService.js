angular.module('app.services.comercios', [])
.service("ComerciosService", function($rootScope, $q, $http, BaseLocal, BaseComercios) {
    
    const URL_COMERCIOS_CERCANOS = 
          'http://ec2-35-162-193-58.us-west-2.compute.amazonaws.com:3000/comercios/cercanos';
        
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

		return new Promise(function(resolve, reject){

            if (!posiciones)
                reject(new Error('[Comercios cercanos] - No se indicaron posiciones.'));

            var url = URL_COMERCIOS_CERCANOS + '?';

            for (var i=0; i<posiciones.length; i++){
                // Fix para el caso en que no se definen lat y long.
                if (posiciones[i].lat && posiciones[i].long){
                    url += 
                        ('lat' + i + '=' + posiciones[i].lat + '&' +
                        'long' + i + '=' + posiciones[i].long + '&');            
                }
            }
                
            if (radio)
                url += 'radio=' + radio;
        
            console.debug('[Comercios cercanos - query]: ' + url);
        
            $http.get(url).success(function (data) {
                resolve(data);
            }).error(function (data, status) {
                reject(new Error(
                    '[Comercios cercanos]: Error consultando backend.',
                    status, data));
            });

        });

    }    
    
    this.comerciosCercanosPorUbicacion = function(posiciones, radio){
    	return comerciosCercanosPuntosGeograficos(posiciones,radio);
    }
    
    this.comerciosCercanosPosicionActual = function(){                
        return new Promise(function(resolve, reject){
            
            console.log('[ID Comercios - Ubicacion actual].');
            
            navigator.geolocation.getCurrentPosition(function (pos) {

                comerciosCercanosPuntosGeograficos([{
                    lat: pos.coords.latitude,
                    long: pos.coords.longitude
                }]).then(function(resp){
                    resolve(resp);
                }).catch(function(err){
                    console.error('[ID Comercios - Ubicacion actual]: ', err);
                    resolve([]);
                });
                
            }, function (err) {
                console.error('[ID Comercios - Ubicacion actual] - Error Sincro: ', err);    
                resolve([]);
            });
            
        });
                                  
    }
    
    this.comerciosCercanosUbicacionesSeleccionadas = function(){
        return new Promise(function(resolve, reject){
        
            console.log('[ID Comercios - Ubicaciones seleccionadas].');
            
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
                console.error('[ID Comercios - Ubicaciones seleccionadas- Error Sincro]: ', err)
                resolve([]);
            });
            
        });
        
    } 
    
    this.comerciosSeleccionados = function(){        
        return new Promise(function(resolve, reject){
        
            console.log('[ID Comercios - Preferidos].')
            
            baseLocal.get('ubicaciones').then(function(resp){
                var idComercios = [];
                
                if (resp.comercios){   
                    for (var i=0; i<resp.comercios.length; i++){
                        if (resp.comercios[i]._id){
                            idComercios.push(resp.comercios[i]._id);
                        }
                    }
                }

                resolve(idComercios);

            }).catch(function(err){
                console.error('[ID Comercios - Preferidos- Error Sincro]: ', err);
                resolve([]);
            });
            
        });
        
        return promise;
        
    } 
        
	
	this.provincias = function(){
		return BaseComercios.get('provincias').then(function(doc){
			return doc.provincias;
		});
	}
	
	this.comerciosFiltrados = function(filtroProvincia, filtroLocalidad, filtroCadena){
        return BaseComercios.query(function(doc,emit){
            var cumpleCriterio = true;

            cumpleCriterio = !(doc._id == 'provincias')

            if (cumpleCriterio && filtroProvincia){
                cumpleCriterio = ( filtroProvincia.toLowerCase() == doc.zona.toLowerCase() );
            }

            if (cumpleCriterio && filtroLocalidad){
                cumpleCriterio = ( filtroLocalidad.toLowerCase() == doc.nombre.toLowerCase() );
            }

            if (cumpleCriterio && filtroCadena){
                cumpleCriterio = ( filtroCadena.toString().toLowerCase() == doc.id_cadena.toLowerCase() );
            }

            if (cumpleCriterio)
                emit(doc);
        }).then(function(res){
            return res.rows;
        }).catch(function(err){
            return null;
        });

	}
	
	
	
	
	this.detalleComercio = function(comerciosaActualizar){
		return BaseComercios.get(comerciosaActualizar).then(function(doc){
			return doc;
		});
/*return BaseComercios.query(function(doc,emit){
            
			var enLaLista = false;
			
			for(var i = 0; comerciosaActualizar.length > i; i++){
				if (comerciosaActualizar[i].comercioId == doc._id ){
					enLaLista = true;
					i = 9999;
				}
			}
			
			if(enLaLista){
				emit(doc);
			}
				
                
        }).then(function(res){
        	
            return res.rows;
        })*/
	}
	
});