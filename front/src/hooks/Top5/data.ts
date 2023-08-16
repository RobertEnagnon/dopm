import { GetDataByDateAndCurves } from "../../services/Top5/data";
import { Data } from "../../models/Top5/data";
import { Indicator } from "../../models/Top5/indicator";

export const useData = () => {
  const getCurveData = async (
    indicator: Indicator,
    month: number,
    year: number,
    labels: Array<string>,
    data: Array<number>,
    colors: Array<string>
  ) => {
    const date = new Date(
      year !== undefined ? year : new Date().getFullYear(),
      month !== undefined ? month : new Date().getMonth(),
      1
    );
    const curves = indicator?.curves;
    for await (let curve of curves || []) {
      const monthDatas = await GetDataByDateAndCurves([curve], date);
      const sum = monthDatas.reduce((total: number, current: Data) => {
        let data: number = parseInt(current.data.toString());
        return isNaN(data) ? total : total + data;
      }, 0);
      labels = [...labels, curve.name];
      data = [...data, sum];
      colors = [...colors, curve.color];
    }

    return { labels, data, colors };
  };

  return [getCurveData];
};
