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
            const charActual=this.entradaDeTexto[this.posicionActualEnLaET];

            if(this.estadoActualDelAutomata==="INICIAL"){

                if(charActual===" "||charActual==="\t"|| charActual==="\r"){ //Ignoramos espacios,tabs y retornos al inicio de la linea

                    //A pesar que las ignoramos, debemos avanzar de posicion
                    this.avanzarDePosicion();
                    continue; //Se sigue iterando no puedo parar
                }
                //salto de linea
                if(charActual==="\n"){
                    this.filaEnLaET++; //Un salto de linea aumenta la fila
                    this.columanaEnLaET=1; //Y la columna se reinicia
                    this.posicionActualEnLaET++; //Avanzo de posicion en la entrada de texto
                    continue; //Se sigue iterando no puedo parar
                }
                // Letra -> IDENT (inicializa buffer con el primer char y AVANZA)
                if(this.esLetraELCaracter(charActual)){
                    this.estadoActualDelAutomata="IDENT" //cambia el estado a IDENT
                    this.buffer=charActual; // teorimacembnte el buffer me permite almacenar los caracteres
                    this.columaDeInicio=this.columanaEnLaET //guardo la columna de inicio 
                    this.avanzarDePosicion();
                    continue;
                }    
                
                //Digito->num
                if(this.esDigitoElCaracter(charActual)){
                    this.estadoActualDelAutomata="NUM"; //cambiamos el estado a numero
                    this.buffer="charActual";
                    this.columanaDeInicio=this.columanaEnLaET;
                    this.avanzarDePosicion();
                    continue;
                }
                // Comilla -> CADENA (no guardo la comilla en el buffer)
                if(charActual==='"'){ // o sea si encontramos una comilla significa que se viene un string

                    this.estadoActualDelAutomata="CADENA";
                    this.buffer=""; //aca se va a almcenar la cadena
                    this.columaDeInicio=this.columanaEnLaET;
                    this.avanzarDePosicion(); //No quiero guardar la comilla inicial
                    continue;

                }

                //esto es para anlizar los simbolos {},[]-;-:
                const tipoSimbolo=this.esTipoDeSimbolo(charActual);
                if(tipoSimbolo!=null){

                    this.listaDeTokensEncontrados.push(new Token(
                        charActual, //Lexema
                        tipoSimbolo, //tipo
                        this.filaEnLaET,
                        this.columanaEnLaET
                    ));
                    this.avanzarDePosicion();
                    continue;
                }

                //Ya puse todos los posibles inicios del automata, sillego hasta aca es porque existe un erorr:

                this.agregarError(charActual,"Token invalido","Este lexer no reconoce este caracter");
                this.avanzarDePosicion();
                continue;
            }

            //======Estado IDENT========:
            if(this.estadoActualDelAutomata==="IDENT"){
                if(this.posicionActualEnLaET<this.entradaDeTexto.length 
                    && this.esLetraELCaracter(this.entradaDeTexto[this.posicionActualEnLaET])){
                    this.buffer+=this.entradaDeTexto[this.posicionActualEnLaET];//Es decir el budder recibe el caracter actual, asi retroalimentandose
                    this.avanzarDePosicion();

                } else{

                    //vamos a clasificar el lexema, es decir el buffer está listo para cargar un token

                    //le paso un posible lexema y a donde deberia pertenecer
                    if(this.estaEnLista(this.buffer,PALABRAS_RESERVADAS)){

                        this.listaDeTokensEncontrados.puhs(new Token(
                            this.buffer,
                            "Palabra Reservada",
                            this.filaEnLaET,
                            this.columanaDeInicio //a mi me interesa en donde comienza esta palabra reservada
                        ));                    
                    }
                    else if(this.estaEnLista(this.buffer, ATRIBUTOS_VALIDOS)){

                        this.listaDeTokensEncontrados.push(
                            new Token(
                                this.buffer,
                                "Atributo valido",
                                this.filaEnLaET,
                                this.columaDeInicio
                            )
                        );
                    }
                    //si no es ni una, entonces cae en un error
                    else{
                        this.agregarError(this.buffer,"Token no valido","Identificador No permitido", this.columaDeInicio);
                    }
                    //si se capto un identifaco, vuelvo al estado iniclal para seguir reconociendo                    
                    this.estadoActualDelAutomata="INICIAL" //vuelvo para reconocer otros estados

                }
                continue;
            }

            //Estado para NUM
            if(this.estadoActualDelAutomata==="NUM"){
                if(this.posicionActualEnLaET< this.entradaDeTexto.length 
                    && this.esDigitoElCaracter(this.entradaDeTexto[this.posicionActualEnLaET])){
                    this.buffer+=this.entradaDeTexto[this.posicionActualEnLaET];
                    this.avanzarDePosicion();
                    
                }else{
                    //Al comppletar el buffer con un patron asociado a un token numero
                    this.listaDeTokensEncontrados.push(
                        new Token(
                            this.buffer,
                            "Número",
                            this.filaEnLaET,
                            this.columanaDeInicio));
                    this.estadoActualDelAutomata="INICIAL";

                }
                continue;
            }

            if(this.estadoActualDelAutomata==="CADENA"){
                
                //No se encontro una comilla de cierre:
                if(this.posicionActualEnLaET>=this.entradaDeTexto){

                    this.agregarError(this.buffer,
                        "Token invalido", 
                        "No existe comilla de cierre",this.columaDeInicio);

                    this.estadoActualDelAutomata="INICIAL";
                    continue;
                }

                //si lo anterior no pasa es porque seguimos almacenando en el buffer

                if(charActual==='"'){

                    const tipoDeCadena=this.esMarcadorCadena(this.buffer)? "Marcador":"Cadena"; //la funcion anterior me da un true o false, si es t->Marcador, si es f->Cadena
                    this.listaDeTokensEncontrados(new Token(

                        this.buffer, //lexema
                        tipoDeCadena, //tipo
                        this.filaEnLaET,
                        this.columaDeInicio
                        )
                    )
                    this.avanzarDePosicion();
                    this.estadoActualDelAutomata="INICIAL" //si se cierra una cadena, el token esta terminado, entonces volvemos al principio
                    continue;
                }

                //soportar saltos de linea en las cadenas

                if(charActual==="\n"){
                    this.filaEnLaET++;
                    this.columanaEnLaET=1;
                    this.buffer="\n"
                    this.posicionActualEnLaET++;
                    continue

                }

                //en caso que no haya cierre, concatenamos lo nuevo captado por el buffer

                this.buffer+=charActual;
                this.avanzarDePosicion();
                continue;
            }
        }

        return {tokens:this.listaDeTokensEncontrados, 
            errores:this.listaDeErroresEncontrados};
    }

    

    //Enlita errores en la tabla de errores
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