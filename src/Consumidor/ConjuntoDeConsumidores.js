import { TokenStream } from "./flujoDeTokens.js";
import { consumirBloqueTorneo } from "./consumidorBloqueTorneo.js";
import { consumirBloqueEquipos } from "./consumidorBloqueEquipos.js";
import { consumirBloqueEliminacion } from "./consumidorBloqueEliminacion.js";
import { Torneo } from "../Modelos/Torneo.js";

export function conjuntoDeConsumidores(listaTokens){
    const TStream=new TokenStream(listaTokens)

    TStream.lexemaEsperado("TORNEO");//se consume y se avanza al siguinte token
    //signo de apartura de info
    TStream.lexemaEsperado("{");
    //todos los consumides comparte el mismo flujo de tokens
    const infoTorneo=consumirBloqueTorneo(TStream); //estp me devuevle 3 datos que voy a usar luego
    
    const torneoNuevo=new Torneo(infoTorneo.nombreTorneo,infoTorneo.sede,infoTorneo.equiposEsperados);
    TStream.lexemaEsperado("}"); //signo de cierre info

    //Equipos{..}
    TStream.palabraReservadaEsperada("EQUIPOS");
    TStream.lexemaEsperado("{");
    consumirBloqueEquipos(TStream,torneoNuevo);
    TStream.lexemaEsperado("}")

    //Elimacion{..}
    TStream.palabraReservadaEsperada("ELIMINACION");
    TStream.lexemaEsperado("{");
    consumirBloqueEliminacion(TStream,torneoNuevo);
    TStream.lexemaEsperado("}")

    //voy a retornar el objeto torneos, pero ojo. Al pasar por todos los consumidores
    //Se le añadieron estadisticasd

    return torneoNuevo;


}