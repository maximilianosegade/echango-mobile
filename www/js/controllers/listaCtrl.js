angular.module('app.controllers.lista', [])
.controller('listaCtrl', function($scope,$ionicHistory,$state,ListaService, ComprarService) {

 $scope.$on("$ionicView.beforeEnter", function(event, data){
		 
		 ListaService.getListas().then(function(result){
			 $scope.listasGuardadas = result;
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
 
 $scope.borrar =  function (lista){
	 

	 	$scope.listasGuardadas = removerElemento($scope.listasGuardadas, lista);
	    $scope.$apply();
	    
	    // Actualizar DB
	    
	    ListaService.borrarLista(lista);
}
 
 
});