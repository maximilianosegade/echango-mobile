angular.module('app.services.mediosDePago', [])
.service("MediosDePagoService", function($rootScope, $q, BaseLocal) {
   var database = BaseLocal;
    
   // Obtener tarjetas
    this.getTarjetas = function(){
        return database.get('medioDePagoTarjetasNombres').then(function(doc){
            return doc;
        });
    };

// Obtener bancos
    this.getBancos = function() {
        return database.get('medioDePagoTarjetasBancos').then(function(doc){
            return doc;
        });
    };


// Obtener medios de pago registrados

    this.getMediosDePagoRegistrados = function() {
        return database.get('mediosDePagoRegistrados').then(function(doc){
            return doc
    }).catch(function(err){
        BaseLocal.put({
                    _id: 'mediosDePagoRegistrados',
        }).catch(function(err){
            "No se pudo hacer put"
        });
    })
    };

// Actualizar datos en Pouch

    this.updateMediosDePagoRegistrados = function(obj){
        BaseLocal.get('mediosDePagoRegistrados').then(function(doc) {
   	        return BaseLocal.put({
                _id: 'mediosDePagoRegistrados',
                _rev: doc._rev,
                mediosDePagoRegistrados: obj
            });
        }).then(function(response) {
        
        }).catch(function (err) {
                BaseLocal.put({
                    _id: 'mediosDePagoRegistrados',
                    mediosDePagoRegistrados: obj
                }).catch(function(err){
                    alert('error al crear');
                });
        });
    };
  
})