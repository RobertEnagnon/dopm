import {useEffect, useState} from "react";
import {AddFSCategory, UpdateFSCategory, DeleteFSCategory, GetFSCategories} from "../../services/FicheSecurite/fsCategory";
import {FsCategory} from "../../models/FicheSecurite/fsCategory";

export const useFSCategory = () => {
  const [ fscategories, setFSCategories ] = useState<Array<FsCategory>>([]);

  useEffect(() => {
    GetFSCategories()
      .then((categories) => {
        setFSCategories(categories);
      });
  }, []);

  const addFSCategory = async (fscategory: FsCategory) => {
    const newFSCategory = await AddFSCategory(fscategory);
    setFSCategories(fscategories.concat(newFSCategory));
    return newFSCategory;
  }

  const updateFSCategory = async (id: number, fscategory: FsCategory) => {
    await UpdateFSCategory(id, fscategory);
    setFSCategories(fscategories.map((fscat) => {
      if (fscat.id === id) {
        return { ...fscat, ...fscategory };
      }
      return fscat;
    }));
    return fscategory;
  }

  const deleteFSCategory = async (id: number) => {
    const res = await DeleteFSCategory(id);
    if (res.message) {
      setFSCategories(fscategories.filter(fscategory => fscategory.id !== id));
    }
    return res;
  }

  return { fscategories, addFSCategory, updateFSCategory, deleteFSCategory };
}