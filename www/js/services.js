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

