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
.factory('BasePreciosPorComercio', function() {
  return preciosPorComercioLocal = new PouchDB('basePreciosPorComercio');
})
.factory('DBSync', function(BaseProductos, BaseComercios, BasePreciosPorComercio) {

  var dbSync = {};

  dbSync.baseProductosLocal = BaseProductos;
  dbSync.baseComerciosLocal = BaseComercios;
  dbSync.basePreciosPorComercio = BasePreciosPorComercio;

  dbSync.init = function(){
    //this.compactDb();
    console.log("[DB Sync] Iniciando sincronizacion...");
    this.syncProductos();
    this.syncComercios();
  }

  // TODO: Compactar DB al iniciar la APP
  dbSync.compactDb = function(){
    
    console.log('Iniciando compactacion de BD.');
      
    console.log('Compactando BD Productos... ');
    this.baseProductosLocal.compact().then(function(){
      console.log('Compactando BD Comercios... ');
      return this.baseComerciosLocal.compact();
    }).then(function(){
      console.log('Compactando BD Precios por Comercios... ');
      return this.basePreciosPorComercio.compact();
    }).then(function(){
      console.log('Finalizo la compactacion.');
    }).catch(function(err){
        console.log('Fallo la compactacion de la BD. ' + err);
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

  dbSync.syncPreciosPorComercio = function(idComercios){
      
    if (this.basePreciosPorComercioSyncHandler){
        console.log("Cancelando replica DB precios para comercios cercanos existente...");
        this.basePreciosPorComercioSyncHandler.cancel();
    }
      
    console.log("Replicar DB precios para comercios cercanos: " + JSON.stringify(idComercios));
        
    dbSync.basePreciosPorComercioSyncHandler =  this.basePreciosPorComercio.replicate.from('https://webi.certant.com/echango/precios_por_comercio', {
          live: true,
          retry: true,
          doc_ids: idComercios
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
  /*
 pouchdb.put({
      _id: 'ubicacion2',
      name: 'Coto Castrobarros',
    direccion: 'Castrobarros 66, caba, Argentina',
    latitud: '-34.613968',
    longitud:  '-58.420387'
    });
    pouchdb.put({
      _id: 'ubicacion2',
     name: 'Disco Castrobarros',
    direccion: 'Castrobarros 166, caba, Argentina',
    coordenadas: new google.maps.LatLng('-34.613968', '-58.420387')
    });
    pouchdb.put({
      _id: 'ubicacionesFin',
     "ubicaciones": [{
    id: 0,
    name: 'Coto Castrobarros',
    direccion: 'Castrobarros 66, caba, Argentina',
    latitud: '-34.612020',
    longitud:  '-58.420792'
  }, {
    id: 1,
    name: 'Disco Castrobarros',
    direccion: 'Castrobarros 166, caba, Argentina',
    latitud: '-34.613968',
    longitud:  '-58.420387'
  }]});*/

 return ubicaciones;

})

.service('BlankService', [function(){

}]);
