angular.module('app.services.datosAdicionales', [])
.service("DatosAdicionalesService", function($rootScope, $q, BaseLocal) {
   var database = BaseLocal;
   
   this.getDatosAdicionales = function(){
        return database.get('datosAdicionales').then(function (doc) {
            
            return doc;

         }).catch(function (err) {
            // No existian datos de cuenta guardados
         alert('No se encontraron datos guardados.')

    });
   };

   this.updateDatosAdicionales = function(obj) {
        database.get('datosAdicionales').then(function(doc) {
            return BaseLocal.put({
                _id: 'datosAdicionales',
                _rev: doc._rev,
                sexo: obj.sexo,
                estadoCivil: obj.estadoCivil,
                regularidadDeCompra: obj.regularidadDeCompra,
                edad: obj.edad,
                lugarDeCompra: obj.lugarDeCompra,
                composicionFamiliar: obj.composicionFamiliar

            });
        }).then(function(response) {
              alert('Datos guardados correctamente!')
        }).catch(function (err) {
             //alert('No se pudo guardar');
             BaseLocal.put({
                _id: 'datosAdicionales',
                sexo:obj.sexo,
                estadoCivil: obj.estadoCivil,
                regularidadCompra: obj.regularidadCompra,
                edad: obj.edad,
                nombre: obj.nombre,
                password: obj.password,
                lugarCompraAlmacenBarrio: obj.lugarCompraAlmacenBarrio,
                lugarCompraMinimercado: obj.lugarCompraMinimercado,
                lugarCompraMinimercadoChino: obj.lugarCompraMinimercadoChino,
                lugarCompraSupermercado: obj.lugarCompraSupermercado
            });
        });
   };

})