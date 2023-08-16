import { Category } from "./Top5/category";
import { Responsible } from "./responsible";
import { Classification } from "./FicheSecurite/classification";
import { Subzone } from "./subzone";
import { Zone } from "./zone";
import { Team } from "./team";
import { Service } from "./service";

type Fiche = {
    id_fs?: string;
    FSCategory?: Category
    assignation?: Responsible,
    assignationId?: number
    classification?: Classification,
    classificationId?: number
    commentaireStatus?: string,
    createdAt: Date,
    deadLineConservatoire?: string,
    description?: string,
    fsCategoryId?: number,
    id: number,
    image1?: string,
    image2?: string,
    image3?: string,
    mesureConservatoire?: string,
    mesureSecurisation?: string,
    responsibleConservatoire?: Responsible,
    responsibleConservatoireId?: number,
    responsibleSecurite?: Responsible,
    responsibleSecuriteId?: number
    senderFirstname?: string,
    senderLastname?: string,
    service?: Service
    serviceId?: number,
    status?: string,
    subzone?: Subzone,
    subzoneId?: number,
    team?: Team,
    teamId?: number,
    updatedAt?: Date,
    zone?: Zone,
    zoneId?: number
}

type FicheAdd = {
    id_fs?: string
    assignationId?: number
    classificationId?: number
    commentaireStatus?: string,
    deadLineConservatoire?: string,
    description?: string,
    fsCategoryId?: number,
    image1?: string,
    image2?: string,
    image3?: string,
    mesureConservatoire?: string,
    mesureSecurisation?: string,
    responsibleConservatoireId?: number,
    responsibleSecuriteId?: number
    senderFirstname?: string,
    senderLastname?: string,
    serviceId?: number,
    status?: string,
    subzoneId?: number,
    teamId?: number,
    updatedAt?: Date,
    zoneId?: number
}

export type {
    Fiche,
    FicheAdd
}
