angular.module('app.controllers.lista', [])
.controller('listaCtrl', function($scope,$ionicHistory,$state,ListaService, ComprarService,$stateParams) {

 $scope.$on("$ionicView.beforeEnter", function(event, data){
		 
		 ListaService.getListas().then(function(result){
			 $scope.listasGuardadas = [];
			 
				 for (var i = 0; i < result.length; i++) {
					 $scope.listasGuardadas.push(result[i].doc);
			        }  
		    $scope.$apply();
		 });
		 
		 $scope.simular = ComprarService.simular;
		 if($scope.simular){
			 ComprarService.obtenerParametrosSimulacion();
		 }
		 
 });
 
 $scope.simularConLista = function(){
	 ComprarService.simular = true;
	 ComprarService.simulacion = true;
	 ListaService.simular = true;
	 $state.go('menEChango.misListas');
 }
 
 $scope.seleccionar = function(lista){
	 if($scope.simular){
		 $scope.elegirLista(lista);
	 }else{
		 $scope.editar(lista);
	 }
 };
 
 $scope.elegirLista = function (lista){
	 ComprarService.seleccionarLista(lista).then(function(){
		 	if(ComprarService.simulacion){
		 	$state.go('menEChango.parMetrosDeSimulaciN');	
		 }else{
			 $state.go('menEChango.parametrizaciNDeCompra');
		 }	 
	 });
		
 }
 
 $scope.combinarListas = function (){
	 var listasCombinar = [];
	 
	for(var i = 0; $scope.listasGuardadas.length > i; i++){
		if($scope.listasGuardadas[i].selected){
			listasCombinar.push($scope.listasGuardadas[i]);
		}		
	}
	if(listasCombinar.length < 1){
		return;
	}
	var nombre = "nnnnn";
	var listaCombinada = {
											productos: []};
	
	var agregarProducto = true;
	for(var k = 0;listasCombinar.length > k; k++){
		//recorro las listas a combinar
		for(var j = 0; listasCombinar[k].productos.length > j ; j++){
			//recorro los productos a combinar
			agregarProducto = true;
			for(var l = 0; listaCombinada.productos.length> l;l++){
				//recorro los productos combinados
				 if(listaCombinada.productos[l]._id == listasCombinar[k].productos[j]._id){
					 listaCombinada.productos[l].cantidad = Number(listasCombinar[k].productos[j].cantidad) + Number(listaCombinada.productos[l].cantidad);
					 agregarProducto = false;
					 break;
				 }
			 }
			if(agregarProducto){
				listaCombinada.productos.push(listasCombinar[k].productos[j]);
			}
		}
	}
	ListaService.listaSeleccionada = listaCombinada;
	ListaService.editando = false;
	 $state.go('menEChango.verModificarLista');
	 
 }
 
 $scope.editar = function (lista){
	 ListaService.listaSeleccionada = lista;
	 ListaService.editando = true;
	 $state.go('menEChango.verModificarLista');
 }
 
 $scope.simular = function (lista){
	 ListaService.listaSeleccionada = lista;
	 ListaService.simular = true;
	 $state.go('menu.iniciarCompra');
 }
 
 
 $scope.borrar =  function (lista){
	 

	 	$scope.listasGuardadas = removerElemento($scope.listasGuardadas, lista);
	    $scope.$apply();
	    
	    // Actualizar DB
	    
	    ListaService.borrarLista(lista);
}
 
 
});