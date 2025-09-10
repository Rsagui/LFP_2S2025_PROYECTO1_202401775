import {Token,PALABRAS_RESERVADAS, ATRIBUTOS_VALIDOS    } from "*./token.js"

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
    }    

    //Análisis lexico
    analizarEntradaDeTexto(){
        //Me detengo hasta que la posicion actual sea igual  al tamaño de la entrada de texto
        while(this.posicionActualEnLaET<this.entradaDeTexto.length){

            //Recorro caracter por caracter
            let charActual=this.entradaDeTexto[this.posicionActualEnLaET];

            if(this.estadoActualDelAutomata==="INICIAL"){

                if(charActual===" "||charActual==="\t"){ //Ignoramos espacios y tabulaciones

                    //A pesar que las ignoramos, debemod avanzar de posicion
                    this.avanzarDePosicion();
                    continue; //Se sigue iterando no puedo parar
                }
            }

            if(charActual==="\n"){
                    this.filaEnLaET++; //Un salto de linea aumenta la fila
                    this.columanaEnLaET=1; //Y la columna se reinicia
                    this.posicionActualEnLaET++; //Avanzo de posicion en la entrada de texto
                    continue; //Se sigue iterando no puedo parar
            }

            if(esLetraELCaracter(charActual)){



            }            
        }
    }

    esLetraELCaracter(char){

        if(char=>"A" && char<="Z") return true;

    }

    //Avamzar es simplemente cambiar posicion y columna por concecuente
    avanzarDePosicion(){
        this.posicionActualEnLaET++;
        this.columanaEnLaET++;
    }

}