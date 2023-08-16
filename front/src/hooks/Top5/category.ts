import { GetCategoriesByBranch } from "../../services/Top5/category";
import { GetOneBranch } from "../../services/Top5/branch";
import { Category } from "../../models/Top5/category";

/*const getDays = (date: Date) => {
  let month = date.getMonth() + 1;
  let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, -1).getDate() + 1;
  let days = [];

  for (let i = 1; i < lastDay + 1; i++) {
    days.push(`${("0" + i).slice(-2)}/${("0" + month).slice(-2)}`);
  }

  return days;
};*/

export const useCategories = () => {
  const getCategoriesByBranch = async (branch: number) => {
    const categories = await GetCategoriesByBranch(branch, true);
    const selectedBranch = await GetOneBranch(branch);
    const categoriesData = categories.map((category: Category) => {
      return { ...category, color: "warning" };
    });
    const cats = categoriesData.map(async (cat: Category) => {
      const firstIndicator = cat.indicator![0];
      if (firstIndicator) {
        cat.color = firstIndicator.color;
      }
      return { ...cat };
    });
    const updatedCategories = await Promise.all(cats);
    return { selectedBranch, updatedCategories };
  }

  return [getCategoriesByBranch];
}
