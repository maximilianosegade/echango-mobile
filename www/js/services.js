angular.module('app.services', [])
.service("ServiciosBD", function($rootScope, $q, BaseLocal) {
   var database = BaseLocal;
   
  this.getUbicaciones = function() {
        return database.get('ubicaciones').then(function(doc){
           return doc.ubicaciones;
         });
    }
    this.agregarUbicacion = function(ubicacion) {
        return database.get('ubicaciones').then(function(doc){
            doc.ubicaciones.push(ubicacion);
            database.put(doc,doc._id,doc._rev);
            return doc;
         });
    }
})
.factory('BaseLocal', function() {
  var pouchdb = new PouchDB('baseLocal');
  /*pouchdb.put({
      _id: 'ubicaciones',
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
  return pouchdb;
})
.factory('BaseNovedades', function() {
  return new PouchDB('baseNovedades');
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

