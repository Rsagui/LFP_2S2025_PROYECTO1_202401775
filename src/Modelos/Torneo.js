import { Equipo } from "./Equipo.js";

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
            this.equiposDelTorneo.set(nombreDelEquipoABuscar, new Equipo(nombreDelEquipoABuscar));

        }
        
        //aseguro que si se guardo
        return this.equiposDelTorneo.get(nombreDelEquipoABuscar);

    }

    //Esta parte va a registrar un partido con las estadisticass

    aplicarPartido(partido){ //supongo que es un objeto partido

        //caso en donde el partido aparezca pendiente:
        if(partido.pendiente){
            this.partidosDelTorneo.push(partido);
            return
        }



        const equi1=this.asegurarEquipo(partido.equipoLocal);
        const equi2=this.asegurarEquipo(partido.equipoVisitante); 


        //si hubo aplicamos un partido es porque paso, entonces se suma para ambos equipos
        
        equi1.cantPartidosJugados++; equi2.cantPartidosJugados++;

        //estadisticas iniciales equipo local
        equi1.golesAFavor+=partido.golesEquipoLocal;
        equi1.golesEnContra+=partido.golesEquipoVisitante; 

        //estadisticas iniciales equipo visitante

        equi2.golesAFavor+=partido.golesEquipoVisitante;
        equi2.golesEnContra+=partido.golesEquipoLocal;

        //establece las victorias:
        if(partido.golesEquipoLocal>partido.golesEquipoVisitante) equi1.victorias++;
        else if(partido.golesEquipoLocal<partido.golesEquipoVisitante) equi2.victorias++;
        else{// en caso de haber empates, aunque creo que no pasaa} 
        }

        let rem1 = Number(partido.golesEquipoLocal)  || 0; // goles aún no justificados en E1
        let rem2 = Number(partido.golesEquipoVisitante) || 0;

        for (const infoGol of partido.infoGoles) {
        const enE1 = equi1.jugadoresDelEquipo.some(j => j.nombre === infoGol.jugadorNombre);
        const enE2 = equi2.jugadoresDelEquipo.some(j => j.nombre === infoGol.jugadorNombre);

        if (enE1 && !enE2) {
            const j = equi1.jugadoresDelEquipo.find(j => j.nombre === infoGol.jugadorNombre);
            j.cantidadGoles++; j.minutosDeGol.push(infoGol.minutoGol); rem1--;
        } else if (!enE1 && enE2) {
            const j = equi2.jugadoresDelEquipo.find(j => j.nombre === infoGol.jugadorNombre);
            j.cantidadGoles++; j.minutosDeGol.push(infoGol.minutoGol); rem2--;
        } else if (!enE1 && !enE2) {
            // Heurística: asigna al equipo que aún tiene goles por justificar
            if (rem1 > 0 && rem2 === 0) {
            rem1--;
            // opcional: crear “placeholder” para que aparezca en tops
            let j = equi1.jugadoresDelEquipo.find(j => j.nombre === infoGol.jugadorNombre);
            if (!j) {
                j = { nombre: infoGol.jugadorNombre, posicion: "DESCONOCIDA", numero: 0, edad: 0, cantidadGoles: 0, minutosDeGol: [] };
                equi1.jugadoresDelEquipo.push(j);
            }
            j.cantidadGoles++; j.minutosDeGol.push(infoGol.minutoGol);
            } else if (rem2 > 0 && rem1 === 0) {
            rem2--;
            let j = equi2.jugadoresDelEquipo.find(j => j.nombre === infoGol.jugadorNombre);
            if (!j) {
                j = { nombre: infoGol.jugadorNombre, posicion: "DESCONOCIDA", numero: 0, edad: 0, cantidadGoles: 0, minutosDeGol: [] };
                equi2.jugadoresDelEquipo.push(j);
            }
            j.cantidadGoles++; j.minutosDeGol.push(infoGol.minutoGol);
            } else {
            // Ambigüedad: aún no sabemos a quién asignarlo sin arriesgar incoherencia
            console.warn(`Gol no asignado por falta de plantel y ambigüedad: ${infoGol.jugadorNombre} (min ${infoGol.minutoGol}) en ${partido.equipoLocal} vs ${partido.equipoVisitante}`);
            }
        } else {
            // enE1 && enE2: mismo nombre en ambos equipos — señal de datos sucios
            throw new Error(`Ambigüedad: ${infoGol.jugadorNombre} aparece en ambos equipos`);
        }
        }
        //sin importar lo que pase, alguno de los equipos se queda  eliminado en esta fase
        equi1.faseAlcanzada=capitalizar(partido.fase);
        equi2.faseAlcanzada=capitalizar(partido.fase);

        this.partidosDelTorneo.push(partido);
    }
}

//la entradaa deben se ser cadenas que signifiquen una fase de eliminacion que llego algun equipo
export function capitalizar(cadenaDeFase){

    //si tiene contenido dentro la cadena fase, tenemos 2 opciones
    //1) separar la primer letra, volverla mayucula y concatenar con lo restante de la cadena y enviar la cadenaFase vacia
    return cadenaDeFase? cadenaDeFase.charAt(0).toUpperCase()+cadenaDeFase.slice(1): cadenaDeFase;

}

function normalizaFase(fase) {
  return (fase || "").toLowerCase();
}

function faseSiguiente(fase) {
  switch (normalizaFase(fase)) {
    case "cuartos": return "Semifinal";
    case "semifinal": return "Final";
    case "final": return "Campeón"; // opcional
    default: return "-";
  }
}

function actualizarFaseAlcanzada(equipo, fase, gano) {
  if (!equipo) return;
  if (gano) {
    equipo.faseAlcanzada = faseSiguiente(fase);
  } else {
    // solo marca la fase actual si no se le había asignado algo mayor
    if (!equipo.faseAlcanzada) {
      equipo.faseAlcanzada = capitalizar(fase);
    }
  }
}