import { SugWorkflow } from "../models/sugWorkflow";
import RequestService from "./request";

const CreateSugWorkflow = async (data: SugWorkflow) => {
  let req = new RequestService();
  const res = await req.fetchEndpoint(`sugworkflows`, "POST", data);
  return { sugCategory: res?.data.sugCategory };
};

const UpdateSugWorkflow = async (data: SugWorkflow) => {
  let req = new RequestService();
  const res = await req.fetchEndpoint(`sugworkflows/${data.id}`, "PUT", data);
  return {
    sugCategory: res?.data.sugCategory,
  };
};

export { CreateSugWorkflow, UpdateSugWorkflow };
