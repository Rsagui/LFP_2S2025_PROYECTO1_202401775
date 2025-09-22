import { Lexer } from "../../EstructuraDeScanner/lexer.js";
import {conjuntoDeConsumidores} from "../../Consumidor/ConjuntoDeConsumidores.js"

//agarro los elementos del html

const textArea=document.getElementById("vistaArchivo");
const btnCargar = document.getElementById("btnCargar");
const btnBorrar=document.getElementById("btnBorrar");

//vamos a guardar/leer el texto en un discoduro del navegador para poder compartir info entre paginas

export function guardarTextoEntrada(txt){

    //guardo localmente en el navegador y le asigno tal nomombre
    localStorage.setItem("textoEntrada",txt);

}

export function leerTextoEntrada(){
    //en caso de estar vacia ,devolvemos un string sin nada
    return localStorage.getItem("textoEntrada") || "";
}

//evitamos hacer cualquier cosa si no tenemos almacenado en el disco el texto
export function asegurarTexto(){
    const texto = leerTextoEntrada();
    if(!texto){ alert("Primero carga un archivo .txt en la página principal.");throw new Error("Sin texto"); }
    return texto;
}

//logica para exportar pagina

export function descargarPagina(nombre="reporte.html"){
    //tomo todo el archivo html existente
    const html="<!doctype html>\n" + document.documentElement.outerHTML;

    //archivo binario donde este la info 
    //Lo del type es para que el navegador sepa que este archvio es de tipo ágina web
    const blob=new Blob([html],{type:"text/html"});

    //elace para descarga
    //Es como la etiqueta de los html, dedicados descargas. EL href hace referencia a la direccion del objeto blob y en dowland le hago una sugerencia de nombre
    const a=Object.assign(document.createElement("a"),{href:URL.createObjectURL(blob),download:nombre});
    document.body.appendChild(a); //agrego al dom enlace
    a.click(); // un click sobre esta forza la descar
    a.remove(); //inmediatamente se elimina para no ensuxiar el dom

}  

//boton para cargar ahivo

if(btnCargar){
    //Escuchado de eventos, para cuando se haga click. se llame a esta funcion
    btnCargar.addEventListener("click",()=>{
        //se crea un elemento input y se xonfigura de una vez, es de tipo archivo y accept me dice que solo prioriza archivos de texto plano
        const input = Object.assign(document.createElement("input"), {type:"file", accept:".txt,text/plain"});

        //por experiencia de usuario esta funcion sera asincronica, sin pausar la ejecucion de la pagina
        input.onchange=async()=>{
            //accedo al primer archivo seleccionado
            const file=input.files?.[0];
            if(!file) return; //en casp de no selecionar nada
            const text=await file.text(); //se sigue con el programa hasta que se resuelva esta promesa,  o sea que se cargue el archivo
            textArea.value=text; //el valor del panel con el texto, va a cambiar, ahora será 
            guardarTextoEntrada(text); //guardamos el texto en un objeto del navegador, acordate, le pone el nombte textoEntrada
        };
        input.click(); //es el click invivsible para que ejecute todo
    });
}

//boton borrar:

if(btnBorrar){
    btnBorrar.addEventListener("click",()=>{
        localStorage.removeItem("textoEntrada"); //asi le puso en el disco duro del navegador
        textArea.value=""; //por lo tanto reescribimos el valor de ese panel 
    });
}

//en case de haber texto guardado, rellenamos el panel:

if(textArea){
    const text=leerTextoEntrada()//leemos lo que guarde en guardarTextoEntrada(text);
    if(text) textArea.value=text;
}

//Navegacion para los reporte
function go(pagina){window.open(`../ui/${pagina}`, "_blank")} //el argumento blank es para que se abra en una pagina en blanco

//acciones de botoens

document.getElementById("btnAnalizar")?.addEventListener("click",()=>go("analizar.html"));
document.getElementById("btnBracket")?.addEventListener("click",()=>go("bracket.html"));
document.getElementById("btnEquipos") ?.addEventListener("click", ()=> go("equipos.html"));
document.getElementById("btnGoleadores")?.addEventListener("click", ()=> go("goleadores.html"));
document.getElementById("btnInfo")      ?.addEventListener("click", ()=> go("info.html"));


export function obtenerTokensYErrores(texto){
    const lexer=new Lexer(texto);
    return lexer.analizarEntradaDeTexto(); //parte de los tokens y errores. esto me devuele los tokens y los errores

}

export function obtenerTorneo(texto){
  const { tokens, errores } = obtenerTokensYErrores(texto);
  let torneo = null;
  let parseError = null;
  try {
    torneo = conjuntoDeConsumidores(tokens); // orquestador TORNEO->EQUIPOS->ELIMINACION
  } catch (e) {
    parseError = e instanceof Error ? e.message : String(e);
  }
  return { errores, torneo, parseError };
}