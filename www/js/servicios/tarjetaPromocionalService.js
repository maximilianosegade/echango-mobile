angular.module('app.services.tarjetaPromocional', [])
.service("TarjetaPromocionalService", function($rootScope, $q, BaseLocal) {
    
    var dbLocal = BaseLocal;

    this.getTarjetasPromocionalesRegistradas = function() {
        return dbLocal.get('tarjetasPromocionalesRegistradas').then(function(doc){
        // Lo encontró
            return doc
    }).catch(function(err){
        // Si no existe, crearlo
        dbLocal.put({
            _id: 'tarjetasPromocionalesRegistradas',
             tarjetasPromocionalesRegistradas: []
        }).then(function (response) {
            // handle response
        }).catch(function (err) {
            alert('error al crear')
        });
    });
    }

    this.updateTarjetasPromocionalesRegistradas = function (obj) {
    
    // Actualizar datos en Pouch
            BaseLocal.get('tarjetasPromocionalesRegistradas').then(function(doc) {
            return BaseLocal.put({
                _id: 'tarjetasPromocionalesRegistradas',
                _rev: doc._rev,
                tarjetasPromocionalesRegistradas: obj
                 });
             }).then(function(response) {

                
        }).catch(function (err) {
                // Error, no existia el doc -> crearlo
                BaseLocal.put({
                _id: 'tarjetasPromocionalesRegistradas',
                tarjetasPromocionalesRegistradas: obj
            }).catch(function(err){
                alert('error al crear');
            });
        });
      
        
    };
  
})