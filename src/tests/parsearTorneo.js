// src/tests/parsearTorneo.js
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { Lexer } from "../EstructuraDeScanner/lexer.js";
import { conjuntoDeConsumidores } from "../Consumidor/ConjuntoDeConsumidores.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ruta = process.argv[2] || path.resolve(__dirname, "../Entrada/entry.txt");
const texto = readFileSync(ruta, "utf8");

const lexer = new Lexer(texto);
const { tokens, errores } = lexer.analizarEntradaDeTexto();

if (errores.length) {
  console.log("Hay errores léxicos, deteniendo parseo.");
  console.table(errores);
  process.exit(1);
}

const torneo = conjuntoDeConsumidores(tokens);

console.log(`\nTorneo: ${torneo.nombreTorneo} — Sede: ${torneo.sede}`);
console.log(`Equipos esperados: ${torneo.cantEquiposEsperados}, declarados: ${torneo.equiposDelTorneo.size}\n`);

console.log("Equipos y jugadores:");
for (const [nom, eq] of torneo.equiposDelTorneo.entries()) {
  console.log(`- ${nom}: ${eq.jugadoresDelEquipo.length} jugadores`);
}

console.log("\nPartidos parseados:");
for (const p of torneo.partidosDelTorneo) {
  console.log(`  [${p.fase}] ${p.equipoLocal} ${p.golesEquipoLocal}-${p.golesEquipoVisitante} ${p.equipoVisitante}`);
}

console.log("\nTop goleadores (por equipo):");
for (const [nom, eq] of torneo.equiposDelTorneo.entries()) {
  const tops = [...eq.jugadoresDelEquipo].sort((a,b)=>b.cantidadGoles-a.cantidadGoles).slice(0,3);
  if (tops[0]?.cantidadGoles > 0) {
    console.log(`  ${nom} → ${tops.map(j=>`${j.nombre} (${j.cantidadGoles})`).join(", ")}`);
  }
}
