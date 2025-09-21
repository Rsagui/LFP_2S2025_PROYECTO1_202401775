// -------- EQUIPOS { (equipo: "Nombre" [ jugadores... ]) , ... } ----------

import { Equipo } from "../Modelos/Equipo";
import { Jugador } from "../Modelos/Jugador";
import { TokenStream } from "./flujoDeTokens";


//Este recibe un objeto torneo y uno de flujo de tokens
export function consumirBloqueEquipos(TStream,torneo){

    
    //repetimos hasta encontrar la lla ve de cierre
    //acordate que el metodo ver,no consume, solo mira que sigue
    while(!TStream.seraQueTerminamosLaLista() && TStream.verQueHayEnLaLista()!=="}"){

        const token=TStream.verQueHayEnlaLista();

        //si lo que sigue tiene xomo lexema equipo

        if(token.lexema==="equipo"){
            TStream.palabraReservadaEsperada("equipo"); //se consume el token del flujo de tokens
            TStream.lexemaEsperado(":");

            const nombreEquipo=TStream.tipoEsperado("Cadena").lexema;

            //crea un objeto equipo con el nombre y se queda en una lista del torneo
            const equipoNuevo=torneo.asegurarEquipo(nombreEquipo);
            
            TStream.lexemaEsperado("[");//se consume el token y se pasa al siguuiente
            
            consumirListaJugadores(TStream,equipoNuevo); //funcion creada luego

            TStream.lexemaEsperado("]");

            //si revisas lo archivos de entrada, entre casa equipo existen comas

            //Entonces eso lo consumimos
            if(TStream.verQueHayEnLaLista() && TStream.verQueHayEnLaLista.lexema===",") TStream.siguietneEnLaLista();

            //caso en donde literalmente no existe siguiente, pero estamos en la posicion donde este la coma          
        }
        else if(token.lexema===","){
            TStream.siguietneEnLaLista(); //DE Todas formas es consumido
            }
        //caso donde no se cumole elformato
        else{
            TStream.throwError(("Se esperaba 'equipo' o '}' en EQUIPOS", token));
            }
    }

    if(torneo.equiposDelTorneo.size!==torneo.cantEquiposEsperados){
        //señal de falta de coherencia
        console.warn(`Advertencia: se declararon ${torneo.equipos.size} equipos, se esperaban ${torneo.esperadoEquipos}.`);
    }
}

//Funcion para consumir una lista de jugadores:

export function consumirListaJugadores(TStream,equipo){

    while(TStream.seraQueTerminamosLaLista() && TStream.verQueHayEnLaLista().lexema!=="]"){
        //Todo esto sigue la forma del archivo de texto
        TStream.palabraReservadaEsperada("jugador"); //si coincide con el lexema del token, seguimos
        TStream .lexemaEsperado(":");
        
        //si el tipo del token es una cadena, me devuelve le token y accedo a su lexema para tener su nombre
        const nombreEquipo = TStream.expectType("Cadena").lexema;


        TStream.lexemaEsperado("[");

        //Este metodo me devuelve un lexema, en este caso el texto que me indica en que posicion juega el don
        const posicionDelJugador=consumirCadena(TStream,"posicion")//Esta funcin la creamos abajo
        TStream.lexemaEsperado(","); //estas comas seperan los atributos en el archivo
        
        //Ya no hago lo del analizar los 2 puntos y eso, porque ya lo hace el metodo{}

        //--------------------
        const numeroDelJugador=consumirNumero(TStream,"numero");
        TStream.lexemaEsperado(","); //estas comas seperan los atributos en el archivo

        const edad=consumirNumero(TStream,"edad");
        TStream.lexemaEsperado("]")//lllave de cierre
    

        //con estos datos podemos crear un jugador y agregarlo a un equipo

        equipo.agregarUnJugadorAlEquipo(new Jugador(nombreJugador,posicionDelJugador,numeroDelJugador,edad));

        //entre cada info de los jugadores hay comas que seperan:
        if(TStream.verQueHayEnLaLista() && TStream.verQueHayEnLaLista().lexema===",") TStream.siguietneEnLaLista();
    }
}

//funciones de apoyo para el parseo de los jugadores

export function consumirCadena(TStream,atributoAEvaluar){

    TStream.atributoEsperado(atributoAEvaluar); //si no pasa nada solo se consume y pasamos al next

    TStream.lexemaEsperado(":");//se consum y vamos al next

    return TStream.tipoEsperado("Cadena").lexema; //si se cumple que el tipo del token que viene luego es una cadena, pues accedo al lexema del token y lo devuelvo
}

//el numero a evaluar puede ser un dorsal o una edads
export function consumirNumero(TStream,numeroAEvaluar){

    TStream.atributoEsperado(numeroAEvaluar); //si el atributo  esperado "el que pase como argumento" coincide con el lexema del token, se consume y vamos la siguiente

    TStream.lexemaEsperado(":");

    return TStream.tipoEsperado("Número").lexema; //pongo asi Número, porque asi guardaba el tipo de los tokens que tuviera como lexema algun numero

}