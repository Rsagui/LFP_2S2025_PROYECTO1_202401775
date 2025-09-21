// ------------- ELIMINACION { fases: [ partidos ] ... } --------------------
import {Partido} from "../Modelos/Partido.js"
import { consumirBloqueEquipos, consumirNumero } from "./consumidorBloqueEquipos.js";
import {Gol} from "../Modelos/Gol.js"

//TStream es un onjeto flujo de tokes y torneo es un objeto torneo
export function consumirBloqueEliminacion(TStream,torneo){

    //Esto es lo que cierra los bloques de elimiaciones
    while(!TStream.seraQueTerminamosLaLista() && TStream.verQueHayEnLaLista().lexema!=="}"){

        const token=TStream.verQueHayEnLaLista();

        //aca solo estoy viendo que lo que siguie en la lista tiene coherencia respecto al formato
        if(token.lexema==="cuartos"|| token.lexema==="semifinal"|| token.lexema==="final"){
            const fase=TStream.siguienteEnLaLista().lexema;//consume la fase de la que me esta hablando

            TStream.lexemaEsperado(":");
            TStream.lexemaEsperado("[");

            //ahora sigue la laista de partidos:

            consumirListaDePartidos(TStream,torneo,fase);
            TStream.lexemaEsperado("]")

            //aca se consumen las comas que separan las fases:

            if(TStream.verQueHayEnLaLista() && TStream.verQueHayEnLaLista().lexema===","){
                TStream.siguienteEnLaLista();//se consume la coma

            }
        }
        //en caso en que estemos en la coma

        else if(token.lexema===","){
            TStream.siguienteEnLaLista();
        }
        else{
            TStream.throwError("Se esperaba una fase (cuartos|semifinal|final) o '}'",token);
        }
    }
}


//TStream=flujoDeTokens y torneo son objetos, fase es una variable que me servira para la construccion de otro objeto
function consumirListaDePartidos(TStream,torneo,fase){

    while(!TStream.seraQueTerminamosLaLista() && TStream.verQueHayEnLaLista().lexema!=="]"){

        TStream.palabraReservadaEsperada("partido");//se consume el token y se avanza
        TStream.lexemaEsperado(":");

        //parseo de los equipos que jugaron

        const equi1=TStream.tipoEsperado("Cadena").lexema; //me devuelde el lexema del token con tipo cadena, que debe ser el nombre del equipo
        TStream.palabraReservadaEsperada("vs");//se consume el token con el lexema de la palabra reservadad y se avanzaa
        const equi2=TStream.tipoEsperado("Cadena").lexema;

        //debe seguir el parseo del resultado:

        TStream.lexemaEsperado("[");
        TStream.palabraReservadaEsperada("resultado");
        TStream.lexemaEsperado(":");
        //En mi lexeer yo creaba objetos tokens con la posibilidad de tener como tipo de lexema:marcador
        //hay que tomar en cuenta que el marcador puede ser 3-2, pendiente o empate
        //un resultado empate lo desarollaremos desúes

        let golesE1=null,golesE2=null,esPendiente=false;

        const TRes=TStream.verQueHayEnLaLista();

        //caso donde si exista un marcador
        if(TRes && TRes.tipo==="Marcador"){

            const marcador = TStream.tipoEsperado("Marcador").lexema;
            [golesE1, golesE2] = marcador.split("-").map(n => Number(n));
        }

        else if(TRes && TRes.tipo==="Cadena" && TRes.lexema==="Pendiente"){
            TStream.tipoEsperado("Cadena"); // consume "Pendiente"
            esPendiente=true;
        }
        
        else{
            TStream.throwError('Se esperaba Marcador o "Pendiente',TRes)
        }


        //ahora en el parseo toca los registros de gol:

        let goles=[];

        //esto es propio del bloque que es sobre los goleadores
        //lo que separa los goleadores de los resultados, es una coma.
        //Pero si es penddiente no va a existir.
        if(!esPendiente && TStream.verQueHayEnLaLista() && TStream.verQueHayEnLaLista().lexema===","){
            TStream.siguienteEnLaLista();//consumo la coma despues del resultado
            TStream.palabraReservadaEsperada("goleadores");//se consume el token y avanzo
            TStream.lexemaEsperado(":");
            //inicio goleadores
            TStream.lexemaEsperado("[");
            goles=consumidorDeBloqueGoleadores(TStream,equi1,equi2); //funcion explicada abajo pero es para todo el bloque que habla de los goleadores
            //fin goleadores
            TStream.lexemaEsperado("]");
        }
        //signo quue indica que la info del partido termina
        
        TStream.lexemaEsperado("]");

        //si existen mas partidos, son separado por comas

        if(TStream.verQueHayEnLaLista() && TStream.verQueHayEnLaLista().lexema===","){
            TStream.siguienteEnLaLista();//se consume esa coma
        }

        //Se registra un partido
        const partidoNuevo=new Partido(fase, equi1,equi2,golesE1,golesE2);
        partidoNuevo.pendiente=esPendiente;
        //los partidos tienen un atributo que es una lista para guardar info de goles

        //Entonces voy a iterar sobre la lista que hice
        for(const gol of goles) partidoNuevo.agregarInfoGol(gol);
        //Esto es un metodo de torneo que aplica un partido a una lista y hace una serie de validaciones y registros
        torneo.aplicarPartido(partidoNuevo);
        
    }
}

///dedicado al apartado de quines metieron gol
function consumidorDeBloqueGoleadores(TStream,equi1,equi2){
    const goles=[];

    while(!TStream.seraQueTerminamosLaLista() && TStream.verQueHayEnLaLista().lexema!=="]"){
        TStream.palabraReservadaEsperada("goleador");
        TStream.lexemaEsperado(":");
        //tomamos el lexema si el tipo del token en donde estamos es una cadena
        const nombreJugador=TStream.tipoEsperado("Cadena").lexema;

        //despues de haber consumido tal token,llegamos cuadno nos dicen el minuto

        TStream.lexemaEsperado("[");
        //Este metodo tambien icluye el salto del token de ":"
        const minutoDeGol=consumirNumero(TStream,"minuto"); //me devuele el lexema, o sea el minuto de cuando fue el gol
        TStream.lexemaEsperado("]");

        //asignacion del gol:
        const gol=new Gol(nombreJugador,null, Number(minutoDeGol)); //este null es porque voy a asginarle su equipo despues, para no estar mezclando operaciones
        gol.equipoDelJugador=null;
        goles.push(gol);

        //cada registro de gol esta separado por una coma 

        if(TStream.verQueHayEnLaLista() && TStream.verQueHayEnLaLista().lexema===",") TStream.siguienteEnLaLista();
    }
     // Nota: la asociación jugador→equipo exacta requiere conocer planteles.
    // Si quieres resolver aquí, pasa un callback o el objeto torneo, y busca por nombre del jugador.

    return goles;


}