import { Token, PALABRAS_RESERVADAS, ATRIBUTOS_VALIDOS, TIPOS_DE_SIMBOLOS } from "./token.js";

export class Lexer{
    constructor(entradaDeTexto){    

        this.entradaDeTexto=entradaDeTexto; //entradaDeeTexto=ET
        this.posicionActualEnLaET=0;
        this.filaEnLaET=1;
        this.columanaEnLaET=1;

        this.listaDeTokensEncontrados=[];
        this.listaDeErroresEncontrados=[];

        /*
        
        Todos los automatas infinitos van a iniciar en el estado INCIAL
        
        */ 
        this.estadoActualDelAutomata="INICIAL";
        this.buffer="";
        this.columaDeInicio=1;
    }    

    //Análisis lexico
    analizarEntradaDeTexto(){
        //Me detengo hasta que la posicion actual sea igual  al tamaño de la entrada de texto
        while(this.posicionActualEnLaET<this.entradaDeTexto.length){

            //Recorro caracter por caracter
            let charActual=this.entradaDeTexto[this.posicionActualEnLaET];

            if(this.estadoActualDelAutomata==="INICIAL"){

                if(charActual===" "||charActual==="\t"){ //Ignoramos espacios y tabulaciones

                    //A pesar que las ignoramos, debemos avanzar de posicion
                    this.avanzarDePosicion();
                    continue; //Se sigue iterando no puedo parar
                }

                if(charActual==="\n"){
                    this.filaEnLaET++; //Un salto de linea aumenta la fila
                    this.columanaEnLaET=1; //Y la columna se reinicia
                    this.posicionActualEnLaET++; //Avanzo de posicion en la entrada de texto
                    continue; //Se sigue iterando no puedo parar
                }

                if(this.esLetraELCaracter(charActual)){
                    this.estadoActualDelAutomata="IDENT" //cambia el estado a IDENT
                    this.buffer=""; // teorimacembnte el buffer me permite almacenar los caracteres
                    this.columaDeInicio=this.columanaEnLaET //guardo la columna de inicio 
                }    
                
                if(this.esDigitoElCaracter(charActual)){
                    this.estadoActualDelAutomata="NUM"; //cambiamos el estado a numero
                    this.buffer="";
                    this.columanaDeInicio=this.columanaEnLaET;
                    continue;
                }

                if(charActual==='"'){ // o sea si encontramos una comilla significa que se viene un string

                    this.estadoActualDelAutomata="CADENA";
                    this.buffer=""; //aca se va a almcenar la cadena
                    this.columaDeInicio=this.columanaEnLaET;
                    this.avanzarDePosicion(); //No quiero guardar la comilla inicial
                    continue;

                }

                if(Object.keys(TIPOS_DE_SIMBOLOS).includes(charActual)){ //Estoy accediendo al diccionario de la clase de token y compara si char coincide con  alguna de sud llaves

                    this.listaDeTokensEncontrados.push(new Token(charActual, //El char en si es el lexema
                        TIPOS_DE_SIMBOLOS[charActual], //El tipo es la frase asosiada al llave del diccionario
                        this.filaEnLaET,
                        this.columanaEnLaET));
                    
                    this.avanzarDePosicion();
                    continue;
                }
                
                //Si nada pasa ese filtro entonces es invalido el token

                this.agregarError(charActual, "Token Invalido", "Este lexer no es capaz de enconntrar estos caracteres");
                this.avanzarDePosicion();
            }
            //Guardar el identificador:
            else if(this.estadoActualDelAutomata==="IDENT"){
                if(this.esLetraELCaracter(this.entradaDeTexto[this.posicionActualEnLaET])){
                    this.buffer+=this.entradaDeTexto[this.posicionActualEnLaET];//Es decir el budder recibe el caracter actual, asi retroalimentandose
                    this.avanzarDePosicion();

                } else{

                    this.agregarTokenIdent(this.buffer, this.columaDeInicio) //esto es porque necesitamos clasificar el token
                    this.estadoActualDelAutomata="INICIAL" //vuelvo para reconocer otros estados

                }


            }
            else if(this.estadoActualDelAutomata==="NUM"){
                if(this.esDigitoElCaracter(this.entradaDeTexto[this.posicionActualEnLaET])){
                    this.buffer+=this.entradaDeTexto[this.posicionActualEnLaET];
                    this.avanzarDePosicion();
                    
                }else{

                    this.listaDeErroresEncontrados.push(new Token(this.buffer,"Número",this.filaEnLaET, this.columanaEnLaET));
                    this.estadoActualDelAutomata="INICIAL"

                }
            }

            else if(this.estadoActualDelAutomata==="CADENA"){
                if(this.entradaDeTexto[this.posicionActualEnLaET]==='"'){//Es decir encontre la comilla de cierre
                    this.listaDeTokensEncontrados.push(new Token(this.buffer,"Cadena",this.filaEnLaET,this.columanaDeInicio));
                    this.avanzarDePosicion();
                    this.estadoActualDelAutomata="INICIAL";
                } else if(this.posicionActualEnLaET>=this.entradaDeTexto.length){ //Si pasa esto es porque no existe una comilla de ciere
                    this.agregarError(this.buffer,"Token invalido","No existe una comilla de cierre");
                    this.estadoActualDelAutomata="INICIAL";

                } else{

                    this.buffer+=this.entradaDeTexto[this.posicionActualEnLaET]; //voy caoncatedando las letrad que formna la cadena va vos 
                    this.avanzarDePosicion();
                }


            }
        }

        return {tokens:this.listaDeTokensEncontrados, errores:this.listaDeErroresEncontrados};
    }

    agregarTokenIdent(lexema,columnaInicio){

        if(PALABRAS_RESERVADAS.includes(lexema)){

            this.listaDeTokensEncontrados.push(new Token(lexema,"Palabra Reservada",this.filaEnLaET,columnaInicio));
        
        }else if(ATRIBUTOS_VALIDOS.includes(lexema)){

            this.listaDeTokensEncontrados.push(new Token(lexema,"Atributo valido",this.filaEnLaET,columnaInicio));

        } else{

            this.agregarError(lexema,"Token no valido","Identificador no permmitido",columnaInicio);
        }


    }

    agregarError(lexema,tipo,descripcion, col=this.columanaEnLaET){

        this.listaDeErroresEncontrados.push({
            error:lexema,
            tipo,
            descripcion, 
            filaDeError:this.filaEnLaET,
            colError:col });
        //La nomenclatura anterior me permite no siempre mandar esos argumentos a la funcion
    }


    //============= Helpers para la validacion de info=====

    esLetraELCaracter(char){

        return (char>="A" && char<="Z") || (char>="a" && char<="z") || char==="_";

    }

    esDigitoElCaracter(char){

        return char>="0" && char<="9";

    }

    esTipoDeSimbolo(char){
        //Este diccionario me daba sus nombres respeccto al signp
        if(char==="{") return TIPOS_DE_SIMBOLOS["{"];
        if(char==="}") return TIPOS_DE_SIMBOLOS["}"];
        if(char==="[") return TIPOS_DE_SIMBOLOS["["];
        if(char==="]") return TIPOS_DE_SIMBOLOS["]"];
        if(char===":") return TIPOS_DE_SIMBOLOS[":"];
        if(char===",") return TIPOS_DE_SIMBOLOS[","];
        return null;
        
    }

    //Para ver las listas de tokens y errores
    estaEnLista(lexemaABuscar,lista){

        for(let i=0; i<lista.length; i++){
            if(lista[i]===lexemaABuscar) return true;
                
        }
        return false;
    }

    //Especificamente nos dijeron que los resultados los reconocieramos como un token y no como cadenas

    esMarcadorCadena(marcador){
        let pos=0;

        let tieneIzq=false,tieneDere=false; //izquierda-derecha=numeros del marcador

        while(pos<marcador.length && this.esDigitoElCaracter(marcador[pos])){tieneIzq=true;pos++;};

        if(!tieneIzq) return false; //Si no hay izquierda, no se cumple el formato

        
        if(pos>=marcador.length || marcador[pos]!="-") return false;

        pos+=1;

        while(pos<marcador.length && this.esDigitoElCaracter(marcador[pos])){tieneDere=true;pos++}
        return tieneDere && pos===marc.length; //Significa que se cumple el formato y se recorrio toda la cadena
    }
    //Avamzar es simplemente cambiar posicion y columna por concecuente
    avanzarDePosicion(){
        this.posicionActualEnLaET++;
        this.columanaEnLaET++;
    }

}