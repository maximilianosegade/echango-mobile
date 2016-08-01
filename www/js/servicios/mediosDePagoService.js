angular.module('app.services.mediosDePago', [])
.service("MediosDePagoService", function($rootScope, $q, BaseLocal) {
   var database = BaseLocal;

    //Busca el documento 'medioDePagoTarjetasNombres'
    BaseLocal.get('medioDePagoTarjetasNombres').then(function(doc){
      //si lo encuentra lo borra
      BaseLocal.remove(doc._id, doc._rev).then(function(){
        //si lo borra bien lo vuelve a crear
        BaseLocal.put({
                _id: 'medioDePagoTarjetasNombres',
              "medioDePagoTarjetasNombres": [{
              id: 0,
              nombre: 'Visa Crédito',
            }, {
              id: 1,
              nombre: 'MasterCard',
            },
            {
              id: 2,
              nombre: 'American Express',
            }
            ]});
      });
    }).catch(function (error) {
           //Si no lo encuentra, lo crea
           BaseLocal.put({
                _id: 'medioDePagoTarjetasNombres',
              "medioDePagoTarjetasNombres": [{
              id: 0,
              nombre: 'Visa Crédito',
            }, {
              id: 1,
              nombre: 'MasterCard',
            },
            {
              id: 2,
              nombre: 'American Express',
            }
            ]});
         });

    //Busca el documento 'medioDePagoTarjetasBancos'
    BaseLocal.get('medioDePagoTarjetasBancos').then(function(doc){
      //si lo encuentra lo borra
      BaseLocal.remove(doc._id, doc._rev).then(function(){
        //si lo borra bien lo vuelve a crear
        BaseLocal.put({
                _id: 'medioDePagoTarjetasBancos',
              "medioDePagoTarjetasBancos": [{
              id: 0,
              nombre: 'Santander Río',
            }, {
              id: 1,
              nombre: 'Galicia',
            },
            {
              id: 2,
              nombre: 'Francés',
            }
            ]});
      });
    }).catch(function (error) {
           //Si no lo encuentra, lo crea
           BaseLocal.put({
                _id: 'medioDePagoTarjetasBancos',
              "medioDePagoTarjetasBancos": [{
              id: 0,
              nombre: 'Santander Río',
            }, {
              id: 1,
              nombre: 'Galicia',
            },
            {
              id: 2,
              nombre: 'Francés',
            }
            ]});
         });
    
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