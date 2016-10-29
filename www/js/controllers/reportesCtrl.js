angular.module('app.controllers.reporte', [])
.controller('reporteCtrl', function($scope, $state,$ionicModal,BaseCompras, ProductoService,ComprarService) {
	
	
	$scope.$on("$ionicView.beforeEnter", function(event, data){
		ComprarService.obtenerCompras().then(function(docs){
			//cada elemento hay que pedirle .doc ahí está la info			
			$scope.compras = docs;
		})
	});
})
.controller('reporteProductosCtrl', function($scope, $state,$ionicModal,BaseCompras, ProductoService,ReporteService) {
	
	
	$scope.$on("$ionicView.beforeEnter", function(event, data){
		ReporteService.productosMasComprados(5).then(function(productos){
			//devuelve un array de objetos de la forma
			/*
			 * {_id: 414124,
			 * 		nombre: 'nombre producto',
			 *   valores[{fecha:123123123, valor:12312312}] 
			 * */
			$scope.productos = productos;
		})
	});
})



