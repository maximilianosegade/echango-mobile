angular.module('app.services.mediosDePago', [])
.service("MediosDePagoService", function($rootScope, $q, BaseLocal) {
   var database = BaseLocal;

    //Busca el documento 'medioDePagoTarjetasNombres'
    BaseLocal.get('tarjetas').then(function(doc){
      //si lo encuentra lo borra
      BaseLocal.remove(doc._id, doc._rev).then(function(){
        //si lo borra bien lo vuelve a crear
        BaseLocal.put({
        	 _id: 'tarjetas',
             tarjetas: [{
             _id: 1,
             nombre: 'Visa Crédito',
             bancos : [{_id:1, nombre: 'BBVA Francés'},{_id:2, nombre: 'Banco Nación'},{_id:3, nombre: 'Banco Ciudad'},{_id:4, nombre: 'HSBC'}]
           }, {
             _id: 2,
             nombre: 'MasterCard',
             bancos : [{_id:1, nombre: 'BBVA Francés'},{_id:2, nombre: 'Banco Nación'},{_id:5, nombre: 'Banco Provincia'},{_id:6, nombre: 'ICBC'}]
           
           },
           {
             _id: 3,
             nombre: 'American Express',
             bancos : [{_id7, nombre: 'AMEX'},{_id:2, nombre: 'Banco Nación'},{_id:8, nombre: 'Banco Patagonia'},{_id:4, nombre: 'HSBC'}]            
           }
           ]});
      });
    }).catch(function (error) {
           //Si no lo encuentra, lo crea
           BaseLocal.put({
                _id: 'tarjetas',
              tarjetas: [
             {
              _id: 1,
              nombre: 'Visa Crédito',
              bancos : [{_id:1, nombre: 'BBVA Francés'},{_id:2, nombre: 'Banco Nación'},{_id:3, nombre: 'Banco Ciudad'},{_id:4, nombre: 'HSBC'}]
            }, {
              _id: 2,
              nombre: 'MasterCard',
              bancos : [{_id:1, nombre: 'BBVA Francés'},{_id:2, nombre: 'Banco Nación'},{_id:5, nombre: 'Banco Provincia'},{_id:6, nombre: 'ICBC'}]            
            },
            {
              _id: 3,
              nombre: 'American Express',
              bancos : [{_id:7, nombre: 'AMEX'},{_id:2, nombre: 'Banco Nación'},{_id:8, nombre: 'Banco Patagonia'},{_id:4, nombre: 'HSBC'}]            
            }
            ]});
         });

    
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