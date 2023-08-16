import { useEffect, useState } from "react";
import {
  GetSuggestions,
  CreateSuggestion,
  UpdateSuggestion,
  AddComityUser,
  EditComityUser,
} from "../services/suggestion";
import { ImgSuggestion, Suggestion } from "../models/suggestion";

import { notify, NotifyActions } from "../utils/dopm.utils";

export const useSuggestion = () => {
  const [suggestions, setSuggestions] = useState<Array<Suggestion>>([]);

  useEffect(() => {
    GetSuggestions().then((suggestions) => {
      setSuggestions(suggestions);
    });
  }, []);

  const OnAddSuggestion = async (suggestionToAdd: Suggestion) => {
    const { suggestion }: any = await CreateSuggestion(suggestionToAdd);

    if (suggestion) {
      const newSuggestion: Suggestion = suggestion;
      setSuggestions((prevSuggestions) => [...prevSuggestions, newSuggestion]);
      notify(
        `La suggestion ${newSuggestion.id_sug} a été ajouté`,
        NotifyActions.Successful
      );
    }

    if (!suggestion) {
      notify("Echec de l'ajout de la suggestion.", NotifyActions.Error);
    }
  };

  const OnUpdateSuggestion = async (suggestionToEdit: Suggestion, initialImg?: ImgSuggestion) => {
    const { suggestion }: any = await UpdateSuggestion(suggestionToEdit, initialImg);

    if (suggestion) {
      GetSuggestions().then((suggestions) => {
        setSuggestions(suggestions);
      });
      notify(
        `La suggestion de ${suggestionToEdit.senderFirstname} ${suggestionToEdit.senderLastname} a été modifié`,
        NotifyActions.Successful
      );
    }

    if (!suggestion) {
      notify("Echec de l'édition de la suggestion.", NotifyActions.Error);
    }
  };

  const OnAddComityUser = async (userId: number) => {
    const { message } = await AddComityUser(userId);

    if (message) {
      notify("L'utilisateur a été ajouté.", NotifyActions.Successful);
    } else {
      notify("Echec de l'ajout d'utilisateur.", NotifyActions.Error);
    }
  };

  const OnEditComityUser = async (userId: number) => {
    const { message } = await EditComityUser(userId);

    if (message) {
      notify("L'utilisateur a été modifié.", NotifyActions.Successful);
    } else {
      notify("Echec de l'ajout d'utilisateur.", NotifyActions.Error);
    }
  };

  return {
    suggestions,
    OnAddSuggestion,
    OnUpdateSuggestion,
    OnAddComityUser,
    OnEditComityUser,
  };
};
