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
.factory('DBSync', function(BaseProductos, BasePreciosPorComercio) {

  var dbSync = {};

  dbSync.baseProductosLocal = BaseProductos;
  dbSync.basePreciosPorComercio = BasePreciosPorComercio;

  dbSync.sync = function(){
    console.log("Iniciando sincro de BD...");
    this.syncProductos();
    this.syncPreciosPorComercio();
    console.log("Finalizo sincro de BD.");
  }

  dbSync.syncProductos = function(){
    console.log("Replicar DB productos...");
    this.baseProductosLocal.replicate.from('http://ec2-52-38-235-81.us-west-2.compute.amazonaws.com/productos', {
      live: true,
      retry: true
    });
  }

  dbSync.syncPreciosPorComercio = function(){
    console.log("Replicar DB precios para comercios favoritos...");
    this.basePreciosPorComercio.replicate.from('http://ec2-52-38-235-81.us-west-2.compute.amazonaws.com/comercios_precios_consulta', {
      live: true,
      retry: true,
      // Esto esta hardcodeado, es solo para verificar el filtro.
      // Deberia actualizarse cada vez que se modifican los comercios favoritos.
      doc_ids: ['93c2845f4015d10fe1a570a98f015f81']
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
