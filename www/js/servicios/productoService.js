angular.module('app.services.producto', [])
.service("ProductoService", function($rootScope, $q, BaseProductos,BasePreciosPorComercio, ComprarService) {
	var database = BaseProductos;
    var buscador = buscadorProductos(BaseProductos);
    
    // Tiro una busqueda al inicializar para que se indexen los productos.
    buscador.buscar('').then(function(){
        console.log('Indexar nombres de productos => OK.');
    }).catch(function(err){
        console.log('Indexar nombres de productos => ERR. ', err);
    });
    
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
	
	this.obtenerDetalleProducto = function(producto, comercio, medioDePago,descuento, fecha){
		
		
		return BasePreciosPorComercio.get(comercio._id).then(function(precios){
                           
                var precio = precios.precios[producto.ean];
                precio.id = comercio._id;
                producto.precios = [];
                producto.precios.push(precio);
           
            return producto;    
        }).catch(function(error){
        	//no encontró el precio
        	var precio = {
                    id: comercio._id, 
                    lista: 0,
                    promociones: []
                }
        		producto.lista = 0
                producto.precio = precio;
                producto.precios = [];
                producto.precios.push(precio);
        	
        	return producto;  
        }).then(function(producto){

    	
		var precioASumar = null;
		var descuentoActual = 0;
		producto.descuento = 0;
		producto.cantidad = 1;
					
			for(var k = 0; producto.precios.length > k;k++){
				if(producto.precios[k].id == comercio._id){
					// estamos en el comercio seleccionado
					producto.lista = Number(producto.precios[k].precio);
					var result =ComprarService.aplicarPromociones(producto.precios[k].precio	,producto.cantidad,
							producto.precios[k].promociones,medioDePago,descuento,fecha);
					 
					descuentoActual = result[0];
					precioASumar = result[1];	
					k = 64000;// para salir de comercios
				}
			}// ciere For de PRECIOS
		
		producto.descuento = Number(descuentoActual.toFixed(2));
		producto.precio_final = Number((Number(producto.lista) - Number(producto.descuento)).toFixed(2));
		
		
		
		return producto;
        });
	}


	this.updateProducto = function(obj) {
		database.get(obj.ean).then(function(doc) {
            return database.put({                
				_id: obj.ean,
                _rev: doc._rev,
				nombre: obj.nombre,
                precios: obj.precios,
                ean: obj.ean,
				etiquetas: doc.etiquetas
			});
        }).then(function(response) {
				if(response.ok){
					alert('Datos informados. ¡Gracias!');
				}
				else {
					alert(response.ok);
				}
              
        }).catch(function (err) {
             alert(err);
             database.put({
                _id: obj.ean,
                nombre:obj.nombre,
                precios: obj.precios,
                ean: obj.ean,
				etiquetas: []
			});
        	
   		});
	};


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
});

