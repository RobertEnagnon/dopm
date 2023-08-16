import { Zone } from "./zone";
import { Fiche } from "./fiche";

type Subzone = {
    id: number,
    name?: string,
    description?: string,
    zone?: Zone,
    zoneId: number,
    createdAt?: string,
    updatedAt?: string,
    FicheSecurite?: Array<Fiche>,
}

export type {
    Subzone
}
