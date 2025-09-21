export class Torneo{
    constructor(nombreTorneo,sede,cantEquiposEsperados){

        this.nombreTorneo=nombreTorneo;
        this.sede=sede;
        this.cantEquiposEsperados=Number(cantEquiposEsperados);
        this.equiposDelTorneo=new Map(); //aca iraon objetos equipos
        this.partidosDelTorneo=[]; //objeto partido

        /**
         Atencion, nosotros usaremos map porque:
         El Map es la estructura ideal para este caso donde necesitas:

        Buscar equipos frecuentemente por nombre

        Mantener una colección sin duplicados

        qAcceso rápido a los elementos
         
         */


    }

    asegurarEquipo(nombreDelEquipoABuscar){

        if(!this.equiposDelTorneo.has(nombreDelEquipoABuscar)){

            //Si no existe un equipo, lo creamos y si no, nosotros no permitimos que exista duplicadoss
            this.equiposDelTorneo.set(nombre, new Equipo(nombreDelEquipoABuscar));

        }
        
        //aseguro que si se guardo
        return this.equiposDelTorneo.get(nombreDelEquipoABuscar);

    }

    //Esta parte va a registrar un partido con las estadisticass

    aplicarPartido(partido){ //supongo que es un objeto partido

        const equi1=this.asegurarEquipo(partido.equipoLocal);
        const equi2=this.asegurarEquipo(partido.equipoVisitante); 


        //si hubo aplicamos un partido es porque paso, entonces se suma para ambos equipos
        
        equi1.cantPartidosJugados++; equi2.cantPartidosJugados++;

        //estadisticas iniciales equipo local
        equi1.golesAFavor=partido.golesEquipoLocal;
        equi1.golesEnContra=partido.golesEquipoVisitante; 

        //estadisticas iniciales equipo visitante

        equi2.golesAFavor=partido.golesEquipoVisitante;
        equi2.golesEnContra=partido.golesEquipoLocal;

        //establece las victorias:
        if(equi1.golesAFavor>equi2.golesAFavor) equi1.victorias++;
        else if(equi1.golesAFavor<equi2.golesAFavor) equi2.victorias++;
        else{// en caso de haber empates, aunque creo que no pasaa} 
        }

        //Estoy recorriendo una lista de objetos gol
        for(const infoGol in partido.infoGoles){

            //si es cierto la comparacion, el equipo es igual al equipo 2 y si no, entonce igual al equi´po
            const equipoGol=(infoGol.equipoDelJugador===equi1.nombreEquipo)? equi1: equi2;

            //Itero sobre la lista de jugadores del equipo hasta encontrar el nombre del jugador que conincida con el jugador que metio el gol de infoGol
            const jugadorGol=equipoGol.jugadoresDelEquipo.find(j=>j.nombre===infoGol.jugadorNombre);

            if(jugadorGol){

                jugadorGol.cantidadGoles++; //si llegamos hasta aca, es porque este es el jugador que metio el gol
                jugadorGol.minutosDeGol.push(infoGol.minutoGol);//los jugadoress tienen una lista, con cada minuto en donde han metido gol
            }
        }
        //sin importar lo que pase, alguno de los equipos se queda  eliminado en esta fase
        equi1.faseAlcanzadada=capitalizar(partido.fase);
        equi2.faseAlcanzadada=capitalizar(partido.fase);

        this.partidosDelTorneo.push(partido);
    }
}

//la entradaa deben se ser cadenas que signifiquen una fase de eliminacion que llego algun equipo
function capitalizar(cadenaDeFase){

    //si tiene contenido dentro la cadena fase, tenemos 2 opciones
    //1) separar la primer letra, volverla mayucula y concatenar con lo restante de la cadena y enviar la cadenaFase vacia
    return cadenaDeFase? cadenaDeFase.charAt(0).toUpperCase()+cadenaDeFase.slice(1): cadenaDeFase;

}