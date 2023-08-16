import {useEffect, useState} from "react";
import {GetCategories, UpdateCategories, DeleteCategories, AddCategories} from "../../services/FicheInfirmerie/fiCategory";

export const useCategory = <T>({endpoint}: {endpoint: string}) => {
  const [ categories, setCategories ] = useState<Array<T>>([]);

  useEffect(() => {
    GetCategories(endpoint)
      .then((categories) => {
        setCategories(categories);
      })
  }, [])

  const addCategory = async (category: T) => {
    const newCategory = await AddCategories<T>(endpoint, category)
    setCategories(categories.concat(newCategory))
    return newCategory
  }

  const updateCategory = async (id: number, category: T) => {
    await UpdateCategories<T>(endpoint, id, category)
    setCategories(categories.map((cat: any) => {
      if (cat.id === id) {
        return { ...cat, ...category };
      }
      return cat
    }))
    return category
  }

  const deleteCategory = async (id: number) => {
    const res = await DeleteCategories(endpoint, id);
    if (res.message) {
      setCategories(categories.filter((category: any) => category.id !== id))
    }
    return res;
  }

  return { categories, addCategory, updateCategory, deleteCategory }
}