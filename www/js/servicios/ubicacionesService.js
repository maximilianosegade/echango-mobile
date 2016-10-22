angular.module('app.services.ubicaciones', [])
.service("UbicacionesService", function($rootScope, $q, BaseLocal) {
   var database = BaseLocal;
   
   
  this.getUbicaciones = function() {
        return database.get('ubicaciones').then(function(doc){
           return doc.ubicaciones;
         });
   };
   this.getComerciosFavoritos = function() {
        return database.get('ubicaciones').then(function(doc){
           return doc.comercios;
         });
   };
	
	this.actualizarComercioFavorito = function(comercio, indice){
		return database.get('ubicaciones').then(function(doc){
					doc.comercios[indice] = comercio;
					return database.put(doc).then(function(doc){
						return doc;
					});
	         });
	}
   
   this.agregarComercioFavorito = function(comercio) {
       return database.get('ubicaciones').then(function(doc){
           //para editar, primero lo saco y después lo vuelvo a agregar
    	   if(doc.comercios){
               doc.comercios = removerElemento(doc.comercios,comercio);     		   
    	   }else{
    		   doc.comercios = [];
    	   }
           doc.comercios.push(comercio);
           database.put(doc,doc._id,doc._rev);
           return doc;
        }).catch(function (error) {
          //Si no lo encuentra, lo crea
          var doc = {
               _id: 'ubicaciones',
             "comercios": [{
             id: 0,
             nombre: comercio.nombre,
             direccion: comercio.direccion,
             nombrecadena: comercio.nombrecadena,
             latitud: comercio.latitud,
             longitud:  comercio.longitud
           }
           ]};
          database.put(doc);
          return doc;
        });
   };
   
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
            ]};
           database.put(doc);
           return doc;
         });
    };
    this.borrarUbicacion = function(ubicacion) {
        return database.get('ubicaciones').then(function(doc){
            doc.ubicaciones = removerElemento(doc.ubicaciones,ubicacion);            
            database.put(doc,doc._id,doc._rev);
            return doc.ubicaciones;
         });
    };
    this.borrarComercio = function(comercio) {
        return database.get('ubicaciones').then(function(doc){
            doc.comercios = removerElemento(doc.comercios,comercio);            
            database.put(doc,doc._id,doc._rev);
            return doc.comercios;
         });
    };
    
    this.getRadio = function(){
    	 return database.get('radio').then(function(doc){
              return doc.radio;
          });
    }
    this.actualizarRadio = function(nuevoRadio){
    	return database.get('radio').then(function(doc){
    		doc.radio = nuevoRadio;
             database.put(doc,doc._id,doc._rev);
             return doc.radio;
        });
    }
    
    
});