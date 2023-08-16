import { SugCategory } from "../models/sugCategory";
import RequestService from "./request";

const GetSugCategories = async () => {
  let req = new RequestService();
  const res = await req.fetchEndpoint("sugcategories");
  return res?.data.map((sugCategory: any) => ({
    ...sugCategory,
    createdAt: new Date(sugCategory.createdAt),
    updatedAt: new Date(sugCategory.updatedAt),
  }));
};

const CreateSugCategory = async (data: SugCategory) => {
  let req = new RequestService();
  const res = await req.fetchEndpoint(`sugcategories`, "POST", data);
  return { sugCategory: res?.data.sugCategory };
};

const UpdateSugCategory = async (data: SugCategory) => {
  let req = new RequestService();
  const res = await req.fetchEndpoint(`sugcategories/${data.id}`, "PUT", data);
  return {
    sugCategory: {
      ...res?.data.sugCategory,
      createdAt: new Date(res?.data.sugCategory.createdAt),
      updatedAt: new Date(res?.data.sugCategory.updatedAt),
    },
  };
};

const DeleteSugCategory = async (id: number) => {
  let req = new RequestService();
  const res = await req.fetchEndpoint(`sugcategories/${id}`, "DELETE");

  return {
    sugCategory: res?.data.sugCategory,
  };
};

export {
  GetSugCategories,
  CreateSugCategory,
  UpdateSugCategory,
  DeleteSugCategory,
};
