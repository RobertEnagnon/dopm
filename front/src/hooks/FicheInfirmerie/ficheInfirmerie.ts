import {useEffect, useState} from "react"
import {notify, NotifyActions} from "../../utils/dopm.utils";
import { FicheInf } from "../../models/ficheinf";
import { DeleteFicheInf, GetFichesInf } from "../../services/FicheInfirmerie/ficheInfirmerie";

export const useFicheInfirmerie = (): {fiches: FicheInf[], deleteFiche: Function} => {
  const [ fiches, setFiches ] = useState<Array<FicheInf>>([])

  useEffect(() => {
    GetFichesInf()
      .then(fiches => {
        setFiches(fiches)
        console.log('fiches', fiches)
      })
  }, [])

  const deleteFiche = async (id: number) => {
    const ficheId = fiches![id].id
    const isDelete = await DeleteFicheInf(ficheId)
    if (isDelete.message) {
      setFiches(fiches!.filter(fiche => fiche.id !== ficheId))
      notify("Fiche " + ficheId + " a été supprimée!", NotifyActions.Successful)
    }
  }

  return { fiches, deleteFiche };
}

