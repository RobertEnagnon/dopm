type Permission = {
    id: number,
    name: string,
}

export const permissionsList = {
  gestionUtilisateursEtDroits: 1,
  lectureDashboard: 6,
  parametrageDashboard: 7,
  lectureGraphique: 9,
  ajoutDonneesCategorie: 10,
  lectureParametrage: 12,
  parametrageTop5: 13,
  //Fiche Securite
  ajoutFicheSecurite: 14,
  lectureFicheSecurite: 15,
  lectureStatistiquesFicheSecurite: 16,
  traitementFicheSecurite: 17,
  parametrageFicheSecurite: 18,
  // Audit Terrain
  realisationAuditTerrain: 19,
  parametrageAuditTerrain: 20,
  //Fiche Infirmerie
  /**
   * Le systeme de permissions pour fiche infirmerie n'est pas completement en place
   * il faut gerer la creation
   * En attendant on utilisera les permissions de fiche securite
   */
  ajoutFicheInf: 14,//remplacer par le veritable indice: 19,
  lectureFicheInf: 15,//remplacer par le veritable indice: 20,
  lectureStatistiquesFicheInf: 16,//remplacer par le veritable indice: 21,
  traitementFicheInf: 17,//remplacer par le veritable indice: 22,
  parametrageFicheInf: 18,//remplacer par le veritable indice: 23,
}

export type {
    Permission
}
