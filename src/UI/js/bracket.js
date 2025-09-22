// src/ui/js/bracket.js
import { asegurarTexto, obtenerTorneo, descargarPagina } from "./common.js";

function capitalizar(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

window.addEventListener("DOMContentLoaded", () => {
  // 1) Asegurar texto en localStorage
  let texto;
  try {
    texto = asegurarTexto();
  } catch (e) {
    alert("Primero carga un archivo .txt en la página principal.");
    console.error(e);
    return;
  }

  // 2) Obtener torneo (y errores si los hay)
  const { torneo, errores, parseError } = obtenerTorneo(texto);

  // 3) Asegurar <table> y <tbody>
  const table = document.getElementById("tbBrackets");
  if (!table) {
    console.error("No se encontró <table id='tbBrackets'> en el DOM.");
    return;
  }
  // si no hay <tbody>, crearlo
  const tb = table.tBodies[0] || table.appendChild(document.createElement("tbody"));

  // Logs de diagnóstico (puedes dejarlos mientras pruebas)
  console.log("[bracket] table:", table);
  console.log("[bracket] tbody:", tb);
  console.log("[bracket] torneo?:", !!torneo);

  // 4) Aviso si hubo errores léxicos o de parseo
  const main = document.querySelector("main") || document.body;
  if (errores?.length || parseError) {
    const aviso = document.createElement("p");
    aviso.className = "muted";
    aviso.textContent = parseError
      ? `Advertencia: no se pudo completar el parseo: ${parseError}`
      : `Advertencia: hay ${errores.length} error(es) léxico(s); se intentó continuar.`;
    main.insertBefore(aviso, table);
  }

  // 5) Render
  if (!torneo || !Array.isArray(torneo.partidosDelTorneo)) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="4">No hay datos de partidos para mostrar.</td>`;
    tb.appendChild(tr);
    return;
  }

  const ordenFase = { cuartos: 1, semifinal: 2, final: 3 };

  [...torneo.partidosDelTorneo]
    .sort((a, b) => ((ordenFase[a.fase] ?? 9) - (ordenFase[b.fase] ?? 9)))
    .forEach((p) => {
      const marcador = p.pendiente
        ? "Pendiente"
        : `${p.golesEquipoLocal}-${p.golesEquipoVisitante}`;

      let ganador = "-";
      if (!p.pendiente) {
        ganador =
          p.golesEquipoLocal > p.golesEquipoVisitante
            ? p.equipoLocal
            : p.golesEquipoLocal < p.golesEquipoVisitante
            ? p.equipoVisitante
            : "Empate";
      }

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${capitalizar(p.fase)}</td>
        <td>${p.equipoLocal} vs ${p.equipoVisitante}</td>
        <td>${marcador}</td>
        <td>${ganador}</td>
      `;
      tb.appendChild(tr);
    });

  // 6) Descargar HTML
  document.getElementById("btnDescargar")
    ?.addEventListener("click", () => descargarPagina("bracket.html"));
});
