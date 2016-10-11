angular.module('app.services.lista', [])
.service("ListaService", function($rootScope, $q, BaseListas) {
	
	 var database = BaseListas;
	 var listaSeleccionada = null;
	   
	   
	  this.getListas = function() {
	        return database.allDocs({include_docs:true}).then(function(result){
	           return result.rows;
	         });
	   };
	   
	   this.guardarLista = function($nombre,$desc,$lista, $editando){
		   var nuevaLista = {};
		   nuevaLista.nombre = $nombre;
		   nuevaLista.descripcion = $desc;
		   nuevaLista.productos = $lista;
		   nuevaLista._id = $nombre;
		   if($editando){
			   return database.get($nombre).then(function(doc) {
				   nuevaLista._rev=doc._rev;
				   return database.put(nuevaLista);
				 }).catch(function($e){
					 //Por si le cambió el nombre
					 return database.put(nuevaLista);	
				 })
		   }else{
			   return database.put(nuevaLista);			   
		   }
	   };
		   
	   this.borrarLista = function(lista){
		  return database.get(lista._id).then(function(doc) {
			   return database.remove(doc);
			 }).then(function (result) {
			   // handle result
			 }).catch(function (err) {
			   console.log(err);
			 });
	   }
	   
})