import { GetHistoByIndicators } from "../../services/Top5/historical";
import { useCallback, useEffect, useState } from "react";
import { Indicator } from "../../models/Top5/indicator";
import { Curve } from "../../models/Top5/curve";
import { GetDataByDateAndCurves } from "../../services/Top5/data";
import { Context } from "chartjs-plugin-datalabels/types/context";
import {
  floatingMonths,
  getDays,
} from "../../pages/dashboard/GridComponents/services";
import { Historical } from "../../models/Top5/historical";
import { DatasetType } from "../../models/Top5/dataset";

export const useHistorical = (
  indicators: Indicator[],
  selectedYear: string
) => {
  const [data, setData] = useState<Array<any>>([]);

  useEffect(() => {
    refreshForm();
  }, [indicators, selectedYear]);

  const refreshForm = useCallback(async () => {
    let indic: Array<any> = [];

    for (let i = 0; i < indicators.length; i++) {
      let histo = [];
      for (let j = 0; j < 12; j++) {
        histo.push({
          data: "",
          target: "",
          comment: "",
          year: selectedYear,
          month: (j + 1).toString().padStart(2, "0"),
          idHisto: 0,
        });
      }

      indic.push({
        indicatorId: indicators[i].id,
        indicatorMode: indicators[i].indicatorMode,
        name: indicators[i].name,
        historicals: histo,
      });
    }

    const res = await GetHistoByIndicators(indicators, parseInt(selectedYear));
    if (res) {
      for (let i = 0; i < res.length; i++) {
        let indexIndic = indic.findIndex(
          (indicator) => indicator.indicatorId == res[i].indicatorId
        );
        if (indexIndic != -1) {
          let indexMonth = indic[indexIndic].historicals.findIndex(
            (histo: any) => histo.month == res[i].month
          );
          if (indexMonth != -1) {
            indic[indexIndic].historicals[indexMonth] = {
              data: res[i].data,
              target: res[i].target,
              comment: res[i].comment,
              year: res[i].year,
              month: res[i].month,
              idHisto: res[i].id,
            };
          }
        }
      }
    }

    console.debug(indic);
    setData(indic);
  }, [indicators, selectedYear]);

  return {
    data,
    refreshForm,
  };
};

export const useHistoricalMonthly = () => {
  const getHistoMonthlyByIndicatorAndDate = async (props: {
    indicatorId: number;
    month: number;
    year: number;
    indicator?: Indicator;
  }) => {
    const curves: Array<Curve> = props.indicator?.curves || [];
    const date = new Date(
      props.year !== undefined ? props.year : new Date().getFullYear(),
      props.month !== undefined ? props.month : new Date().getMonth(),
      1
    );
    let currentMinValue = 0;
    let currentMaxValue = 0.5;
    const days = getDays(date);
    let datasets: Array<DatasetType> = [];
    const curvesDataRequests = curves.map((curve, i) => {
      let dataset: DatasetType = { data: [] };
      switch (curve.curveType) {
        case 0: // Bar
          dataset = {
            label: curve.name,
            type: "bar",
            backgroundColor: curve.color,
            borderColor: curve.color,
            hoverBackgroundColor: curve.color,
            hoverBorderColor: curve.color,
            barPercentage: 1,
            order: 2,
            stack: curve.name,
            data: [],
          };
          break;
        case 1: //Stacked Bar
          dataset = {
            label: curve.name,
            type: "bar",
            backgroundColor: curve.color,
            borderColor: curve.color,
            hoverBackgroundColor: curve.color,
            hoverBorderColor: curve.color,
            barPercentage: 1,
            order: 3,
            stack: "stacked-bar",
            data: [],
          };
          break;
        case 2: // Line
          dataset = {
            label: curve.name,
            type: "line",
            backgroundColor: "#fff",
            borderColor: curve.color,
            hoverBackgroundColor: "#fff",
            hoverBorderColor: curve.color,
            pointRadius: 0,
            order: 1,
            data: [],
          };
          break;
        default:
          break;
      }
      if (i === 0) {
        dataset = { ...dataset, comment: [] };
      }
      datasets = [...datasets, dataset];
      return GetDataByDateAndCurves([curve], date);
    });
    const targets = props.indicator?.targets || [];
    let targetDatas: Array<Array<number>> = [];
    let dataset: DatasetType;
    const nbDays = getDays(date).length;
    if (targets?.length > 0) {
      for (let i = 0; i < targets.length; i++) {
        let tData: Array<number> = [];

        if (targets[i].targetType === 0) {
          const target = parseFloat(targets[i].target.toString());
          const targetPerDay = target / nbDays;
          for (let j = 1; j < nbDays + 1; j++)
            tData = [...tData, targetPerDay * j];
        } else if (targets[i].targetType === 1) {
          for (let j = 0; j < nbDays; j++) {
            tData = [...tData, targets[i].target];
          }
        } else if (targets[i].targetType === 2) {
          const target = parseFloat(targets[i].target.toString());
          const targetPerDay = target / nbDays;
          for (let j = 0; j < nbDays; j++) {
            tData = [...tData, target - targetPerDay * j];
          }
        }

        if (targets[i].target < currentMinValue)
          currentMinValue = parseFloat(targets[i].target.toString());
        if (targets[i].target > currentMaxValue)
          currentMaxValue = parseFloat(targets[i].target.toString());

        targetDatas = [...targetDatas, tData];
        dataset = {
          label: targets[i].name,
          type: "line",
          backgroundColor: "#fff",
          borderColor: targets[i].color,
          hoverBackgroundColor: "#fff",
          hoverBorderColor: targets[i].color,
          pointRadius: 0,
          data: targetDatas[i],
          stack: Math.random().toString(),
          datalabels: {
            labels: {
              title: null,
            },
          },
        };
        datasets = [...datasets, dataset];
      }
    }
    const curvesData = await Promise.all(curvesDataRequests);
    curvesData.forEach((c, i) => {
      let datas: Array<number> = [];
      let comments: Array<string> = [];
      days.forEach(() => {
        datas = [...datas, 0];
        comments = [...comments, ""];
      });
      c.forEach((d: { date: string; data: number; comment: string }) => {
        const dataIndex = parseInt(d.date.substring(0, 2)) - 1;
        datas[dataIndex] = d.data;
        comments[dataIndex] = d.comment;
      });

      comments = comments.reverse();
      datasets = datasets.map((dataset, index) => {
        return i === index
          ? { ...dataset, data: datas, comment: i === 0 ? comments : [] }
          : dataset;
      });
    });
    let stackedValues: Array<number> = [];
    datasets.forEach((dataset) => {
      dataset.data.forEach((d, dIndex) => {
        if (dataset.stack === "stacked-bar") {
          if (stackedValues[dIndex] === undefined) stackedValues[dIndex] = d;
          else {
            stackedValues[dIndex] += d;
            if (stackedValues[dIndex] > currentMaxValue)
              currentMaxValue = stackedValues[dIndex];
            if (stackedValues[dIndex] < currentMinValue)
              currentMinValue = stackedValues[dIndex];
          }
        }
        if (d > currentMaxValue) currentMaxValue = d;
        if (d < currentMinValue) currentMinValue = d;
      });
    });
    if (props.indicator?.isDisplayCumulative) {
      let datasetCumul = {
        label: "",
        type: "line",
        backgroundColor: "#fff",
        borderColor: "#fff",
        hoverBackgroundColor: "#fff",
        hoverBorderColor: "#fff",
        barPercentage: 1,
        order: 3,
        stack: "stacked-bar",
        data: stackedValues,
        datalabels: {
          color: function (context: Context) {
            const index = context.dataIndex;
            const value = context.dataset.data[index];
            return value === 0 ? "rgba(255,255,255,0)" : "#000";
          },
          anchor: "start",
          align: "top",
        },
      };
      datasets.push(datasetCumul);
    }
    return { datasets, currentMinValue, currentMaxValue, days };
  };
  return [getHistoMonthlyByIndicatorAndDate];
};

export const useHistoricalIndicator = () => {
  const getHistoricalByIndicator = async (indicator: Indicator) => {
    let datas: Array<number> = [];
    let targets: Array<number> = [];
    let datasets: Array<DatasetType> = [];
    let histoColors: Array<string> = [];

    const histo = indicator.historical || [];
    const months = floatingMonths();
    const historicals = months.map((m) => {
      const currentHisto = histo.find((h: Historical) => {
        return (
          parseInt(h.month) === parseInt(m.number) &&
          parseInt(h.year) === m.year
        );
      });
      return (
        currentHisto || {
          id: 0,
          month: m.number,
          year: m.year,
          target: "",
          data: "",
          indicatorId: indicator,
        }
      );
    });

    const targetData = indicator.targets || [];
    if (targetData.length > 0) {
      const { targetGoal } = targetData[0];
      historicals.forEach((h) => {
        datas = [...datas, parseInt(h.data.toString())];
        targets = [...targets, parseInt(h.target.toString())];
        if (targetGoal === 0) {
          //Target Min.
          if (parseFloat(h.data.toString()) < parseFloat(h.target.toString())) {
            histoColors = [...histoColors, "#DC3545"];
          } else {
            histoColors = [...histoColors, "#28A745"];
          }
        } else if (targetGoal === 1) {
          // Target Max.
          if (parseFloat(h.data.toString()) < parseFloat(h.target.toString())) {
            histoColors = [...histoColors, "#28A745"];
          } else {
            histoColors = [...histoColors, "#DC3545"];
          }
        }
      });
    } else {
      // pas de saisie de target
      historicals.forEach(() => {
        histoColors = [...histoColors, "#3b7ddd"];
      });
    }

    datasets = [
      {
        label: "Target",
        type: "line",
        backgroundColor: "#fff",
        borderColor: "#3B7DDD",
        hoverBackgroundColor: "#ffffff",
        hoverBorderColor: "#3B7DDD",
        pointRadius: 0,
        data: targets,
        datalabels: {
          labels: {
            title: null,
          },
        },
      },
      {
        label: indicator?.name,
        type: "bar",
        backgroundColor: histoColors,
        borderColor: histoColors,
        hoverBackgroundColor: histoColors,
        hoverBorderColor: histoColors,
        barPercentage: 1,
        data: datas,
      },
    ];

    return { datasets };
  };

  return [getHistoricalByIndicator];
};
