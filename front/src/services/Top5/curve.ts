import { Curve } from "../../models/Top5/curve";
// import axios from "axios";
import RequestService from "../request";
import {Indicator} from "../../models/Top5/indicator";

// const PUBLIC_URL = process.env.REACT_APP_API;

const GetCurvesByIndicator = async (indicatorId: number) => {
  let curves: Array<Curve> = [];

  let req = new RequestService();
  const res = await req.fetchEndpoint(`curves/?indicatorId=${indicatorId}`);
  res?.data.forEach((data: Curve) => {
    curves.push({
      id: data.id,
      name: data.name,
      curveType: data.curveType,
      color: data.color,
      indicatorId: indicatorId,
    });
  });

  return curves;
};

const GetCurvesByIndicators = async (indicators: Array<Indicator>) => {
  let curves: Array<Curve> = [];

  for (const ind of indicators) {
    const res = await GetCurvesByIndicator( ind.id );
    if( res != undefined ) {
      curves = curves.concat(res);
    }
  }

  return curves;
}

const CreateCurve = async (data: any) => {
  const curveToCreate = {
    name: data.name,
    curveType: data.curveType,
    color: data.color,
    indicatorId: data.indicatorId,
  };

  let req = new RequestService();
  const res = await req.fetchEndpoint(`curves`, "POST", curveToCreate);
  return res;
};

const DeleteCurvesByIndicator = async (indicatorId: number) => {
  let req = new RequestService();
  return await req.fetchEndpoint(`curves/deleteAll/${indicatorId}`, "DELETE");
};

const UpdateCurve = async (data: any) => {
  let req = new RequestService();
  const res = await req.fetchEndpoint(`curves/${data.id}`, "PUT", data);
  return res;
};

const DeleteCurve = async (curveId: number) => {
  let req = new RequestService();
  const res = await req.fetchEndpoint(`curves/${curveId}`, "DELETE");
  return res;
};

export {
  GetCurvesByIndicator,
  GetCurvesByIndicators,
  CreateCurve,
  DeleteCurvesByIndicator,
  UpdateCurve,
  DeleteCurve,
};
