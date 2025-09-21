// src/tests/parsearTorneo.js
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { Lexer } from "../EstructuraDeScanner/lexer.js";
import { conjuntoDeConsumidores } from "../Consumidor/ConjuntoDeConsumidores.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Permite: node src/tests/parsearTorneo.js [rutaOpcional]
const ruta = process.argv[2] || path.resolve(__dirname, "../Entrada/entry.txt");
const texto = readFileSync(ruta, "utf8");

// 1) LEXER
const lexer = new Lexer(texto);
const { tokens, errores } = lexer.analizarEntradaDeTexto();

if (errores.length) {
  console.log("Hay errores léxicos, deteniendo parseo.\n");
  console.table(errores);
  process.exit(1);
}

// 2) “PARSER” SECUENCIAL (CONSUMIDORES)
const torneo = conjuntoDeConsumidores(tokens);

// 3) IMPRESIÓN ORDENADA Y LIMPIA

console.log(`Torneo: ${torneo.nombreTorneo} — Sede: ${torneo.sede}`);
console.log(`Equipos esperados: ${torneo.cantEquiposEsperados}, declarados: ${torneo.equiposDelTorneo.size}\n`);

// Equipos (orden alfabético)
console.log("Equipos y jugadores:");
for (const [nom, eq] of [...torneo.equiposDelTorneo.entries()].sort((a, b) =>
  a[0].localeCompare(b[0], "es")
)) {
  console.log(`- ${nom}: ${eq.jugadoresDelEquipo.length} jugadores`);
}

console.log("\nPartidos parseados:");
// Orden de fases predecible
const ordenFase = { cuartos: 1, semifinal: 2, final: 3 };
for (const p of [...torneo.partidosDelTorneo].sort(
  (a, b) => (ordenFase[a.fase] ?? 99) - (ordenFase[b.fase] ?? 99)
)) {
  const marcador = p.pendiente ? "Pendiente" : `${p.golesEquipoLocal}-${p.golesEquipoVisitante}`;
  console.log(`  [${p.fase}] ${p.equipoLocal} ${marcador} ${p.equipoVisitante}`);
}

console.log("\nTop goleadores (por equipo):");
// Solo mostramos jugadores con >0 goles, top 3 por equipo
for (const [nom, eq] of [...torneo.equiposDelTorneo.entries()].sort((a, b) =>
  a[0].localeCompare(b[0], "es")
)) {
  const tops = [...eq.jugadoresDelEquipo]
    .filter((j) => j.cantidadGoles > 0)
    .sort((a, b) => b.cantidadGoles - a.cantidadGoles)
    .slice(0, 3);

  if (tops.length) {
    const linea = tops.map((j) => `${j.nombre} (${j.cantidadGoles})`).join(", ");
    console.log(`  ${nom} → ${linea}`);
  }
}
