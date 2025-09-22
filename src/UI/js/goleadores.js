import { asegurarTexto, obtenerTorneo, descargarPagina } from "./common.js";
const { torneo } = obtenerTorneo(asegurarTexto());
const tb = document.querySelector("#tb tbody");

// lista [ { jugador, equipo, goles, minutos[] } ]
const lista = [];
for (const [nom, eq] of torneo.equiposDelTorneo.entries()){
  for (const j of eq.jugadoresDelEquipo){
    if ((j.cantidadGoles||0) > 0){
      lista.push({ jugador:j.nombre, equipo:nom, goles:j.cantidadGoles, minutos:(j.minutosDeGol||[]) });
    }
  }
}
// “de mayor a menor; si empata deja el orden de aparición”
lista.sort((a,b)=> b.goles - a.goles);

let pos = 1;
lista.forEach((r,i)=>{
  const tr = document.createElement("tr");
  tr.innerHTML = `<td>${pos++}</td><td>${r.jugador}</td><td>${r.equipo}</td><td>${r.goles}</td><td>${r.minutos.join(", ")}${r.minutos.length?"'":""}</td>`;
  tb.appendChild(tr);
});

document.getElementById("btnDescargar").addEventListener("click", ()=> descargarPagina("goleadores.html"));
