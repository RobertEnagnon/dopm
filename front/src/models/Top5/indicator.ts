import { Category } from "./category";
import { Curve } from "./curve";
import { Target } from "./target";
import { Historical } from "./historical";

export enum IndicatorMode {
  // eslint-disable-next-line no-unused-vars
  Daily = 0,
  // eslint-disable-next-line no-unused-vars
  PDF = 1,
  // eslint-disable-next-line no-unused-vars
  File = 2,
  // eslint-disable-next-line no-unused-vars
  Weekly = 3,
  // eslint-disable-next-line no-unused-vars
  Monthly = 4,
  // eslint-disable-next-line no-unused-vars
  Module = 5,
}

export enum IndicatorModule {
  // eslint-disable-next-line no-unused-vars
  FicheSecurity = 0,
}

export enum IndicatorCalculHisto {
  // eslint-disable-next-line no-unused-vars
  ANY = 1,
  // eslint-disable-next-line no-unused-vars
  LAST = 2,
  // eslint-disable-next-line no-unused-vars
  AVERAGE = 3,
  // eslint-disable-next-line no-unused-vars
  SUM = 4,
}

type CalculHisto = {
  id: number;
  libelle: string;
  description: string;
};

type Indicator = {
  id: number;
  name: string;
  orderIndicator?: number;
  reading?: number;
  unity?: string;
  responsible?: string;
  isDisplayCumulative?: boolean;
  category?: Category;
  categoryId?: number;
  curves?: Array<Curve>;
  targets?: Array<Target>;
  historical?: Array<Historical>;
  range?: number;
  color?: string;
  indicatorMode: IndicatorMode;
  indicatorCalculHisto: IndicatorCalculHisto;
  file?: File;
  fileName?: string;
  fileType?: number;
  updatedAt: string;
  isArchived: boolean;
  module?: number;
  moduleZoneId?: number;
};

export type { Indicator, CalculHisto };
