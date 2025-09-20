// ---------- TORNEO { nombre: "str", equipos: num, sede: "str" } -----------
//TStream=onjeto flujo de tokens

import { TokenStream } from "./flujoDeTokens";

export function consumirBloqueTorneo(TStream){

    let nombreTorneo=null,equiposEsperados=null, sede=null;

    //finalizamos hasta encontrar una llave de ciere:}

    //Mientrad sigan existiendo objetos en la lista de tokens y el lexema del token siguiente no sea una llave, podemos seguir
    while(!TStream.seraQueTerminamosLaLista() && TStream.verQueHayEnLaLista().lexema!=="}"){

        const token=TStream.verQueHayEnLaLista();

        //en caso que el lexema del tokem sea un nombre 
        if(token.lexema==="nombre"){

            TStream.atributoEsperado("nombre"); //En este metodo se consume un token y se pasa el siguiente
            //entonces caemos acá

            TStream.lexemaEsperado(":");//Se cosume el token y paso al siguiente

            nombreTorneo=TStream.tipoEsperado("Cadena").lexema; //estos metodos me devuelven tokens, por eso puedo acceder al lexema
            //De igual forma lo anterior hace que se consuma el token y pase al siguiente
        }

        //va a lelgar un punto donde el token que sera visto como el que sigue
        //Esto gracias a const token=TStream.verQueHayEnLaLista();
        //Cumpla con alguna de las siguintes condiciones
        //Porque ojo, yo no me estoy quedando quieto, siempre estoy viendo que viene luego
        
        
        else if(token.lexema==="equipos"){
            TStream.atributoEsperado("equipos");//en este casp si consumo y paso al siguiente
            TStream.lexemaEsperado(":");
            equiposEsperados=TStream.tipoEsperado("Numero").lexema; //el token que me es debuelto,lo uso para acceder a numero
        }

        else if(token.lexema==="sede"){
            TStream.atributoEsperado("sede");
            TStream.lexemaEsperado(":");
            sede=TStream.tipoEsperado("Cadena").lexema;

        }

        else if(token.lexema===","){
            TStream.siguienteEnLaLista(); //lo que pasa que los atributos, son separasos por comas que consumimos asi sin mas

        }

        else{
            TStream.throwError("Atributo no valid en el torneo",token);
            
        }
    }

    //Evaluo la info que obtuve de los datos que guarde
    if (!nombreTorneo || !equiposEsperados || !sede) {
        throw new Error("TORNEO incompleto: faltan nombre, equipos o sede.");
    }
    return { nombreTorneo, equiposEsperados, sede };
}
