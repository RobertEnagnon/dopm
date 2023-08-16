import { Fiche } from "./fiche";

type Team = {
    id: number,
    name?: string,
    description?: string,
    createdAt?: Date | string,
    updatedAt?: Date | string,
    FicheSecurite?: Array<Fiche>,
}

export type {
    Team
}
