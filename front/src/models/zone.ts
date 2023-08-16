import { Fiche } from "./fiche";
import {Subzone} from "./subzone";

type Zone = {
    id: number,
    name?: string,
    description?: string,
    subzones?: Array<Subzone>,
    createdAt?: Date,
    updatedAt?: Date,
    FicheSecurite?: Array<Fiche>
}

export type {
    Zone
}
