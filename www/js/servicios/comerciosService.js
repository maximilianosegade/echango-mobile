angular.module('app.services.comercios', [])
.service("ComerciosService", function($rootScope, $q, BaseLocal, BaseComercios) {
	
	function mapNombreCadena(doc) {
        emit(doc.cadena);    
    }
    
	this.comerciosPorCadena = function(cadena){
		
        return BaseComercios.allDocs({
            startkey: cadena._id.toString(),
            endkey: cadena._id.toString() + '\uffff',
            include_docs : true
        }).then(function (res) {
            return res.rows;
        }).catch(function (err) {
            return null;
        });
            
    }
    
});