// ------------- ELIMINACION { fases: [ partidos ] ... } --------------------
import {Partido} from "../Modelos/Partido"



//TStream es un onjeto flujo de tokes y torneo es un objeto torneo
export function consumirBloqueEliminacion(TStream,torneo){





}


//TStream=flujoDeTokens y torneo son objetos, fase es una variable que me servira para la construccion de otro objeto
function cosumirListaDePartidos(TStream,torneo,fase){

    while(TStream.seraQueTerminamosLaLista() && TStream.verQueHayEnLaLista()!=="]"){

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
        marcador=TStream.tipoEsperado("Marcador").lexema;

        //marcador con goles de cada equipo:
        //separo por el guion, llano n a esos datos ailasdos y los mapeo esos datos aislados. Y lo guardo en esta variable tipo lista de tamaño 2
        const [golesE1,golesE2]=marcador.split("-").map(n=>Number(n));


        //ahora en el parseo toca los registros de gol:

        let goles=[];

        //esto es propio del bloque que es sobre los goleadores
        //lo que separa los goleadores de los resultados, es una coma
        if(TStream.verQueHayEnLaLista() && TStream.verQueHayEnLaLista().lexema===","){
            TStream.siguienteEnLaLista();//consumo la coma despues del resultado
            TStream.palabraReservadaEsperada("goleadores");//se consume el token y avanzo
            TStream.lexemaEsperado(":");
            //inicio goleadores
            TStream.lexemaEsperado("[");
            TStream.consumidorDeBloqueGoleadores(TStream,equi1,equi2); //funcion explicada abajo pero es para todo el bloque que habla de los goleadores
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
        
        //los partidos tienen un atributo que es una lista para guardar info de goles

        //Entonces voy a iterar sobre la lista que hice
        for(const gol of goles) partidoNuevo.agregarInfoGol(gol);
        //Esto es un metodo de torneo que aplica un partido a una lista y hace una serie de validaciones y registros
        torneo.aplicarPartido(partidoNuevo);
        
    }
}