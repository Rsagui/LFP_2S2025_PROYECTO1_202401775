/*

Recordemos que nosotrs al guardar un token en un objeto o en algo
hace que lo considermos un dato,que nos permite manipular info
A esto lo llamamos consumo de tokens

Este es un flujo seguro para iterar tokens y terminar sus validaciones para los posteriores reportes

*/

import {Equipo} from "../Modelos/Equipo";
//demas imports

export class TokenStream{
    constructor(listaDeTokens){ //desde el lexer nosotros almacenamos los tokens en una lista
        this.listaDeTokens=listaDeTokens;
        this.idx=0; //esto nos permite movernos en la listas
    }

    //peek=ojeada, es ver si consumir:
    
    verQueHayEnLaLista(posPorDefecto=0){ return this.listaDeTokens[this.idx+posPorDefecto]|| null;} //estoy viendp mas adelante, que tanto? Pues lo que me pasen en la funcion, o por defecto solo con idx
    //OJO si me paso del tamaño de la lista->null

    
    //ahora esto si sirve para consumir y avanzar:

    siguienteEnLaLista(){return this.listaDeTokens[idx++]||null;} //devuvo el token actual y despues incremeto el idx uno más

    //ver si ya terminamos:
    seraQueTerminamosLaLista(){return this.idx>=this.listaDeTokens.length;}

}

