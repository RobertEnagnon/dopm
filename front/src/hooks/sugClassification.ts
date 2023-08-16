import { useEffect, useState } from "react";
import {
  GetSugClassifications,
  CreateSugClassification,
  UpdateSugClassification,
  DeleteSugClassification,
} from "../services/sugClassification";
import { SugClassification } from "../models/sugClassification";
import { notify, NotifyActions } from "../utils/dopm.utils";

export const useSugClassification = () => {
  const [sugClassifications, setSugClassifications] = useState<
    Array<SugClassification>
  >([]);

  useEffect(() => {
    GetSugClassifications().then((classifications) => {
      setSugClassifications(classifications);
    });
  }, []);

  const OnAddSugClassification = async (data: SugClassification) => {
    const { sugClassification }: any = await CreateSugClassification(data);

    if (sugClassification) {
      let newSugClassification: SugClassification = sugClassification;

      setSugClassifications((prevSugClassifications) => [
        ...prevSugClassifications,
        newSugClassification,
      ]);
      notify(
        `La classification suggestion ${sugClassification.name} a été ajoutée`,
        NotifyActions.Successful
      );
    } else {
      notify("Echec de l'ajout de la classification.", NotifyActions.Error);
    }
  };

  const OnUpdateSugClassification = async (data: SugClassification) => {
    const { sugClassification }: any = await UpdateSugClassification(data);

    if (sugClassification) {
      setSugClassifications((prevSugClassifications) => {
        return prevSugClassifications.map((item) => {
          if (item.id === data.id) {
            return sugClassification;
          }

          return item;
        });
      });

      notify(
        `La catégorie suggestion ${data.name} a été modifié`,
        NotifyActions.Successful
      );
    } else {
      notify("Echec de la modification de la suggestion.", NotifyActions.Error);
    }
  };

  const OnDeleteSugClassification = async (data: SugClassification) => {
    const { sugClassification }: any = await DeleteSugClassification(data.id!);

    if (sugClassification) {
      setSugClassifications((prevSugClassifications) => {
        return prevSugClassifications.filter((item) => item.id !== data.id);
      });

      notify(
        `La classification suggestion ${data.name} a été supprimé`,
        NotifyActions.Successful
      );
    } else {
      notify(
        "Echec de la suppression de la classification.",
        NotifyActions.Error
      );
    }
  };

  return {
    sugClassifications,
    OnAddSugClassification,
    OnUpdateSugClassification,
    OnDeleteSugClassification,
  };
};
