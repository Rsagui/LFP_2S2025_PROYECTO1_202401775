import { TokenStream } from "./flujoDeTokens";
import { consumirBloqueTorneo } from "./consumidorBloqueTorneo";
import { consumirBloqueEquipos } from "./consumidorBloqueEquipos";
import { consumirBloqueEliminacion } from "./consumidorBloqueEliminacion";
import { Torneo } from "../Modelos/Torneo";

export function conjuntoDeConsumidores(listaTokens){
    const TStream=new TokenStream(listaTokens)

    TStream.lexemaEsperado("TORNEO");//se consume y se avanza al siguinte token
    //signo de apartura de info
    TStream.lexemaEsperado("{")
    //todos los consumides comparte el mismo flujo de tokens
    const infoTorneo=consumirBloqueTorneo(TStream); //estp me devuevle 3 datos que voy a usar luego
    
    torneoNuevo=new Torneo(infoTorneo.nombreTorneo,infoTorneo.equiposEsperados, infoTorneo.sede);

    //Equipos{..}
    TStream.palabraReservadaEsperada("EQUIPOS");
    TStream.lexemaEsperado("{");
    consumirBloqueEquipos(TStream,torneoNuevo);
    TStream.lexemaEsperado("}")

    //Elimacion{..}
    TStream.palabraReservadaEsperada("ELIMNACION");
    TStream.lexemaEsperado("{");
    consumirBloqueEliminacion(TStream,torneoNuevo);
    TStream.lexemaEsperado("}")

    //voy a retornar el objeto torneos, pero ojo. Al pasar por todos los consumidores
    //Se le añadieron estadisticasd

    return torneoNuevo;


}