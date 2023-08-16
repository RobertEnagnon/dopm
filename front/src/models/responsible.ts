import { Fiche } from "./fiche";

type Responsible = {
    id: number,
    firstname: string,
    lastname: string,
    email: string,
    createdAt?: Date | string
    updatedAt?: Date | string,
    FicheSecurite: Array<Fiche>
}

export type {
    Responsible
}