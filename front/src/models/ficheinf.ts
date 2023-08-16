import { Category } from "./Top5/category";
import { Responsible } from "./responsible";
import { Subzone } from "./subzone";
import { Zone } from "./zone";
import { Team } from "./team";
import { Service } from "./service";
import { MaterialElements } from "./materialElements"
import { LesionDetails } from "./lesionDetails"
import { CareProvided } from "./careProvided";
import { InjuredCategory } from "./injuredCategory";
import { Classification } from "./FicheInfirmerie/classification";

type FicheInf = {
    id: number,
    id_fi?: string,
    injuredCategoryId?: number,
    injuredCategory?: InjuredCategory,
    injuredCategoryName?: string,
    senderFirstname?: string,
    senderLastname?: string,
    post?: string,
    responsibleSecuriteId?: number
    responsibleSecurite?: Responsible,
    serviceId?: number,
    service?: Service
    teamId?: number,
    team?: Team,
    dateAccident?: string,
    hourAccident?: string,
    zone?: Zone,
    zoneId?: number
    subzone?: Subzone,
    subzoneId?: number,
    circumstances?: string,
    materialElementsId?: number,
    materialElements?: MaterialElements,
    lesionDetailsId?: number,
    lesionDetails?: LesionDetails
    lesionImage?: string,
    careProvidedId?: number,
    careProvided?: CareProvided,
    caregiver?: string,
    careGived?: string,
    image1?: string,
    status?: string,
    assignationId?: number
    assignation?: Responsible,
    classificationId?: number,
    classification?: Classification,
    commentaireStatus?: string,
    createdAt: Date,
    updatedAt?: Date,
}

type FicheInfAdd = {
    id_fi?: string,
    injuredCategoryId?: number,
    injuredCategoryName?: string,
    senderFirstname?: string,
    senderLastname?: string,
    post?: string,
    responsibleSecuriteId?: number,
    serviceId?: number,
    teamId?: number,
    dateAccident?: string,
    hourAccident?: string,
    zoneId?: number
    subzoneId?: number,
    circumstances?: string,
    materialElementsId?: number,
    lesionDetailsId?: number,
    lesionImage?: string,
    careProvidedId?: number,
    caregiver?: string,
    careGived?: string,
    image1?: string,
    status?: string,
    assignationId?: number
    classificationId?: number,
    commentaireStatus?: string,
    createdAt?: Date,
    updatedAt?: Date,
}

export type {
    FicheInf,
    FicheInfAdd
}
