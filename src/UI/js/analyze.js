import {asegurarTexto,descargarPagina,obtenerTokensYErrores} from "./common.js"


//este archivo se dedica a poner los tokens en una tabla
const texto=asegurarTexto(); //garantizamos que exista algo para trabajar
const {tokens, errores}=obtenerTokensYErrores(texto);//esta funcion invoca al lexer y crea una lista con tokens y errores
//tabla de tokens

const tablaTok=document.querySelector("#tablaTokens tbody"); //accedo a la tabla de tokens y voy al cuerpo de la tabla dond estan los datos
//por cada token de la lista, creo un objeto token=t y su idice i
tokens.forEach((t,i)=>{
    //creo una fila
    const tr=document.createElement("tr");
    
    //le meto celdas a la fila:
    tr.innerHTML=`<td>${i}</td><td>${JSON.stringify(t.lexema)}</td><td>${t.tipo}</td><td>${t.fila}</td><td>${t.columna}</td>`;

    //ingreso el contenido a la tabla
    tablaTok.appendChild(tr);
}
)

//tabla de errores
const tablaErr=document.querySelector("#tablaErrores tbody");

errores.forEach((e,i)=>{

    const tr=document.createElement("tr");

    tr.innerHTML=`<td>${i}</td><td>${JSON.stringify(e.error)}</td><td>${e.tipo}</td><td>${e.descripcion}</td><td>${e.filaDeError}</td><td>${e.colError}</td>`;
    tablaErr.appendChild(tr);
});

//añadir funcionalidad al boton de descargar:

//usamos una funcion del commonjs
document.getElementById("btnDescargar").addEventListener("click",()=>descargarPagina("tokens_y_errores.html"));



