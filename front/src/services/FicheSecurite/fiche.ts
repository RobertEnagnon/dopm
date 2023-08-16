import RequestService from "../request";
import {Fiche} from "../../models/fiche";

const GetFiches = async () => {
  const fiches: Array<Fiche> = [];
  const req = new RequestService()

  const res = await req.fetchEndpoint("fiches");
  res?.data?.forEach(( fiche: Fiche ) => {
    fiches.push(fiche)
  })

  return fiches;
}

export {
  GetFiches
}