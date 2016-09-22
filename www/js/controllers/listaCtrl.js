angular.module('app.controllers.lista', [])
.controller('listaCtrl', function($scope,$ionicHistory,$state,ListaService, ComprarService) {

 $scope.$on("$ionicView.beforeEnter", function(event, data){
		 
		 ListaService.getListas().then(function(result){
			 $scope.listasGuardadas = [];
			 
				 for (var i = 0; i < result.length; i++) {
					 $scope.listasGuardadas.push(result[i].doc);
			        }  
		    $scope.$apply();
		 })
 });
 
 $scope.elegirLista = function (lista){
	 ComprarService.seleccionarLista(lista);
		$ionicHistory.nextViewOptions({
		      disableBack: false
		    });
		 $state.go('menu.miChango');
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
	ListaService.listaEditar = listaCombinada;
	ListaService.editando = false;
	 $state.go('menu.nuevaLista');
	 
 }
 
 $scope.editar = function (lista){
	 ListaService.listaEditar = lista;
	 ListaService.editando = true;
	 $state.go('menu.nuevaLista');
 }
 
 $scope.borrar =  function (lista){
	 

	 	$scope.listasGuardadas = removerElemento($scope.listasGuardadas, lista);
	    $scope.$apply();
	    
	    // Actualizar DB
	    
	    ListaService.borrarLista(lista);
}
 
 
});