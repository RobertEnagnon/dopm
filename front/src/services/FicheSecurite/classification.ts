import RequestService from "../request";
import { Classification } from "../../models/FicheSecurite/classification";

const GetClassifications = async () => {
  let req = new RequestService()
  const res = await req.fetchEndpoint("classifications");
  return res?.data;
}

const AddClassification = async (classification: Classification) => {
  let req = new RequestService()
  const res = await req.fetchEndpoint("classifications", "POST", classification);
  return res?.data;
}

const UpdateClassification = async (id: number, classification: Classification) => {
  let req = new RequestService()
  const res = await req.fetchEndpoint(`classifications/${id}`, "PUT", classification);
  return res?.data;
}

const DeleteClassification = async (id: number) => {
  let req = new RequestService()
  const res = await req.fetchEndpoint(`classifications/${id}`, "DELETE");
  return res?.data;
}

export {
  GetClassifications,
  AddClassification,
  UpdateClassification,
  DeleteClassification
}