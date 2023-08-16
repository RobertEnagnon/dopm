import RequestService from "./request";
import {Subzone} from "../models/subzone";

const GetSubZones = async (zoneId: number) => {
  let req = new RequestService();
  const res = await req.fetchEndpoint(`subzones/${zoneId}`)
  return res?.data;
}

const AddSubZone = async (zone: Subzone) => {
  let req = new RequestService()
  const res = await req.fetchEndpoint("subzones", "POST", zone);
  return res?.data;
}

const UpdateSubZone = async (id: number, zone: Subzone) => {
  let req = new RequestService()
  const res = await req.fetchEndpoint(`subzones/${id}`, "PUT", zone);
  return res?.data;
}

const DeleteSubZone = async (id: number) => {
  let req = new RequestService()
  const res = await req.fetchEndpoint(`subzones/${id}`, "DELETE");
  return res?.data;
}

export {
  GetSubZones,
  AddSubZone,
  UpdateSubZone,
  DeleteSubZone
}