import { Target } from "../../models/Top5/target";
import RequestService from "../request";

const GetTargetsByIndicator = async (indicatorId: number) => {
  let targets: Array<Target> = [];

  let req = new RequestService();
  const res = await req.fetchEndpoint(`targets/?indicatorId=${indicatorId}`);
  res?.data?.forEach((data: any) => {
    targets.push({
      id: data.id,
      name: data.name,
      target: data.target,
      color: data.color,
      targetType: data.targetType,
      targetGoal: data.targetGoal,
    });
  });

  return targets;
};

const CreateTarget = async (data: any) => {
  const targetToCreate = {
    name: data.name,
    target: data.target.toString(),
    color: data.color,
    targetType: data.targetType,
    targetGoal: data.targetGoal,
    indicatorId: data.indicatorId,
  };

  let req = new RequestService();
  const res = req.fetchEndpoint(`targets`, "POST", targetToCreate);
  return res;
};

const DeleteTargetsByIndicator = async (indicatorId: number) => {
  let req = new RequestService();
  return await req.fetchEndpoint(`targets/deleteAll/${indicatorId}`, "DELETE");
};

const UpdateTarget = async (data: any) => {
  let req = new RequestService();
  const res = await req.fetchEndpoint(`targets/${data.id}`, "PUT", data);
  return res;
};

const DeleteTarget = async (targetId: number) => {
  let req = new RequestService();
  const res = await req.fetchEndpoint(`targets/${targetId}`, "DELETE");
  return res;
};

export {
  GetTargetsByIndicator,
  CreateTarget,
  DeleteTargetsByIndicator,
  UpdateTarget,
  DeleteTarget,
};
