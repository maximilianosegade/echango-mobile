angular.module('app.services.lista', [])
.service("ListaService", function($rootScope, $q, BaseListas) {
	
	 var database = BaseListas;
	   
	   
	  this.getListas = function() {
	        return database.allDocs({include_docs:true}).then(function(result){
	           return result.rows;
	         });
	   };
})