angular.module('app.controllers.simular', [])
.controller('simulacionCtrl', function($scope, $state,BaseLocal, ComprarService) {
	
	$scope.$on("$ionicView.beforeEnter", function(event, data){
		$scope.simulacion = ComprarService.simulacion;
		$scope.apply();
	});
	
})