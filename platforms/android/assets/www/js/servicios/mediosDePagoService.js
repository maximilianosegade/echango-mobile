angular.module('app.services.mediosDePago', [])
.service("MediosDePagoService", function($rootScope, $q, BaseLocal) {
   var database = BaseLocal;

    //Busca el documento 'medioDePagoTarjetasNombres'
    

    
   // Obtener tarjetas
    this.getTarjetas = function(){
        return database.get('tarjetas').then(function(doc){
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
                    mediosDePagoRegistrados: []
                    
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