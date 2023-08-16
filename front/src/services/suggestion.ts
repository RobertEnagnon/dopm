import { ImgSuggestion } from "../models/suggestion";
import RequestService from "./request";
import { CreateSugWorkflow, UpdateSugWorkflow } from "./sugWorkflow";

const uploadSuggestionImage = async (req: RequestService, image: File) => {
  let imageData = new FormData();
  let resSuggestionImage;
  imageData.append("image", image);

  resSuggestionImage = await req.fetchEndpoint(
    "suggestions/image-upload",
    "POST",
    imageData,
    false,
    undefined,
    false,
    { "content-type": "multipart/form-data" }
  );

  return resSuggestionImage;
};

const removeSuggestionImage = async (
  req: RequestService,
  imageName: string
) => {
  let resSuggestionImage;

  resSuggestionImage = await req.fetchEndpoint(
    "suggestions/image-remove",
    "POST",
    {
      imageName: imageName,
    }
  );

  return resSuggestionImage;
};

const GetSuggestions = async () => {
  let req = new RequestService();
  const res = await req.fetchEndpoint("suggestions");
  return res?.data.map((suggestion: any) => ({
    ...suggestion,
    createdAt: new Date(suggestion.createdAt),
    updatedAt: new Date(suggestion.updatedAt),
  }));
};

const GetSuggestion = async (
  id: string,
  siblings: "previous" | "next" | null = null
) => {
  let req = new RequestService();
  let url = `suggestion/${id}`;

  if (siblings) {
    url += `?reqType=${siblings}`;
  }

  const res = await req.fetchEndpoint(url);
  return {
    ...res?.data,
    createdAt: new Date(res?.data.createdAt),
    updatedAt: new Date(res?.data.updatedAt),
  };
};

const CreateSuggestion = async (data: any) => {
  let req = new RequestService();
  let resImage1: any;
  let resImage2: any;
  let resImage3: any;
  const lang = localStorage.getItem('lang')
  /**Chargement des images */
  if (data.image1) {
    resImage1 = await uploadSuggestionImage(req, data.image1);
  }

  if (data.image2) {
    resImage2 = await uploadSuggestionImage(req, data.image2);
  }

  if (data.image3) {
    resImage3 = await uploadSuggestionImage(req, data.image3);
  }
  /**Chargement de la fiche */
  const resSuggestion = await req.fetchEndpoint(
    `suggestions`,
    "POST",
    {
      ...data,
      imageNameOne: resImage1?.data.image,
      imageNameTwo: resImage2?.data.image,
      imageNameThree: resImage3?.data.image,
      lang: lang
    }
  )
    .then(r => r)
    .catch(async () => {
      /**
       * On supprime les image si il y a erreur
       */
      await removeSuggestionImage(req, resImage1?.data.image)
      await removeSuggestionImage(req, resImage2?.data.image)
      await removeSuggestionImage(req, resImage3?.data.image)
    })
  return { suggestion: resSuggestion?.data.suggestion };
};

/* eslint-disable no-unused-vars */
const UpdateSuggestion = async (data: any, initialImg?: ImgSuggestion) => {
  console.log(initialImg)
  let req = new RequestService();
  let resImage1: any
  let resImage2: any
  let resImage3: any
  const lang = localStorage.getItem('lang')
  if (data.image1) {
    if (data.initialImgUrl.imageNameOne) { await removeSuggestionImage(req, data.initialImgUrl.imageNameOne) }
    resImage1 = await uploadSuggestionImage(req, data.image1);
  }

  if (data.image2) {
    if (data.initialImgUrl.imageNameTwo) { await removeSuggestionImage(req, data.initialImgUrl.imageNameTwo) }
    resImage2 = await uploadSuggestionImage(req, data.image2);
  }

  if (data.image3) {
    if (data.initialImgUrl.imageNameThree) { await removeSuggestionImage(req, data.initialImgUrl.imageNameThree) }
    resImage3 = await uploadSuggestionImage(req, data.image3);
  }

  const resSuggestion = await req.fetchEndpoint(
    `suggestions/${data.id}`,
    "PUT",
    {
      ...data,
      lang,
      imageNameOne: resImage1?.data.image,
      imageNameTwo: resImage2?.data.image,
      imageNameThree: resImage3?.data.image,
    }
  )
    .then(r => r)
    .catch(async () => {
      /**
       * On supprime les image si il y a erreur
       */
      await removeSuggestionImage(req, resImage1?.data.image)
      await removeSuggestionImage(req, resImage2?.data.image)
      await removeSuggestionImage(req, resImage3?.data.image)
    })

  const resStatusWorkflow = resSuggestion?.data.suggestion.statusWorkflow;
  if (
    resSuggestion &&
    resStatusWorkflow === null &&
    (typeof data.statusValidatedResponsible !== "undefined" || typeof data.statusValidatedComity !== "undefined")
  ) {
    await CreateSugWorkflow({
      firstComment: data.commentResponsible,
      firstValidated: data.statusValidatedResponsible,
      secondComment: data.commentComity,
      secondValidated: data.statusValidatedComity,
      suggestionId: resSuggestion.data.suggestion.id,
    });
  }

  if (
    resSuggestion &&
    resStatusWorkflow &&
    resSuggestion.data.suggestion.statusWorkflow.id &&
    (typeof data.statusValidatedResponsible !== "undefined" || typeof data.statusValidatedComity !== "undefined")
  ) {
    await UpdateSugWorkflow({
      id: resSuggestion.data.suggestion.statusWorkflow.id,
      firstComment: data.commentResponsible,
      firstValidated: data.statusValidatedResponsible,
      secondComment: data.commentComity,
      secondValidated: data.statusValidatedComity,
      suggestionId: resSuggestion.data.suggestion.id,
    });
  }

  return { suggestion: resSuggestion?.data.suggestion };
};

const AddComityUser = async (userId: number) => {
  let req = new RequestService();
  const res = await req.fetchEndpoint("suggestions/comity-user/add", "POST", {
    userId,
  });
  return { message: res?.data.message };
};

const EditComityUser = async (userId: number) => {
  let req = new RequestService();
  const res = await req.fetchEndpoint("suggestions/comity-user/edit", "PUT", {
    userId,
  });
  return { message: res?.data.message };
};

export {
  GetSuggestions,
  GetSuggestion,
  CreateSuggestion,
  UpdateSuggestion,
  AddComityUser,
  EditComityUser,
};
