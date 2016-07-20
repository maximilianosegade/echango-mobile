angular.module('app.services.ubicaciones', [])
.service("UbicacionesService", function($rootScope, $q, BaseLocal) {
   var database = BaseLocal;
   
   
  this.getUbicaciones = function() {
        return database.get('ubicaciones').then(function(doc){
           return doc.ubicaciones;
         });
    }
    this.agregarUbicacion = function(ubicacion) {
        return database.get('ubicaciones').then(function(doc){
            //para editar, primero lo saco y después lo vuelvo a agregar
            doc.ubicaciones = removerElemento(doc.ubicaciones,ubicacion); 
            doc.ubicaciones.push(ubicacion);
            database.put(doc,doc._id,doc._rev);
            return doc;
         }).catch(function (error) {
           //Si no lo encuentra, lo crea
           var doc = {
                _id: 'ubicaciones',
              "ubicaciones": [{
              id: 0,
              nombre: ubicacion.nombre,
              direccion: ubicacion.direccion,
              latitud: ubicacion.latitud,
              longitud:  ubicacion.longitud
            }
            ]}
           database.put(doc);
           return doc;
         });
    }
    this.borrarUbicacion = function(ubicacion) {
        return database.get('ubicaciones').then(function(doc){
            doc.ubicaciones = removerElemento(doc.ubicaciones,ubicacion);            
            database.put(doc,doc._id,doc._rev);
            return doc.ubicaciones;
         });
    }
    
})