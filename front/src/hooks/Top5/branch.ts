import {useEffect, useState} from "react";
import {Branch} from "../../models/Top5/branch";
import {GetBranches} from "../../services/Top5/branch";
import {Category} from "../../models/Top5/category";
import {useCategories} from "./category";

export const useBranch = () => {
  const [ branches, setBranches ] = useState<Array<Branch>>();
  const [ allCategories, setAllCategories ] = useState<Array<Category>>([]);
  const [getCategoriesByBranch] = useCategories();

  useEffect(() => {
    FetchBranches().then(async branches => {
      const categories = await Promise.all(branches.map(async branch => {
        const categories = await getCategoriesByBranch(branch.id);
        return categories.updatedCategories;
      }))
      setAllCategories(categories.flat());
    })
  }, []);

  const FetchBranches = async () => {
    const branches = await GetBranches();
    setBranches(branches);
    return branches;
  }

  return { branches, allCategories, FetchBranches };
}