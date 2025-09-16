export class Equipo{
    constructor(nombreEquipo){

        this.nombreEquipo=nombreEquipo;

        this.jugadoresDelEquipo=[];

        //datos basicos de los equipos:

        this.cantPartidosJugados=0;
        this.victorias=0;
        this.derrotas=0;
        this.golesAFavor=0;
        this.golesEnContra=0;
        this.faseAlcanzada=null;// "Cuartos", "Semifinal", "Final"…

    }

    agregarUnJugadorAlEquipo(jugador){ //un objeto jugador claramente
        this.jugadoresDelEquipo.push(jugador)

    }
}