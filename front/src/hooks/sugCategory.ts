import { useEffect, useState } from "react";
import {
  GetSugCategories,
  CreateSugCategory,
  UpdateSugCategory,
  DeleteSugCategory,
} from "../services/sugCategory";
import { SugCategory } from "../models/sugCategory";
import { notify, NotifyActions } from "../utils/dopm.utils";

export const useSugCategory = () => {
  const [sugCategories, setSugCategories] = useState<Array<SugCategory>>([]);

  useEffect(() => {
    GetSugCategories().then((categories) => {
      setSugCategories(categories);
    });
  }, []);

  const OnAddSugCategory = async (data: SugCategory) => {
    const { sugCategory }: any = await CreateSugCategory(data);

    if (sugCategory) {
      let newSugCategory: SugCategory = sugCategory;

      setSugCategories((prevSugCategories) => [
        ...prevSugCategories,
        newSugCategory,
      ]);
      notify(
        `La catégorie suggestion ${sugCategory.name} a été ajoutée`,
        NotifyActions.Successful
      );
    } else {
      notify("Echec de l'ajout de la catégorie.", NotifyActions.Error);
    }
  };

  const OnUpdateSugCategory = async (data: SugCategory) => {
    const { sugCategory }: any = await UpdateSugCategory(data);

    if (sugCategory) {
      setSugCategories((prevSugCategories) => {
        return prevSugCategories.map((item) => {
          if (item.id === data.id) {
            return sugCategory;
          }

          return item;
        });
      });

      notify(
        `La catégorie suggestion ${data.name} a été modifié`,
        NotifyActions.Successful
      );
    } else {
      notify("Echec de la modification de la catégorie.", NotifyActions.Error);
    }
  };

  const OnDeleteSugCategory = async (data: SugCategory) => {
    const { sugCategory }: any = await DeleteSugCategory(data.id!);

    if (sugCategory) {
      setSugCategories((prevSugCategories) => {
        return prevSugCategories.filter((item) => item.id !== data.id);
      });

      notify(
        `La catégorie suggestion ${data.name} a été supprimé`,
        NotifyActions.Successful
      );
    } else {
      notify("Echec de la suppression de la catégorie.", NotifyActions.Error);
    }
  };

  return {
    sugCategories,
    OnAddSugCategory,
    OnUpdateSugCategory,
    OnDeleteSugCategory,
  };
};
