import RequestService from "../request";
import {Fiche, FicheAdd} from "../../models/fiche";

const GetFiches = async () => {
  let fiches: Array<Fiche> = [];
  let req = new RequestService()

  const res = await req.fetchEndpoint('fiches');
  res?.data.forEach((fiche: any) => {
    fiches.push({
      ...fiche,
      serviceId: fiche.service_id,
      assignationId: fiche.assignation_id,
      classificationId: fiche.classification_id,
      fsCategoryId: fiche.fsCategory_id,
      responsibleConservatoireId: fiche.responsibleConservatoire_id,
      responsibleSecuriteId: fiche.responsibleSecurite_id,
      subzoneId: fiche.subzone_id,
      teamId: fiche.team_id,
      zoneId: fiche.zone_id,
      updatedAt: new Date(fiche.updatedAt),
      createdAt: new Date(fiche.createdAt)
    })
  });
  return fiches;
}

const GetFiche = async (id: number, siblings: "previous" | "next" | null = null) => {
  let req = new RequestService();
  let url = `fiche/${id}`;

  if (siblings) {
    url += `?reqType=${siblings}`
  }

  const res = await req.fetchEndpoint(url);
  const fiche = res?.data;
  return {
    ...fiche,
    serviceId: fiche.service_id,
    assignationId: fiche.assignation_id,
    classificationId: fiche.classification_id,
    fsCategoryId: fiche.fsCategory_id,
    responsibleConservatoireId: fiche.responsibleConservatoire_id,
    responsibleSecuriteId: fiche.responsibleSecurite_id,
    subzoneId: fiche.subzone_id,
    teamId: fiche.team_id,
    zoneId: fiche.zone_id,
    updatedAt: new Date(fiche.updatedAt),
    createdAt: new Date(fiche.createdAt)
  };
}

const UpdateFiche = async (id: number, fiche: Fiche) => {
  /**
   * On ajoute la langue pour le mail
   */
  const lang = localStorage.getItem('lang')? localStorage.getItem('lang'): 'french'
  let req = new RequestService();
  const res = await req.fetchEndpoint(`fiches/${id}`, "PUT", {...fiche, lang: lang});
  return res?.data;
}

const AddFiche = async (fiche: FicheAdd) => {
  /**
   * On ajoute la langue pour le mail
   */
  const lang = localStorage.getItem('lang')? localStorage.getItem('lang'): 'french'
  let req = new RequestService();
  const res = await req.fetchEndpoint('fiches', "POST", {...fiche, lang: lang});
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

  const res = await req.fetchEndpoint("fiches-upload", "POST", data, false, undefined, false, headers);
  return res?.data;
}

const DeleteFiche = async (id: number) => {
  let req = new RequestService()
  const res = await req.fetchEndpoint(`fiches/${id}`, "DELETE");
  return res?.data;
}

export {
  GetFiches,
  GetFiche,
  UpdateFiche,
  AddFiche,
  UploadFile,
  DeleteFiche
}
