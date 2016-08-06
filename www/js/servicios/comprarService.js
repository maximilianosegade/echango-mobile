angular.module('app.services.compras', [])
.service("ComprarService", function() {
	
	var comercio = null;
	var lista = null;
	
	this.seleccionarComercio = function (com){
		comercio = com;
	}
	

	this.comercioSeleccionado = function (){
		return comercio;
	}
	
	
	this.seleccionarLista = function (lis){
		lista = lis;
	}
	

	this.listaSeleccionada = function (){
		return lista;
	}
	
})