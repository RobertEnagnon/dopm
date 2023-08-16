import { Chart, ModuleChart } from "../models/chart";
// import axios from "axios";
import RequestService from "./request";

// const PUBLIC_URL = process.env.REACT_APP_API;

const GetChartByIndicator = async (
  indicatorId: number,
  date: Date,
  range?: number
) => {
  let chart: Chart;

  let req = new RequestService();
  let res;
  if (!range)
    res = await req.fetchEndpoint(
      `chart/?indicatorId=${indicatorId}&date=${date
        .toLocaleDateString()
        .substring(3)}`
    );
  else
    res = await req.fetchEndpoint(
      `chart/?indicatorId=${indicatorId}&date=${date.toLocaleDateString()}&range=${range}`
    );
  chart = {
    historical: res?.data.historical,
    targets: res?.data.targets,
    curves: res?.data.curves,
    data: res?.data.data,
  };

  return chart;
};

const GetChartByModule = async (
  indicatorId: number,
  moduleId: number,
  moduleZoneId: number,
  date: Date
) => {
  let chart: ModuleChart;

  let req = new RequestService();
  let res = await req.fetchEndpoint(
    `module-chart/?indicatorId=${indicatorId}&moduleId=${moduleId}${
      moduleZoneId !== 0 ? `&moduleZoneId=${moduleZoneId}` : ""
    }&date=${date.toLocaleDateString().substring(3)}`
  );
  chart = {
    historical: res?.data.historical,
    targets: res?.data.targets,
    data: res?.data.datas,
  };

  return chart;
};

export { GetChartByIndicator, GetChartByModule };
