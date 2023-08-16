/* eslint-disable no-unused-vars */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useIndicator } from "../../hooks/Top5/indicator";
import { GetCategoriesByBranch } from "../../services/Top5/category";
import { Branch } from "../../models/Top5/branch";

import { Category } from "../../models/Top5/category";
import {
  CreateCategory,
  DeleteCategory,
  UpdateCategory,
} from "../../services/Top5/category";
import {
  DeleteIndicatorsByCategory,
  GetIndicatorsByCategory,
} from "../../services/Top5/indicator";

import {notify, NotifyActions} from "../../utils/dopm.utils";

type Props = {
  children: any;
};

const defaultBranch: Branch = {
  id: 0,
  name: "",
  orderBranch: 0,
};

export type Top5ContextType = {
  currentBranch: Branch;
  setCurrentBranch: (branch: Branch) => void;
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  selectedCategory: Category | undefined;
  setSelectedCategory: Function;
  handleDeleteCategory: Function;
  handleAddCategory: (categoryToAdd: Category) => void;
  handleCategoryOrder: (category: Category, isAscend: boolean) => void;
  getCurrentCategories: Function;
};

const Top5ContextDefaultValues: Top5ContextType = {
  currentBranch: defaultBranch,
  setCurrentBranch: () => {},
  categories: [],
  setCategories: () => {},
  selectedCategory: undefined,
  setSelectedCategory: () => {},
  handleDeleteCategory: () => {},
  handleAddCategory: () => {},
  handleCategoryOrder: () => {},
  getCurrentCategories: () => {}
};

export const Top5Context = createContext<Top5ContextType>(
  Top5ContextDefaultValues
);

export function useTop5() {
  return useContext(Top5Context);
}

export function Top5Provider({ children }: Props) {
  const [currentBranch, setCurrentBranch] = useState<Branch>(defaultBranch);
  const [categories, setCategories] = useState<any>([]);
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >(undefined);

  const indicatorHook = useIndicator({});

  useEffect(() => {
    if (currentBranch.id !== 0) {
      console.log("MAJ CATEGORIES");
      getCurrentCategories();
    }
  }, [currentBranch]);

  const getCurrentCategories = async () => {
    GetCategoriesByBranch(currentBranch.id, true).then(async (res: any) => {
      if (res) {
        setCategories(res);
      }
    });
  };

  const handleAddCategory = async (categoryToAdd: Category) => {
    const res = await CreateCategory(
      Object.assign({}, categoryToAdd, {
        branch_id: currentBranch.id,
      })
    );
    if (res?.data && res?.data?.category) {
      let newCategory: Category = res.data.category;
      setCategories(categories.concat(newCategory));

      notify(
        `La catégorie ${newCategory.name} a été ajoutée.`,
        NotifyActions.Successful
      );
    } else {
      notify("Echec de l'ajout de la catégorie.", NotifyActions.Error);
    }
  };

  const handleDeleteCategory = async (categoryToDelete: Category) => {
    const indicatorsToBeDeleted = await GetIndicatorsByCategory(
      categoryToDelete?.id
    );

    await Promise.all(
      indicatorsToBeDeleted?.map(async (item) => {
        await indicatorHook.OnDeleteIndicator(item);
      })
    );

    await DeleteIndicatorsByCategory(categoryToDelete?.id);
    const res = await DeleteCategory(categoryToDelete);

    if (res) {
      const remainingCategories = categories.filter(
        (category: Category) => category.id !== categoryToDelete.id
      );
      setCategories(remainingCategories);

      notify(
        `La catégorie ${categoryToDelete.name} a été supprimée`,
        NotifyActions.Successful
      );
    } else {
      notify("Echec de la suppression de la catégorie.", NotifyActions.Error);
    }
  };

  const handleCategoryOrder = async (category: Category, isAscend: boolean) => {
    const nextIndex =
      categories.findIndex((item: Category) => item.id === category.id) + 1;
    const prevIndex =
      categories.findIndex((item: Category) => item.id === category.id) - 1;

    const nextCategory = isAscend ? categories[nextIndex] : category;
    const prevCategory = !isAscend ? categories[prevIndex] : category;

    const newNextCategory = {
      ...nextCategory!,
      orderCategory: prevCategory?.orderCategory,
    };
    const newPrevCategory = {
      ...prevCategory!,
      orderCategory: nextCategory?.orderCategory,
    };

    setCategories((prevCategories: Category[]) =>
      [
        ...prevCategories.filter(
          (item) => item.id !== prevCategory?.id && item.id !== nextCategory?.id
        ),
        newNextCategory,
        newPrevCategory,
      ].sort(
        (category1, category2) =>
          category1.orderCategory! - category2.orderCategory!
      )
    );

    await UpdateCategory(newNextCategory);
    await UpdateCategory(newPrevCategory);
  };

  const value = useMemo(
    () => ({
      currentBranch: currentBranch,
      setCurrentBranch,
      categories: categories,
      setCategories,
      handleAddCategory,
      handleDeleteCategory,
      handleCategoryOrder,
      selectedCategory: selectedCategory,
      setSelectedCategory,
      getCurrentCategories
    }),
    [currentBranch, categories, selectedCategory]
  );

  return (
    <>
      <Top5Context.Provider value={value}>{children}</Top5Context.Provider>
    </>
  );
}
