angular.module('app.controllers.reporte', [])
.controller('reporteCtrl', function($scope, $state,$ionicModal,BaseCompras, ProductoService,ComprarService) {
	
	
	$scope.$on("$ionicView.beforeEnter", function(event, data){
		ComprarService.obtenerCompras().then(function(docs){
			//cada elemento hay que pedirle .doc ahí está la info			
			$scope.compras = docs;
		})
	});
})