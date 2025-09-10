//Conjunto base que para pertenecer se deben cumplir una serie de filtros
class Token{
    constructor(lexema,tipo,fila,columna){

        this.lexema=lexema;
        this.tipo=tipo;
        this.fila=fila;
        this.columna;
    }
}

//Palabras reservadas:
/*
Atenccion,falta reconer un marcadot tipo 3-1 como un token:marcador
En este ejemplo que me dio mi auxiliar lo considero una cadena

*/
export const PALABRAS_RESERVADAS=[

    "TORNEO",
    "EQUIPOS",
    "ELIMINACION",
    "equipo",
    "jugador",
    "resultado",
    "partido",
    "resultado",
    "goleador"
];

export const ATRIBUTOS_VALIDOS=[
    "nombre",
    "sede",
    "equipos",
    "posicion",
    "numero",
    "edad",
    "cuartos",
    "semifinal",
    "final",
    "vs",
    "goleadores",
    "minuto"
];

