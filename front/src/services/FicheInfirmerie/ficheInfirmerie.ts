import RequestService from "../request";
import {FicheInf, FicheInfAdd} from "../../models/ficheinf";

const GetFichesInf = async () => {
  let fiches: Array<FicheInf> = [];
  let req = new RequestService()

  const res = await req.fetchEndpoint('fichesinf')
  res?.data.forEach((fiche: any) => {
    fiches.push({
      ...fiche,
      injuredCategoryId: fiche.injuredCategory_id,
      responsibleSecuriteId: fiche.responsibleSecurite_id,
      serviceId: fiche.service_id,
      teamId: fiche.team_id,
      zoneId: fiche.zone_id,
      subzoneId: fiche.subzone_id,
      materialElementsId: fiche.materialElements_id,
      lesionDetailsId: fiche.lesionDetails_id,
      careProvidedId: fiche.careProvided_id,
      assignationId: fiche.assignation_id,
      classificationId: fiche.classification_id,
      updatedAt: new Date(fiche.updatedAt),
      createdAt: new Date(fiche.createdAt)
    })
  })
  return fiches
}

const GetFicheInf = async (id: number, siblings: "previous" | "next" | null = null) => {
  let req = new RequestService();
  let url = `ficheinf/${id}`;

  if (siblings) {
    url += `?reqType=${siblings}`
  }

  const res = await req.fetchEndpoint(url);
  const fiche = res?.data;
  return {
    ...fiche,
    injuredCategoryId: fiche.injuredCategory_id,
    responsibleSecuriteId: fiche.responsibleSecurite_id,
    serviceId: fiche.service_id,
    teamId: fiche.team_id,
    zoneId: fiche.zone_id,
    subzoneId: fiche.subzone_id,
    materialElementsId: fiche.materialElements_id,
    lesionDetailsId: fiche.lesionDetails_id,
    careProvidedId: fiche.careProvided_id,
    assignationId: fiche.assignation_id,
    classificationId: fiche.classification_id,
    updatedAt: new Date(fiche.updatedAt),
    createdAt: new Date(fiche.createdAt)
  }
}

const UpdateFicheInf = async (id: number, fiche: FicheInf) => {
  /**
   * On ajoute la langue pour le mail
   */
  const lang = localStorage.getItem('lang')? localStorage.getItem('lang'): 'french'
  let req = new RequestService();
  const res = await req.fetchEndpoint(`fichesinf/${id}`, "PUT", {...fiche, lang: lang});
  return res?.data;
}

const AddFicheInf = async (fiche: FicheInfAdd) => {
  /**
   * On ajoute la langue pour le mail
   */
  const lang = localStorage.getItem('lang')? localStorage.getItem('lang'): 'french'
  let req = new RequestService();
  const res = await req.fetchEndpoint('fichesinf', "POST", {...fiche, lang: lang});
  return res?.data;
}
/**
 * 
 * @param {File} file - le fichier à envoyer
 * @param {string} subfolder - le sous dossier images/[subfolder/]file.extension
 * @returns 
 */
const UploadFile = async (file: File, subfolder: string = '') => {
  let req = new RequestService();
  let data = new FormData();
  data.append("file", file);
  if( subfolder ) {
    data.append('subfolder', subfolder);
  }
  const headers = {
    "content-type": "multipart/form-data",
  };

  const res = await req.fetchEndpoint("fichesinf-upload", "POST", data, false, undefined, false, headers);
  return res?.data;
}

const DeleteFicheInf = async (id: number) => {
  let req = new RequestService()
  const res = await req.fetchEndpoint(`fichesinf/${id}`, "DELETE");
  return res?.data;
}

export {
  GetFichesInf,
  GetFicheInf,
  UpdateFicheInf,
  AddFicheInf,
  UploadFile,
  DeleteFicheInf
}
