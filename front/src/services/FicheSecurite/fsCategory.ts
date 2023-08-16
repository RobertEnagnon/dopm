import RequestService from "../request";
import {FsCategory} from "../../models/FicheSecurite/fsCategory";

const GetFSCategories = async () => {
  let req = new RequestService();
  const res = await req.fetchEndpoint("fscategories");
  return res?.data.map((fscategory: any) => ({
    ...fscategory,
    createdAt: new Date(fscategory.createdAt),
    updatedAt: new Date(fscategory.updatedAt)
  }));
}

const AddFSCategory = async (fscategory: FsCategory) => {
  let req = new RequestService();
  const res = await req.fetchEndpoint("fscategories", "POST", fscategory);
  const newFSCategory = res?.data.newFSCategory;
  return { ...newFSCategory, updatedAt: new Date(newFSCategory.updatedAt), createdAt: new Date(newFSCategory.createdAt) };
}

const UpdateFSCategory = async (id: number, fscategory: FsCategory) => {
  let req = new RequestService();
  return await req.fetchEndpoint(`fscategories/${id}`, "PUT", fscategory);
}

const DeleteFSCategory = async (id: number) => {
  let req = new RequestService();
  const res = await req.fetchEndpoint(`fscategories/${id}`, "DELETE");
  return res?.data;
}

export {
  GetFSCategories,
  AddFSCategory,
  UpdateFSCategory,
  DeleteFSCategory
}