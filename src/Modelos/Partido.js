export class Partido{
    constructor(
        fase,
        equipoLocal,
        equipoVisitante,
        golesEquipoLocal, //es el equipo local
        golesEquipoVisitante//es el equipo visitante
    ){

        this.fase=fase;
        this.equipoLocal=equipoLocal;
        this.equipoVisitante=equipoVisitante;
        this.golesEquipoLocal=Number(golesEquipoLocal);
        this.golesEquipoVisitante=Number(golesEquipoVisitante);
        this.infoGoles=[];//una lista que almcaena objetos gol
        //Los objetos gol me dicen->el que marco "jugador", su equipo y el minuto
    }

    agregarInfoGol(infoGol){ //aca se mete un objeto gol
        this.infoGoles.push(infoGol);

    }


}