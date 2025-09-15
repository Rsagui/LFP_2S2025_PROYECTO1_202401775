import { Lexer } from "../EstucturaDeScanner/lexer.js";


import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ruta = process.argv[2] || path.resolve(__dirname, "../Entrada/entry2E.txt");
const texto = readFileSync(ruta, "utf8");


const lexer = new Lexer(texto);
const resultado = lexer.analizarEntradaDeTexto();

console.log("\nTokens encontrados");
console.table(resultado.tokens.map((t, i) => ({
  "#": i, lexema: JSON.stringify(t.lexema), tipo: t.tipo, fila: t.fila, columna: t.columna
})));

console.log("\nErrores encontrados");
console.table(resultado.errores.map((e, i) => ({
  "#": i, error: JSON.stringify(e.error), tipo: e.tipo, descripcion: e.descripcion,
  fila: e.filaDeError, columna: e.colError
})));