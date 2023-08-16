import RequestService from "../request";

import { CreateCurve, UpdateCurve } from "./curve";
import { CreateTarget, UpdateTarget } from "./target";

import { Indicator, IndicatorMode } from "../../models/Top5/indicator";
import { Curve } from "../../models/Top5/curve";
import { Target } from "../../models/Top5/target";
import { Data } from "../../models/Top5/data";
import {
  CurveType,
  IndicatorReading,
  TargetGoal,
  TargetType,
} from "../../utils/top5.utils";
import moment from "moment";
import "moment/locale/fr";
import { Category } from "../../models/Top5/category";
import { GetChartByModule } from "../chart";

export const formatDate = (date: string = moment().toString()): string => {
  return moment(date).locale("fr").format("LLL");
};

const GetIndicatorsByCategory = async (
  categoryId: number,
  getColor: boolean = false,
  archivedIndicators: boolean = false
) => {
  let indicators: Array<Indicator> = [];
  let req = new RequestService();

  const res = await req.fetchEndpoint(`indicators/?categoryId=${categoryId}`);
  if (res) {
    for (const data of res.data) {
      //console.log("archivedIndicators ", archivedIndicators);
      if (!archivedIndicators && data.isArchived) continue;
      if (archivedIndicators && !data.isArchived) continue;

      // Ce code est temporaire, il permet d'assurer la transition
      // où l'on va supprimer la propriété isMonthlyMode
      let indicatorMode = data.indicatorMode;
      if (data.indicatorMode === 0)
        indicatorMode =
          data.isMonthlyMode === true
            ? IndicatorMode.Monthly
            : IndicatorMode.Daily;

      /**
       * La couleur depend de si oui ou non
       * le mode mensuel est activé
       */
      let color =
        indicatorMode === IndicatorMode.Monthly ||
        indicatorMode === IndicatorMode.Weekly
          ? "primary"
          : "warning";

      if (
        getColor &&
        data.targets.length > 0 &&
        indicatorMode !== IndicatorMode.Monthly &&
        indicatorMode !== IndicatorMode.Weekly &&
        indicatorMode !== IndicatorMode.Module
      ) {
        const curves = data.curves;
        const targets = data.targets;

        if (curves) {
          let datas = data.data as Data[];
          let d: Data[] | undefined;

          switch (data.reading) {
            case IndicatorReading.yesterdayReading:
              d = datas.filter(
                (f) =>
                  f.date == moment().subtract(1, "day").format("DD/MM/YYYY")
              );
              break;
            case IndicatorReading.todayReading:
              d = datas.filter((f) => f.date == moment().format("DD/MM/YYYY"));
              break;

            case IndicatorReading.tomorrowReading:
              d = datas.filter(
                (f) => f.date == moment().add(1, "day").format("DD/MM/YYYY")
              );
              break;
            default:
              break;
          }

          d = d?.filter(
            (f) => f.curve?.indicator_id == data.id && f.data?.toString() != ""
          );

          if (d && d.length > 0 && targets) {
            let totalData: number = 0;
            let maxData: number | undefined;
            let minData: number | undefined;

            if (
              d.length > 1 &&
              d.filter((f) => f.curve?.curveType == CurveType.stackedBar)
                .length > 0
            ) {
              d.forEach((dataToAdd) => {
                if (dataToAdd.curve?.curveType == CurveType.stackedBar) {
                  totalData += Number(dataToAdd.data);
                }
              });
            } else if (d.length > 0) {
              d.forEach((dataToAdd) => {
                if (
                  maxData == undefined ||
                  parseFloat(maxData.toString()) <
                    parseFloat(dataToAdd.data.toString())
                ) {
                  maxData = dataToAdd.data;
                }
                if (
                  minData == undefined ||
                  parseFloat(minData.toString()) >
                    parseFloat(dataToAdd.data.toString())
                ) {
                  minData = dataToAdd.data;
                }
              });

              if (minData != undefined && maxData != undefined) {
                if (targets[0].targetGoal == TargetGoal.targetMax) {
                  totalData = maxData;
                } else if (targets[0].targetGoal == TargetGoal.targetMin) {
                  totalData = minData;
                }
              }
            }

            if (targets[0].targetType == TargetType.Croissante) {
              const nbDays = moment().daysInMonth();
              const date = moment(d[0].date, "DD/MM/YYYY");
              const indexDay = date.date();

              let targetPerDay = parseFloat(targets[0].target) / nbDays;
              let target = targetPerDay * indexDay;

              if (targets[0].targetGoal == TargetGoal.targetMax) {
                color =
                  parseFloat(target?.toString()) >=
                  parseFloat(totalData?.toString())
                    ? "success"
                    : "danger";
              } else if (targets[0].targetGoal == TargetGoal.targetMin) {
                color =
                  parseFloat(target?.toString()) <=
                  parseFloat(totalData?.toString())
                    ? "success"
                    : "danger";
              }
            } else if (targets[0].targetType == TargetType.Decroissante) {
              const nbDays = moment().daysInMonth();
              const date = moment(d[0].date, "DD/MM/YYYY");
              const indexDay = date.date();

              let targetPerDay = parseFloat(targets[0].target) / nbDays;
              let target = targets[0].target - indexDay * targetPerDay;

              if (targets[0].targetGoal == TargetGoal.targetMax) {
                color =
                  parseFloat(target?.toString()) >=
                  parseFloat(totalData?.toString())
                    ? "success"
                    : "danger";
              } else if (targets[0].targetGoal == TargetGoal.targetMin) {
                color =
                  parseFloat(target?.toString()) <=
                  parseFloat(totalData?.toString())
                    ? "success"
                    : "danger";
              }
            } else if (targets[0].targetType == TargetType.Horizontale) {
              let target = targets[0].target;

              if (targets[0].targetGoal == TargetGoal.targetMax) {
                color =
                  parseFloat(target) >= parseFloat(totalData?.toString())
                    ? "success"
                    : "danger";
              } else if (targets[0].targetGoal == TargetGoal.targetMin) {
                color =
                  parseFloat(target) <= parseFloat(totalData?.toString())
                    ? "success"
                    : "danger";
              }
            }
          }
        }
      }

      if( getColor && indicatorMode === IndicatorMode.Module ) {
        const chartModule = await GetChartByModule(data.id, data.module, data.moduleZoneId, new Date())
        let day = new Date().getDay();

        switch (data.reading) {
          case IndicatorReading.yesterdayReading:
            day -= 1;
            break;
          case IndicatorReading.todayReading:
            break;

          case IndicatorReading.tomorrowReading:
            day += 1;
            break;
          default:
            break;
        }

        if (chartModule?.targets[0]?.targetType == TargetType.Croissante) {
          const nbDays = moment().daysInMonth();

          let targetPerDay = chartModule.targets[0].target / nbDays;
          let target = targetPerDay * day;

          if (chartModule.targets[0].targetGoal == TargetGoal.targetMax) {
            color =
                parseFloat(target?.toString()) >=
                parseFloat(chartModule.data[day-1]?.toString())
                    ? "success"
                    : "danger";
          } else if (chartModule.targets[0].targetGoal == TargetGoal.targetMin) {
            color =
                parseFloat(target?.toString()) <=
                parseFloat(chartModule.data[day-1]?.toString())
                    ? "success"
                    : "danger";
          }
        } else if (chartModule.targets[0].targetType == TargetType.Decroissante) {
          const nbDays = moment().daysInMonth();

          let targetPerDay = chartModule.targets[0].target / nbDays;
          let target = chartModule.targets[0].target - day * targetPerDay;

          if (chartModule.targets[0].targetGoal == TargetGoal.targetMax) {
            color =
                parseFloat(target?.toString()) >=
                parseFloat(chartModule.data[day-1]?.toString())
                    ? "success"
                    : "danger";
          } else if (chartModule.targets[0].targetGoal == TargetGoal.targetMin) {
            color =
                parseFloat(target?.toString()) <=
                parseFloat(chartModule.data[day-1]?.toString())
                    ? "success"
                    : "danger";
          }
        } else if (chartModule.targets[0].targetType == TargetType.Horizontale) {
          let target = chartModule.targets[0].target;

          if (chartModule.targets[0].targetGoal == TargetGoal.targetMax) {
            color =
                parseFloat(target.toString()) >= parseFloat(chartModule.data[day-1]?.toString())
                    ? "success"
                    : "danger";
          } else if (chartModule.targets[0].targetGoal == TargetGoal.targetMin) {
            color =
                parseFloat(target.toString()) <= parseFloat(chartModule.data[day-1]?.toString())
                    ? "success"
                    : "danger";
          }
        }
      }

      indicators.push({
        id: data.id,
        name: data.name,
        responsible: data.responsible,
        orderIndicator: data.orderIndicator,
        indicatorMode: indicatorMode,
        unity: data.unity,
        reading: data.reading,
        color: color,
        fileType: data.fileType,
        fileName: data.fileName,
        curves: data.curves,
        targets: data.targets,
        indicatorCalculHisto: data.indicatorCalculHisto,
        isDisplayCumulative: data.isDisplayCumulative == true,
        updatedAt: formatDate(data.updatedAt),
        range: data.range,
        module: data.module,
        moduleZoneId: data.moduleZoneId,
        isArchived: data.isArchived,
      });
    }
  }

  return indicators;
};

const GetIndicatorById = async (id: number) => {
  let indicator: Indicator | undefined = undefined;

  let req = new RequestService();

  const res: any = await req.fetchEndpoint(`indicator/${id}`);
  if (res) {
    const curves: Array<Curve> = res.data.curve;
    const targets: Array<Target> = res.data.target;

    // Ce code est temporaire, il permet d'assurer la transition
    // où l'on va supprimer la propriété isMonthlyMode
    let indicatorMode = res.data.indicatorMode;
    if (res.data.indicatorMode === 0)
      indicatorMode =
        res.data.isMonthlyMode === true
          ? IndicatorMode.Monthly
          : IndicatorMode.Daily;

    indicator = {
      id: res.data.id,
      name: res.data.name,
      orderIndicator: res.data.orderIndicator,
      responsible: res.data.responsible,
      unity: res.data.unity,
      curves: curves,
      targets: targets,
      fileType: res.data.fileType,
      fileName: res.data.fileName,
      indicatorMode: indicatorMode,
      indicatorCalculHisto: res.data.indicatorCalculHisto,
      updatedAt: formatDate(res.data.updatedAt),
      range: res.data.range,
      isArchived: res.data.isArchived,
    };
  }

  return indicator;
};

const GetIndicatorsByCategories = async (categories: Array<Category>) => {
  let indicators: Array<Indicator> = [];

  for (const cat of categories) {
    const res = await GetIndicatorsByCategory(cat.id);
    if (res != undefined) {
      indicators = indicators.concat(res);
    }
  }

  return indicators;
};

const CreateIndicator = async (data: any) => {
  let req = new RequestService();
  const resIndicator: any = await req.fetchEndpoint("indicators", "POST", data);
  let resIndicatorFile;

  if (resIndicator.data.indicator && data.indicatorMode == IndicatorMode.PDF) {
    let fileData = new FormData();
    fileData.append("file", data.file);

    resIndicatorFile = await req.fetchEndpoint(
      "indicators/file-upload",
      "POST",
      fileData,
      false,
      undefined,
      false,
      { "content-type": "multipart/form-data" }
    );

    if (resIndicatorFile?.data.file) {
      await req.fetchEndpoint(
        `indicators/${resIndicator.data.indicator.id}`,
        "PUT",
        { ...resIndicator.data.indicator, fileName: resIndicatorFile.data.file }
      );
    } else {
      await req.fetchEndpoint(
        `indicators/${resIndicator.data.indicator.id}`,
        "DELETE"
      );
    }
  }

  if (
    
    resIndicator.data.indicator &&
   
    (data.indicatorMode == IndicatorMode.Daily ||
        data.indicatorMode == IndicatorMode.Weekly ||
        data.indicatorMode == IndicatorMode.Monthly ||
      data.indicatorMode == IndicatorMode.Module)
  
  ) {
    for (let i = 0; i < data.curves.length; i++) {
      const resCurve = await CreateCurve({
        ...data.curves[i],
        indicatorId: resIndicator.data.indicator.id,
      });
      if (resIndicator.data.indicator.curves) {
        resIndicator.data.indicator.curves.push(resCurve?.data.curve);
      } else {
        resIndicator.data.indicator.curves = [resCurve?.data.curve];
      }
    }

    for (let i = 0; i < data.targets.length; i++) {
      const resTarget = await CreateTarget({
        ...data.targets[i],
        indicatorId: resIndicator.data.indicator.id,
      });
      if (resIndicator.data.indicator.targets) {
        resIndicator.data.indicator.targets.push(resTarget?.data.target);
      } else {
        resIndicator.data.indicator.targets = [resTarget?.data.target];
      }
    }
  }
  return {
    indicator: resIndicator?.data.indicator,
    indicatorFile: resIndicatorFile?.data.file,
  };
};

const UpdateIndicator = async (data: any) => {
  const indicatorToUpdate: any = {
    id: data.id,
    name: data.name,
    indicatorMode: data.indicatorMode,
    orderIndicator: data.orderIndicator,
    reading: data.reading,
    unity: data.unity?.toString(),
    responsible: data.responsible,
    isDisplayCumulative: data.isDisplayCumulative,
    indicatorCalculHisto: data.indicatorCalculHisto,
    fileType: data.fileType,
    fileName: data.fileName,
    range: data.range,
    isArchived: data.isArchived,
  };

  let req = new RequestService();
  let resIndicatorFile;
  let resIndicator;

  if (data.indicatorMode == IndicatorMode.PDF) {
    let fileData = new FormData();
    fileData.append("file", data.file);

    if (data.file) {
      resIndicatorFile = await req.fetchEndpoint(
        "indicators/file-upload",
        "POST",
        fileData,
        false,
        undefined,
        false,
        { "content-type": "multipart/form-data" }
      );
    }

    if (resIndicatorFile?.data.file) {
      await req.fetchEndpoint("indicators/file-remove", "POST", {
        fileName: data.fileName,
      });

      resIndicator = await req.fetchEndpoint(`indicators/${data.id}`, "PUT", {
        ...data,
        fileName: resIndicatorFile.data.file,
      });
    } else {
      resIndicator = await req.fetchEndpoint(
        `indicators/${data.id}`,
        "PUT",
        indicatorToUpdate
      );
    }
  }

  if (
    
    data.indicatorMode == IndicatorMode.Daily ||
    data.indicatorMode == IndicatorMode.Weekly ||
    data.indicatorMode == IndicatorMode.Monthly
   ||
    data.indicatorMode == IndicatorMode.Module
  ) {
    data.curves?.forEach(async (curve: Curve) => {
      curve.id
        ? await UpdateCurve(curve)
        : await CreateCurve({ ...curve, indicatorId: data.id });
    });

    data.targets?.forEach(async (target: Target) => {
      target.id
        ? await UpdateTarget(target)
        : await CreateTarget({ ...target, indicatorId: data.id });
    });

    resIndicator = await req.fetchEndpoint(
      `indicators/${data.id}`,
      "PUT",
      indicatorToUpdate
    );
  }

  if (data.indicatorMode == IndicatorMode.File) {
    resIndicator = await req.fetchEndpoint(
      `indicators/${data.id}`,
      "PUT",
      indicatorToUpdate
    );
  }

  return resIndicator;
};

const ArchiveIndicator = async (indicator: Indicator) => {
  let req = new RequestService();
  const indicatorToArchive = {
    ...indicator,
    isArchived: !indicator.isArchived,
  };
  return await req.fetchEndpoint(
    `indicators/${indicator.id}`,
    "PUT",
    indicatorToArchive
  );
};

const DeleteIndicator = async (indicator: Indicator) => {
  let req = new RequestService();
  await req.fetchEndpoint(`indicators/${indicator.id}`, "DELETE");
  await req.fetchEndpoint("indicators/file-remove", "POST", {
    fileName: indicator.fileName,
  });
  return req;
};

const DeleteIndicatorsByCategory = async (indicatorId: number) => {
  let req = new RequestService();
  return await req.fetchEndpoint(
    `indicators/deleteAll/${indicatorId}`,
    "DELETE"
  );
};

const DownloadIndicatorFile = async (indicatorId: number) => {
  let req = new RequestService();
  return await req.fetchEndpoint(`indicators/file/${indicatorId}`);
};

export {
  GetIndicatorsByCategory,
  GetIndicatorById,
  GetIndicatorsByCategories,
  CreateIndicator,
  UpdateIndicator,
  DeleteIndicator,
  DeleteIndicatorsByCategory,
  DownloadIndicatorFile,
  ArchiveIndicator,
};
