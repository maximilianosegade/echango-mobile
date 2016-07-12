/*
*Para remover un item de un array, 
*se asume que todos los objetos tienen una propiedad id
* se remueve solo la primer aparición
*/
function removerElemento(arr, obj){
       for (var i = 0; i < arr.length; i++) {
            if (arr[i].id == obj.id ) {
                arr.splice(i, 1);
                return arr;
            }
        }  
        return arr; 
   }