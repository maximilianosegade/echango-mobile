angular.module('app.controllers.simular', [])
.controller('simulacionCtrl', function($scope, $state,BaseLocal, ComprarService) {
	
	$scope.$on("$ionicView.beforeEnter", function(event, data){
		$scope.costos = ComprarService.costos;
		$scope.apply();
	});
	
})