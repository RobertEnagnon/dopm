import {useEffect, useState} from "react";
import {Classification} from "../../models/FicheSecurite/classification";
import {AddClassification, DeleteClassification, GetClassifications, UpdateClassification } from "../../services/FicheSecurite/classification";

export const useClassification = () => {
  const [ classifications, setClassification ] = useState<Array<Classification>>([]);

  useEffect(() => {
    GetClassifications()
      .then(classifications => setClassification(classifications));
  }, []);

  const addClassification = async (classification: Classification) => {
    const response = await AddClassification(classification);
    if (response.newClassification) {
      setClassification(classifications.concat(response.newClassification));
    }
    return response;
  }

  const updateClassification = async (id: number, classification: Classification) => {
    const message = await UpdateClassification(id, classification);
    if (message) {
      setClassification(classifications.map((classif) => {
        if (classif.id === id) {
          return { ...classif, ...classification }
        }
        return classif;
      }));
    }
    return message;
  }

  const deleteClassification = async (id: number) => {
    const res = await DeleteClassification(id);
    if (res.message) {
      setClassification(classifications.filter(classification => classification.id !== id));
    }
    return res;
  }

  return { classifications, addClassification, updateClassification, deleteClassification };
}