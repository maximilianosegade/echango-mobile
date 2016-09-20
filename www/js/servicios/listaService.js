angular.module('app.services.lista', [])
.service("ListaService", function($rootScope, $q, BaseListas) {
	
	 var database = BaseListas;
	   
	   
	  this.getListas = function() {
	        return database.allDocs({include_docs:true}).then(function(result){
	           return result.rows;
	         });
	   };
	   
	   this.guardarLista = function($nombre,$lista){
		   var nuevaLista = {};
		   nuevaLista.nombre = $nombre;
		   nuevaLista.productos = $lista;
		   nuevaLista._id = $nombre;
		   return database.put(nuevaLista);
		   };
		   
	   this.borrarLista = function(lista){
		   database.get(lista._id).then(function(doc) {
			   return database.remove(doc);
			 }).then(function (result) {
			   // handle result
			 }).catch(function (err) {
			   console.log(err);
			 });
	   }
	   
})