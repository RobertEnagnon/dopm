import RequestService from "../request";
import {Service} from "../../models/service";

const GetServices = async () => {
  let req = new RequestService()
  const res = await req.fetchEndpoint("services")
  return res?.data;
};

const AddService = async (service: Service) => {
  let req = new RequestService()
  const res = await req.fetchEndpoint("services", "POST", service);
  return res?.data;
}

const UpdateService = async (id: number, service: Service) => {
  let req = new RequestService()
  const res = await req.fetchEndpoint(`services/${id}`, "PUT", service);
  return res?.data;
}

const DeleteService = async (id: number) => {
  let req = new RequestService()
  const res = await req.fetchEndpoint(`services/${id}`, "DELETE");
  return res?.data;
}

export {
  GetServices,
  AddService,
  UpdateService,
  DeleteService
}