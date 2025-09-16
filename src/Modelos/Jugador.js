export class Jugador{
    constructor(nombre, posicion, numero, edad){

        this.nombre=nombre;
        this.posicion=posicion;
        this.numero=Number(numero);
        this.edad=Number(edad);
        this.cantidadGoles=0; //si meten gol en algun juego se deberia actualizar
        this.minutosDeGol=[] // [15,45] metio gol en el 15 y en el 45
        
    }
}