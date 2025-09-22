import { asegurarTexto, obtenerTorneo, descargarPagina } from "./common.js";
const { torneo } = obtenerTorneo(asegurarTexto());
const tb = document.querySelector("#tb tbody");

// Totales
const partidos = torneo.partidosDelTorneo || [];
const jugados = partidos.filter(p=>!p.pendiente).length;
const programados = partidos.length;
const totalGoles = partidos.reduce((s,p)=> s + (p.pendiente?0:(p.golesEquipoLocal||0)+(p.golesEquipoVisitante||0)), 0);
const promedio = jugados ? (totalGoles/jugados) : 0;

// Edad promedio
let sumaEdad=0, conteo=0;
for (const eq of torneo.equiposDelTorneo.values()){
  for (const j of eq.jugadoresDelEquipo){ if (j.edad!=null) { sumaEdad+=Number(j.edad); conteo++; } }
}
const edadProm = conteo ? (sumaEdad/conteo) : 0;

// Fase actual (si hay TBD o Pendiente en Final → Semifinal; si no, Final; si no existe final, según la mayor fase jugada)
const hayTBD = partidos.some(p => p.equipoLocal==="TBD" || p.equipoVisitante==="TBD");
const hayPendFinal = partidos.some(p => p.fase==="final" && p.pendiente);
const faseActual = (partidos.some(p=>p.fase==="final") && !(hayTBD || hayPendFinal)) ? "Final"
                  : (partidos.some(p=>p.fase==="semifinal")) ? "Semifinal"
                  : (partidos.some(p=>p.fase==="cuartos")) ? "Cuartos" : "-";

function fila(k,v){
  const tr = document.createElement("tr");
  tr.innerHTML = `<td>${k}</td><td>${v}</td>`;
  tb.appendChild(tr);
}

fila("Nombre del Torneo", torneo.nombreTorneo);
fila("Sede", torneo.sede);
fila("Equipos Participantes", torneo.equiposDelTorneo.size);
fila("Total de Partidos Programados", programados);
fila("Partidos Completados", jugados);
fila("Total de Goles", totalGoles);
fila("Promedio de Goles por Partido", promedio.toFixed(2));
fila("Edad Promedio de Jugadores", `${edadProm.toFixed(2)} años`);
fila("Fase Actual", faseActual);

document.getElementById("btnDescargar").addEventListener("click", ()=> descargarPagina("info_general.html"));
