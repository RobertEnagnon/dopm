import { Curve } from "./Top5/curve";
import { Target } from "./Top5/target";
import { Data } from "./Top5/data";
import { Historical } from "./Top5/historical";

type Chart = {
  historical: Array<Historical>;
  targets: Array<Target>;
  curves: Array<Curve>;
  data: Array<Data>;
};

type ModuleChart = Omit<Chart, "curves">;

export type { Chart, ModuleChart };
