import { asegurarTexto, obtenerTorneo, descargarPagina } from "./common.js";

const { torneo } = obtenerTorneo(asegurarTexto());
const tb = document.querySelector("#tb tbody");

//accedo a la lista de equipos del torneoy guardo un par. El nombre del equipo y el mismo objeto equipo
for (const [nom, eq] of torneo.equiposDelTorneo.entries()){
  const pj = eq.cantPartidosJugados || 0;
  const g  = eq.victorias || 0;
  const p  = Math.max(0, pj - g); // sin empates en este formato
  const gf = eq.golesAFavor || 0;
  const gc = eq.golesEnContra || 0;
  const dg = gf - gc;
  const fase = eq.faseAlcanzada || eq.faseAlcanzadada || "-"; // según el modelo
  const tr = document.createElement("tr");
  tr.innerHTML = `<td>${nom}</td><td>${pj}</td><td>${g}</td><td>${p}</td><td>${gf}</td><td>${gc}</td><td>${dg>=0?`+${dg}`:dg}</td><td>${fase}</td>`;
  tb.appendChild(tr);
}
document.getElementById("btnDescargar").addEventListener("click", ()=> descargarPagina("estadisticas_equipos.html"));
