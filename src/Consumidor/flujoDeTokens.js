/*

Recordemos que nosotrs al guardar un token en un objeto o en algo
hace que lo considermos un dato,que nos permite manipular info
A esto lo llamamos consumo de tokens

Este es un flujo seguro para iterar tokens y terminar sus validaciones para los posteriores reportes

*/


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

    siguienteEnLaLista(){return this.listaDeTokens[this.idx++]||null;} //devuvo el token actual y despues incremeto el idx uno más

    //ver si ya terminamos:
    seraQueTerminamosLaLista(){return this.idx>=this.listaDeTokens.length;}

    lexemaEsperado(lex){

        const token=this.siguienteEnLaLista();//consumo pero devuelve el token actual en donde me encontraba 
        if(!token || token.lexema!==lex){ //atributo lexema de un token
            this.throwError(`Se esperaba '${lex}'`, token);
        }
        return token;

    }

    // es un atributo
    tipoEsperado(tipoEsperado){

        const token=this.siguienteEnLaLista();
        if(!token || token.tipo!==tipoEsperado){
            this.throwError(`Se esperaba '${tipoEsperado}'`, token);

        }
        return token;

    }

    //Yo considero a los atributos lexemas al final de cuentas
    atributoEsperado(nombreAtributo){

        const token=this.siguienteEnLaLista();

        if(!token|| token.lexema!==nombreAtributo){

            this.throwError(`Se esperaba atributo '${nombreAtributo}'`, token);

        }
        return token;

    }

    //Para palabras reservadas:

    palabraReservadaEsperada(PReser){

        return this.lexemaEsperado(PReser);
    }

    throwError(msg,token){
        if (typeof msg !== "string") msg = String(msg);
        //Si existe el token no esta vacio y no e cumple los estandares esperados
        //Caemos en este metodo, donde se accede al token,su fila, su lexema  y lo del jason me permite que sea visto en consola de forma amena, con comillas detro
        //Si el token esta vacio, esta variable estara vacia
        const dondeFueElError=token? ` (línea ${token.fila}, columna ${token.columna}, lexema=${JSON.stringify(token.lexema)})` : "";

        throw new Error(`${msg}${dondeFueElError}`);
    }

}

