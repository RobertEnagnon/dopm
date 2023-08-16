import { SugClassification } from "../models/sugClassification";
import RequestService from "./request";

const GetSugClassifications = async () => {
  let req = new RequestService();
  const res = await req.fetchEndpoint("sugclassifications");
  return res?.data.map((sugClassification: any) => ({
    ...sugClassification,
    createdAt: new Date(sugClassification.createdAt),
    updatedAt: new Date(sugClassification.updatedAt),
  }));
};

const CreateSugClassification = async (data: SugClassification) => {
  let req = new RequestService();
  const res = await req.fetchEndpoint(`sugclassifications`, "POST", data);
  return { sugClassification: res?.data.sugClassification };
};

const UpdateSugClassification = async (data: SugClassification) => {
  let req = new RequestService();
  const res = await req.fetchEndpoint(
    `sugclassifications/${data.id}`,
    "PUT",
    data
  );
  return {
    sugClassification: {
      ...res?.data.sugClassification,
      createdAt: new Date(res?.data.sugClassification.createdAt),
      updatedAt: new Date(res?.data.sugClassification.updatedAt),
    },
  };
};

const DeleteSugClassification = async (id: number) => {
  let req = new RequestService();
  const res = await req.fetchEndpoint(`sugclassifications/${id}`, "DELETE");

  return {
    sugClassification: res?.data.sugClassification,
  };
};

export {
  GetSugClassifications,
  CreateSugClassification,
  UpdateSugClassification,
  DeleteSugClassification,
};
