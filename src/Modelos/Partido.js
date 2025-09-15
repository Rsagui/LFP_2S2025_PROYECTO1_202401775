export class Partido{
    constructor(
        fase,
        equipo1,
        equipo2,
        golesEquipo1, //es el equipo local
        golesEquipo2 //es el equipo visitante
    ){

        this.fase=fase;
        this.equipo1=equipo1;
        this.equipo2=equipo2;
        this.golesEquipo1=Number(golesEquipo1);
        this.golesEquipo2=Number(golesEquipo2);
        this.infoGoles=[];//una lista que almcaena objetos gol
        //Los objetos gol me dicen->el que marco "jugador", su equipo y el minuto
    }

    agregarInfoGol(infoGol){ //aca se mete un objeto gol
        this.agregarInfoGol.push(infoGol);

    }


}