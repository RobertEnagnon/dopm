import RequestService from "./request";
import {Responsible} from "../models/responsible";

const GetResponsibles = async () => {
  let req = new RequestService();
  const res = await req.fetchEndpoint("responsibles")
  return res?.data.map((responsible: any) => ({
    ...responsible,
    firstname: responsible.first_name,
    lastname: responsible.last_name
  }))
};

const AddResponsible = async (responsible: Responsible) => {
  let req = new RequestService();
  const res = await req.fetchEndpoint("responsibles", "POST", responsible)
  const newResponsible = res?.data.responsible;
  return { ...newResponsible, updatedAt: new Date(newResponsible.updatedAt), createdAt: new Date(newResponsible.createdAt) };
}

const UpdateResponsible = async (id: number, responsible: Responsible) => {
  let req = new RequestService();
  const res = await req.fetchEndpoint(`responsibles/${id}`, "PUT", responsible)
  return res?.data.message;
}

const DeleteResponsible = async (id: number) => {
  let req = new RequestService();
  return await req.fetchEndpoint(`responsibles/${id}`, "DELETE")
}

export {
  GetResponsibles,
  AddResponsible,
  UpdateResponsible,
  DeleteResponsible
}