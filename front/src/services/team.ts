import RequestService from "./request";
import { Team } from "../models/team";

const GetTeams = async () => {
  let req = new RequestService();
  const res = await req.fetchEndpoint("teams")
  return res?.data;
};

const AddTeam = async (team: Team) => {
  let req = new RequestService()
  const res = await req.fetchEndpoint("teams", "POST", team);
  return res?.data;
}

const UpdateTeam = async (id: number, team: Team) => {
  let req = new RequestService()
  const res = await req.fetchEndpoint(`teams/${id}`, "PUT", team);
  return res?.data;
}

const DeleteTeam = async (id: number) => {
  let req = new RequestService()
  const res = await req.fetchEndpoint(`teams/${id}`, "DELETE");
  return res?.data;
}

export {
  GetTeams,
  AddTeam,
  UpdateTeam,
  DeleteTeam
}