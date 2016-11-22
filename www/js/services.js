angular.module('app.services', [])

.factory('BaseLocal', function() {
  var pouchdb = new PouchDB('baseLocal');

  return pouchdb;
})
.factory('BaseNovedades', function() {
  return new PouchDB('baseNovedades');
})
.factory('BaseComercios', function() {
  return new PouchDB('baseComercios');
})
.factory('BaseListas', function() {
  return new PouchDB('baseListas');
})
.factory('BaseProductos', function() {
  return productosLocal = new PouchDB('baseProductos');
})
.factory('BaseCompras', function() {
  return new PouchDB('baseCompras');
})
.factory('BaseSimulaciones', function() {
  return new PouchDB('baseSimulaciones');
})
.factory('BasePreciosPorComercio', function() {
  return preciosPorComercioLocal = new PouchDB('basePreciosPorComercio');
})
.factory('BaseRelevamiento', function() {
  return new PouchDB('baseRelevamiento');
})
.factory('DBSync', function(BaseProductos, BaseComercios, BasePreciosPorComercio, ComerciosService) {


  var dbSync = {};

  dbSync.baseProductosLocal = BaseProductos;
  dbSync.baseComerciosLocal = BaseComercios;
  dbSync.basePreciosPorComercio = BasePreciosPorComercio;
  dbSync.comerciosService = ComerciosService;
    
  dbSync.init = function(){
    this.compactDb();
    this.syncProductos();
    this.syncComercios();
  }

  dbSync.compactDb = function(){
    
    console.log('[Compactar BD] - Productos.');
    this.baseProductosLocal.compact().then(function(){
      console.log('[Compactar BD] - Fin Productos.');
    });
      
    console.log('[Compactar BD] - Comercios.');
    this.baseComerciosLocal.compact().then(function(){
      console.log('[Compactar BD] - Fin Comercios.');
    });
      
    console.log('[Compactar BD] - Precios por comercio.');
    this.basePreciosPorComercio.compact().then(function(){
      console.log('[Compactar BD] - Fin Precios por comercio.');
    });
      
  }
  
  dbSync.syncProductos = function(){
    console.log("[DB Sync] Sincronizando DB productos...");
    this.baseProductosLocal.replicate.from('https://webi.certant.com/echango/productos', {
      live: true,
      retry: true
    });
  }
  
  dbSync.syncComercios = function(){
    console.log("[DB Sync] Sincronizando DB comercios...");
    this.baseComerciosLocal.replicate.from('https://webi.certant.com/echango/comercios', {
      live: true,
      retry: true
    });
  }

  dbSync.syncPreciosPorComercio = function(){
    console.log('[DB Sync] Sincronizando DB precios por comercio...');
    var idComercios = [];
      
    dbSync.comerciosService.comerciosCercanosPosicionActual().then(function(resp){
        
        var i;
        for (i=0; i<resp.length; i++){
          console.debug('[DB Sync] IDs comercios pos actual: ', resp[i].comerciosCercanos);
          idComercios = idComercios.concat(resp[i].comerciosCercanos);
        }
        return dbSync.comerciosService.comerciosCercanosUbicacionesSeleccionadas();
    
    }).then(function(resp){
        
        var i;
        for (i=0; i<resp.length; i++){
          console.debug('[DB Sync] IDs comercios cercanos a ubicaciones seleccionadas: ', resp[i].comerciosCercanos);
          idComercios = idComercios.concat(resp[i].comerciosCercanos);
        }
        return dbSync.comerciosService.comerciosSeleccionados();
        
    }).then(function(resp){
        
        var i;
        for (i=0; i<resp.length; i++){
          console.debug('[DB Sync] IDs comercios seleccionados: ', resp);
          idComercios = idComercios.concat(resp);
        }
        return Promise.resolve();
    
    }).catch(function(err){

        console.error('[DB Sync] Error obteniendo comercios cercanos: ', err);
        return Promise.resolve();

    }).then(function(){
        
      if (idComercios.length){

          idComercios = _.uniq(idComercios);
          
          if (dbSync.basePreciosPorComercioSyncHandler){
              console.log("Cancelando replica DB precios para comercios cercanos existente...");
              dbSync.basePreciosPorComercioSyncHandler.cancel();
          }

          console.log("Replicar DB precios para comercios: ", idComercios);

          dbSync.basePreciosPorComercioSyncHandler =  dbSync.basePreciosPorComercio.replicate.from('https://webi.certant.com/echango/precios_por_comercio', {
              live: true,
              retry: true,
              doc_ids: idComercios
          });
          
      }

    });
    
  }

  return dbSync;

})
.factory('Ubicaciones', function(BaseLocal, $q) {

   var ubicaciones = [{
    id: 0,
    name: 'Coto Castrobarros',
    direccion: 'Castrobarros 66, caba, Argentina',
    coordenadas: new google.maps.LatLng('-34.612020', '-58.420792')
  }, {
    id: 1,
    name: 'Disco Castrobarros',
    direccion: 'Castrobarros 166, caba, Argentina',
    coordenadas: new google.maps.LatLng('-34.613968', '-58.420387')
  }];
  
 return ubicaciones;

})

.service('BlankService', [function(){

}]);
