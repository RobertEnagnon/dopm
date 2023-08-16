import { Branch } from "./branch";
import { Indicator } from "./indicator";

const defaultCategory: Category = {
  id: 0,
  name: "",
};

type Category = {
  id: number;
  name: string;
  orderCategory?: number;
  branch?: Branch;
  indicator?: Array<Indicator>;
  color?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type { Category };

export { defaultCategory };
