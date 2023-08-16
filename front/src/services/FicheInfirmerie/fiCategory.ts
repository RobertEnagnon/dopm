import RequestService from "../request";

const GetCategories = async (endpoint: string) => {
  let req = new RequestService();
  const res = await req.fetchEndpoint(endpoint)
  return res?.data.map((ficategory: any) => ({
    ...ficategory,
    createdAt: new Date(ficategory.createdAt),
    updatedAt: new Date(ficategory.updatedAt)
  }));
}

const AddCategories = async <T>(endpoint: string, fscategory: T) => {
  let req = new RequestService()
  const res = await req.fetchEndpoint(endpoint, "POST", fscategory)
  let newCategory = res?.data.newFiInjCategory;
  if (!newCategory) newCategory = res?.data.newCategory;
  return { ...newCategory, updatedAt: new Date(newCategory.updatedAt), createdAt: new Date(newCategory.createdAt) }
}

const UpdateCategories = async <T>(endpoint: string, id: number, fscategory: T) => {
  let req = new RequestService();
  return await req.fetchEndpoint(`${endpoint}/${id}`, "PUT", fscategory);
}

const DeleteCategories = async (endpoint: string, id: number) => {
  let req = new RequestService();
  const res = await req.fetchEndpoint(`${endpoint}/${id}`, "DELETE");
  return res?.data;
}

export {
  GetCategories,
  AddCategories,
  UpdateCategories,
  DeleteCategories
}
