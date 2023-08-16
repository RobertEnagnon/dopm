import { Responsible } from "./responsible";
import { Service } from "./service";
import { SugClassification } from "./sugClassification";
import { SugCategory } from "./sugCategory";
import { SugWorkflow } from "./sugWorkflow";
import { Team } from "./team";

type Suggestion = {
  id: number;
  id_sug?: string;
  senderFirstname: string;
  senderLastname: string;
  description: string;
  sugCategory?: SugCategory;
  sugCategoryId?: string;
  sugClassification: SugClassification;
  sugClassificationId?: string;
  service?: Service;
  serviceId?: string;
  team?: Team;
  teamId?: string;
  responsible?: Responsible;
  responsibleId?: string;
  imageNameOne?: string;
  imageNameTwo?: string;
  imageNameThree?: string;
  statusWorkflow?: SugWorkflow;
  createdAt?: Date;
};

type ImgSuggestion = {
  imageNameOne: undefined | string,
  imageNameTwo: undefined | string,
  imageNameThree: undefined | string
}

export type { Suggestion, ImgSuggestion };
