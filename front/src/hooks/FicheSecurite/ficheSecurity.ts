import {DeleteFiche, GetFiches} from "../../services/FicheSecurite/ficheSecurity";
import {useEffect, useState} from "react";
import {Fiche} from "../../models/fiche";
import {notify, NotifyActions} from "../../utils/dopm.utils";

export const useFicheSecurity = () => {
  const [ fiches, setFiches ] = useState<Array<Fiche>>([]);

  useEffect(() => {
    GetFiches()
      .then(fiches => {
        setFiches(fiches)
        console.log(fiches)
      });
  }, []);

  const deleteFiche = async (id: number) => {
    const ficheId = fiches![id].id;
    const isDelete = await DeleteFiche(ficheId);
    if (isDelete.message) {
      setFiches(fiches!.filter(fiche => fiche.id !== ficheId));
      notify("Fiche " + ficheId + " a été supprimée!", NotifyActions.Successful);
    }
  };

  return { fiches, deleteFiche };
}

