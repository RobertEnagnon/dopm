import RequestService from "./request";
import { Zone } from "../models/zone";

const GetZones = async () => {
  let req = new RequestService();
  const res = await req.fetchEndpoint("zones")
  return res?.data.map((zone: any) => {
    return {
      ...zone,
      createdAt: new Date(zone.createdAt),
      updatedAt: new Date(zone.updatedAt),
      subzones: zone.subzones.map((subzone : any) => {
        return {
          ...subzone,
          createdAt: new Date(subzone.createdAt),
          updatedAt: new Date(subzone.updatedAt),
          zoneId: subzone.zone_id
        }
      })
    }
  })
};

const AddZone = async (zone: Zone) => {
  let req = new RequestService()
  const res = await req.fetchEndpoint("zones", "POST", zone);
  return res?.data;
}

const UpdateZone = async (id: number, zone: Zone) => {
  let req = new RequestService()
  const res = await req.fetchEndpoint(`zones/${id}`, "PUT", zone);
  return res?.data;
}

const DeleteZone = async (id: number) => {
  let req = new RequestService()
  const res = await req.fetchEndpoint(`zones/${id}`, "DELETE");
  return res?.data;
}

export {
  GetZones,
  AddZone,
  UpdateZone,
  DeleteZone
}