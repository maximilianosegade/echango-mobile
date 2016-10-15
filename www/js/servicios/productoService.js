angular.module('app.services.producto', [])
.service("ProductoService", function($rootScope, $q, BaseProductos) {
	var database = BaseProductos;
    var buscador = buscadorProductos(BaseProductos);
    
	function mapNombreProducto(doc) {
	   emit(doc.nombre);
	};
    
	function mapEANProducto(doc) {
	   emit(doc.ean);
	};
    
	this.getProductoPorNombre = function(nombreProducto){
        return buscador.buscar(nombreProducto);
	};
    
	this.getProductoPorEAN = function(ean){
		return database.get(ean).then(function(doc){
	        return doc;
	    });
	};
    
});

function buscadorProductos(BaseProductos) {
    var buscador = {}
    
    buscador.BaseProductos = BaseProductos;
    buscador.rows = [];
    
    buscador.index = elasticlunr(function () {
        this.addField('nombre');
        this.setRef('_id');
    });
    
    buscador.indexarProductos = function(productos){
        var i;

        for (i=0; i< productos.length; i++) {
            buscador.index.addDoc(productos[i].doc)
        }
    }
    
    buscador.obtenerProductos = function(){
        return new Promise(function(resolve, reject){
            
            if (buscador.rows.length == 0){
                return buscador.BaseProductos.allDocs({
                    include_docs: true
                }).then(function(prods){
                    buscador.rows = prods.rows
                    resolve(buscador.rows);
                })                    
            }else{
                resolve(buscador.rows);
            }
                           
        })
    }
    
    buscador.buscar = function(query){
            
        console.log('Se van a buscar productos con query['+
                   query + '].')
        
        
        return new Promise(function(resolve, reject){
        
            buscador.obtenerProductos().then(function(productos){
                
                var i, 
                    res;
                var productosBuscados = [];
                    
                buscador.indexarProductos(productos);
                    
                res = buscador.index.search(query)
                
                console.log('Se encontraron [' + res.length + '] resultados.')

                for (i=0; i< res.length; i++) {
                    productosBuscados.push(buscador.index.documentStore.docs[res[i].ref])
                }
                
                resolve(productosBuscados);
                
            }).catch(function(err){
                reject(err)
            })

        })
        
    }
    
    return buscador;
}