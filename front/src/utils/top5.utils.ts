import { IndicatorMode } from "./../models/Top5/indicator";
import { Historical } from "../models/Top5/historical";
import moment from "moment";
import { Curve } from "../models/Top5/curve";
import { Data } from "../models/Top5/data";
import { Target } from "../models/Top5/target";
import { Color } from "./dopm.utils";

export enum TargetGoal {
  targetMin = 0,
  targetMax = 1,
}

export enum TargetType {
  Croissante = 0,
  Horizontale = 1,
  Decroissante = 2,
}

export enum CurveType {
  bar = 0,
  stackedBar = 1,
  line = 2,
}

export enum IndicatorReading {
  yesterdayReading = 0,
  todayReading = 1,
  tomorrowReading = 2,
}

export enum DataType {
  Data = "data",
  Histo = "histo",
}

const CurveTypeFrench = ["Histogramme", "Histogramme Empilé", "Courbe"];
const TargetTypeFrench = ["Croissante", "Horizontale", "Décroissante"];
const TargetGoalFrench = ["Target Min.", "Target Max."];

// @ts-ignore
export const Unities = [
  "%",
  "x€",
  "xk€",
  "xM€",
  "x.x€",
  "x.xk€",
  "x.xM€",
  "x.xx€",
  "x.xxk€",
  "x.xxM€",
  "Nbr (x.xx)",
  "Nbr (x)",
  "Nbr H",
  "Nbr/H",
  "Pcs",
  "Pcs/H",
  "s",
  "min",
  "h",
];

export const Ranges = [5, 10, 12, 18, 24];

// Regex pour formatter chaque unité
export const RegexByUnities = [
  {
    regex: /^([-])?\d{1,}(\.\d{0,3})?$/g,
    message: "Format attendu : nombre (x.xxx%)",
  }, // Regex pour (%)
  {
    regex: /^([-])?\d*$/g,
    message: "Format attendu : nombre sans décimale (x)",
  }, // Regex pour (x€)
  {
    regex: /^([-])?\d*$/g,
    message: "Format attendu : nombre sans décimale (x)",
  }, // Regex pour (xk€)
  {
    regex: /^([-])?\d*$/g,
    message: "Format attendu : nombre sans décimale (x)",
  }, // Regex pour (xM€)
  {
    regex: /^([-])?\d{1,}(\.\d{0,2})?$/g,
    message: "Format attendu : nombre avec 2 décimales (x.xx)",
  }, // Regex pour (x.x€)
  {
    regex: /^([-])?\d{1,}(\.\d{0,2})?$/g,
    message: "Format attendu : nombre avec 2 décimales (x.xx)",
  }, // Regex pour (x.xk€)
  {
    regex: /^([-])?\d{1,}(\.\d{0,2})?$/g,
    message: "Format attendu : nombre avec 2 décimales (x.xx)",
  }, // Regex pour (x.xM€)
  {
    regex: /^([-])?\d{1,}(\.\d{0,2})?$/g,
    message: "Format attendu : nombre avec 2 décimales (x.xx)",
  }, // Regex pour (x.xx€)
  {
    regex: /^([-])?\d{1,}(\.\d{0,2})?$/g,
    message: "Format attendu : nombre avec 2 décimales (x.xx)",
  }, // Regex pour (x.xxk€)
  {
    regex: /^([-])?\d{1,}(\.\d{0,2})?$/g,
    message: "Format attendu : nombre avec 2 décimales (x.xx)",
  }, // Regex pour (x.xxM€)
  {
    regex: /^([-])?\d{1,}(\.\d{0,2})?$/g,
    message: "Format attendu : nombre avec 2 décimales (x.xx)",
  }, // Regex pour (Nbr (x.x))
  {
    regex: /^([-])?\d*$/g,
    message: "Format attendu : nombre sans décimale (x)",
  }, // Regex pour (Nbr (x))
  {
    regex: /^([-])?\d*$/g,
    message: "Format attendu : nombre sans décimale (x)",
  }, // Regex pour (Nbr H!)
  {
    regex: /^([-])?\d*$/g,
    message: "Format attendu : nombre sans décimale (x)",
  }, // Regex pour (Nbr/H)
  {
    regex: /^([-])?\d*$/g,
    message: "Format attendu : nombre sans décimale (x)",
  }, // Regex pour (Pcs)
  {
    regex: /^([-])?\d*$/g,
    message: "Format attendu : nombre sans décimale (x)",
  }, // Regex pour (Pcs/H)
  {
    regex: /^([-])?\d*$/g,
    message: "Format attendu : nombre sans décimale (x)",
  }, // Regex pour (s)
  {
    regex: /^([-])?\d*$/g,
    message: "Format attendu : nombre sans décimale (x)",
  }, // Regex pour (min)
  {
    regex: /^([-])?\d*$/g,
    message: "Format attendu : nombre sans décimale (x)",
  }, // Regex pour (h)
];

// @ts-ignore
export const getYears = () => {
  const firstYear = moment().subtract(5, "years").year();
  const lastYear = moment().add(1, "years").year();
  let years = [];

  for (let i = firstYear; i <= lastYear; i++) {
    years.push(i.toString());
  }

  return years;
};

export const Reading = ["J-1", "J", "J+1"];

export const monthLabel = [
  "Janv.",
  "Fev.",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juil.",
  "Août",
  "Sept.",
  "Oct.",
  "Nov.",
  "Déc.",
];

/* Float month for Historicals Charts */
const GetFloatMonth = () => {
  const year = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const month = [
    { number: "01", year: year },
    { number: "02", year: year },
    { number: "03", year: year },
    { number: "04", year: year },
    { number: "05", year: year },
    { number: "06", year: year },
    { number: "07", year: year },
    { number: "08", year: year },
    { number: "09", year: year },
    { number: "10", year: year },
    { number: "11", year: year },
    { number: "12", year: year },
  ];

  // Cut the months for get floating months
  let firstPart = month.slice(currentMonth, month.length);
  let secondPart = month.slice(0, currentMonth);

  // Replace year for first part to year-1
  for (let i = 0; i < firstPart.length; i++) {
    firstPart[i].year = year - 1;
  }

  // Return floating month array
  return [...firstPart, ...secondPart];
};

/* Float Array */
const floatingArray = (arrayToFloat: Array<any>) => {
  const currentMonth = new Date().getMonth();
  const firstPart = arrayToFloat.slice(currentMonth, arrayToFloat.length);
  const secondPart = arrayToFloat.slice(0, currentMonth);
  return [...firstPart, ...secondPart];
};

/* Days in a month */
const GetMonthDays = (date: Date) => {
  const month = moment(date).month() + 1;
  const numberOfDays = moment(date).daysInMonth();
  let days = [];

  for (let i = 1; i < numberOfDays + 1; i++) {
    days.push(`${("0" + i).slice(-2)}/${("0" + month).slice(-2)}`);
  }

  return days;
};

/* Format datasets for Historicals Charts */
const GetHistoricalsDatasets = (
  historicals: Array<Historical> | Array<number>,
  targetGoal: TargetGoal,
  indicatorModule: boolean = false
) => {
  let historicalData: Array<number> = [];
  let historicalTarget: Array<number> = [];
  let historicalColor: Array<Color> = [];
  // @ts-ignore
  let indicatorName: string = historicals[0]?.indicator?.name || "Data";
  let datasets = [];

  historicals.forEach((histo: any) => {
    if( indicatorModule ) {
      historicalData.push(histo);
      historicalColor.push(Color.blue);
    } else {
      if (histo.data && histo.target) {
        historicalData.push(histo.data);
        historicalTarget.push(histo.target);

        if (targetGoal === TargetGoal.targetMax) {
          historicalColor.push(
              parseFloat(String(histo.data)) >= parseFloat(String(histo.target))
                  ? Color.red
                  : Color.green
          );
        } else if (targetGoal === TargetGoal.targetMin) {
          historicalColor.push(
              parseFloat(String(histo.data)) <= parseFloat(String(histo.target))
                  ? Color.red
                  : Color.green
          );
        }
      } else {
        historicalData.push(histo);
        historicalTarget.push(0);

        if (targetGoal === TargetGoal.targetMax) {
          historicalColor.push(
              parseFloat(String(histo)) >= parseFloat(String(0))
                  ? Color.red
                  : Color.green
          );
        } else if (targetGoal === TargetGoal.targetMin) {
          historicalColor.push(
            parseFloat(String(histo)) <= parseFloat(String(0))
              ? Color.red
              : Color.green
          );
        }
      }
    }
  });

  if (historicalData.length === 0) {
    historicalData = Array(12).fill(" ");
  }

  if (!indicatorModule) {
    if (historicalTarget.length === 0) {
      historicalTarget = Array(12).fill(" ");
    }

    datasets.push({
      label: "Target",
      type: "line",
      backgroundColor: Color.white,
      borderColor: Color.blue,
      hoverBackgroundColor: Color.white,
      hoverBorderColor: Color.blue,
      pointRadius: 0,
      data: historicalTarget,
      datalabels: {
        labels: {
          title: null,
        },
      },
    })
  }

  datasets.push(
      {
        label: indicatorName,
        type: "bar",
        backgroundColor: historicalColor,
        borderColor: historicalColor,
        hoverBackgroundColor: historicalColor,
        hoverBorderColor: historicalColor,
        barPercentage: 1,
        data: historicalData,
        datalabels: {
          labels: {
            title: historicalData
          }
        }
      }
  )


  return {
    labels: floatingArray(monthLabel),
    datasets: datasets,
  };
};

/* Format options for histo chart */
const GetHistoricalsOptions = (
  unity: string = "0",
  historicals: Array<Historical>
) => {
  let maxValue = 0.5;
  let minValue = 0;

  historicals.forEach((histo) => {
    if (maxValue < histo.target) maxValue = histo.target;
    if (maxValue < histo.data) maxValue = histo.data;
    if (minValue > histo.target) minValue = histo.target;
    if (minValue > histo.data) minValue = histo.data;
  });

  return {
    plugins: {
      datalabels: {
        color: (ctx: any) => {
          const index = ctx.dataIndex;
          const value = ctx.dataset.data[index];
          /**
           * Trois cas de figure pour la couleur
           * 1: value === 0 la data n'existe pas -> couleur transparente
           * 2: value === "0" la data vaut 0 -> couleur #000
           * 3: value !== 0 && value !== "0" -> couleur #fff
           */
          const color =
            value === 0
              ? "rgba(255, 255, 255, 0)"
              : value === "0"
              ? Color.black
              : Color.white;
          return color;
        },
        rotation: (ctx: any) => {
          const index = ctx.dataIndex;
          const value = ctx.dataset.data[index];
          return value.length >= 3 ? 270 : 0;
        },
      },
    },
    maintainAspectRatio: false,
    legend: {
      display: true,
    },
    scales: {
      y: {
        gridLines: {
          display: false,
        },
        stacked: true,
        ticks: {
          stepSize: unity == "10" ? 1 : 0.5,
          beginAtZero: true,
          min: minValue,
          max: maxValue,
          callback: function (value: any, index: number) {
            switch (unity) {
              case "0":
                return value + "%";

              case "1":
                return parseInt(value) + "€";

              case "2":
                return parseInt(value) + "k€";

              case "3":
                return parseInt(value) + "M€";

              case "4":
                value = parseFloat(value) * 10;
                value = parseInt(value);
                value /= 10;
                return value + "€";

              case "5":
                value = parseFloat(value) * 10;
                value = parseInt(value);
                value /= 10;
                return value + "k€";

              case "6":
                value = parseFloat(value) * 10;
                value = parseInt(value);
                value /= 10;
                return value + "M€";

              case "7":
                value = parseFloat(value) * 100;
                value = parseInt(value);
                value /= 100;
                return value + "€";

              case "8":
                value = parseFloat(value) * 100;
                value = parseInt(value);
                value /= 100;
                return value + "k€";

              case "9":
                return value + "H";

              case "10":
                return value;

              case "11":
                return index % 2 == 0 ? parseInt(value) : "";

              case "12":
                return value + "/H";

              case "13":
                return value + " Pcs";

              case "14":
                return value + " Pcs/H";

              case "15":
                return value + "s";

              case "16":
                return value + "m";

              case "17":
                return value + "h";

              default:
                return value;
            }
          },
        },
      },
    },
  };
};

/* Format dataset for data charts */
const GetDataDatasets = (
  curves: Array<Curve>,
  datas: Array<Data>,
  targets: Array<Target>,
  date: Date,
  isDisplayCumulative: boolean,
  indicatorMode: number,
  range: number,
  indicatorName?: string
) => {
  const nbDays = moment(date).daysInMonth();

  // Créer la liste de X semaines pour l'indicateur hebdo (dans le cas
  // journalier la valeur de label sera recalculée plus bas)
  let labels: Array<string> = [];
  if (datas.length) {
    const startWeek: number = parseInt(moment(date).format("w"));
    for (let i = range - 1; i >= 0; i--) {
      if (startWeek - i > 0) labels.push("S" + (startWeek - i).toString());
      else labels.push("S" + (52 + startWeek - i).toString());
    }
  }

  let datasets: Array<any> = [];
  let stackedValues: Array<string> = [];

  // Pour l'indicateur hebdo dans le cas d'histogrammes empilés, la couleur s'applique à
  // toutes les courbes, et dépend de la somme des valeurs pour un jour sur toutes les courbes
  let cumulatedValues: Array<number> = Array(range).fill(0);
  if (indicatorMode === IndicatorMode.Weekly) {
    // Boucle sur les données
    curves.forEach((curve: Curve) => {
      // Données de la courbe
      const data = datas.filter((d) => d.curve?.id === curve.id);

      // Boucle sur les données
      let weeksIndexes: Array<number> = [];
      for (let i = 0; i < data.length; i++) {
        // Trouver à quel numéro de semaine correspond la donnée
        const weekIndex: number = labels.indexOf(
          "S" + moment(data[i].date, "DD-MM-YYYY").format("w")
        );

        // La prendre en compte dans la somme des données si on l'a pas déjà prise en compte
        if (
          !weeksIndexes.includes(weekIndex) &&
          weekIndex >= 0 &&
          weekIndex < range
        ) {
          weeksIndexes.push(weekIndex);
          // Je fais un truc chelou avec parseFloat et toString car je sais pas pq y a des string dans data[i].data
          cumulatedValues[weekIndex] += parseFloat(data[i].data.toString());
        }
      }
    });
  }

  // console.log('cumulatedValues', cumulatedValues)

  // Création des données pour les courbes
  curves.forEach((curve: Curve) => {
    let dataDataset = []; // Données
    let colorsByWeeks: Array<Color> = []; // Couleur de la courbe ou histo

    // Ne garder que les données de la courbe courante
    const data = datas.filter((d) => d.curve?.id === curve.id);

    // Affichage des données par semaine
    if (indicatorMode === IndicatorMode.Weekly) {
      // Pour chaque data, on va remplacer la date par le numéro de semaine
      dataDataset = Array(range).fill("");
      for (let i = 0; i < data.length; i++) {
        const weekIndex = labels.indexOf(
          "S" + moment(data[i].date, "DD-MM-YYYY").format("w")
        );
        if (weekIndex >= 0 && weekIndex < range)
          dataDataset[weekIndex] = data[i].data.toString();
      }

      // On va récupérer la première target pour plus tard comparer la valeur
      // de la donnée avec sa target et ainsi déterminer la couleur de l'histogramme
      // (rouge objectif non atteint, vert objectif atteint)
      if (targets.length) {
        // On  crée le tableau targetData: il correspond à la valeur de la target
        // sur les cinq semaines
        const target = targets[0];
        let targetData: Array<number> = Array(range);
        const targetPerDay = target.target / range;
        if (target.targetType == TargetType.Croissante) {
          for (let i = 0; i < range; i++)
            targetData[i] = targetPerDay * (i + 1);
        } else if (target.targetType == TargetType.Horizontale) {
          for (let i = 0; i < range; i++) targetData[i] = target.target;
        } else if (target.targetType == TargetType.Decroissante) {
          for (let i = 0; i < range; i++)
            targetData[i] = target.target - targetPerDay * i;
        }

        // Boucle sur les semaines pour déterminer les couleurs des histos
        for (let i = 0; i < range; i++) {
          // Dans le cas des histos empilés on va comparer la somme des données
          const valueI =
            curve.curveType === CurveType.stackedBar
              ? cumulatedValues[i]
              : parseFloat(dataDataset[i]);
          if (target.targetGoal === TargetGoal.targetMax) {
            colorsByWeeks.push(
              valueI >= targetData[i] ? Color.red : Color.green
            );
          } else if (target.targetGoal === TargetGoal.targetMin) {
            colorsByWeeks.push(
              valueI <= targetData[i] ? Color.red : Color.green
            );
          }
        }

        // console.log('dataDataset', dataDataset)
        // console.log('target', target)
        // console.log('targetData', targetData)
        // console.log('colorsByWeeks', colorsByWeeks)
      }
    } else {
      labels = GetMonthDays(date);
      dataDataset = Array(nbDays).fill(" ");

      data.forEach((d) => {
        dataDataset[moment(d.date, "DD/MM/YYYY").date() - 1] = d.data;
      });
    }

    if (curve.curveType === CurveType.bar) {
      datasets.push({
        label: curve.name,
        type: "bar",
        backgroundColor:
          indicatorMode === IndicatorMode.Weekly
            ? colorsByWeeks
            : [curve.color],
        borderColor: curve.color,
        hoverBorderColor: curve.color,
        barPercentage: 1,
        order: 2,
        stack: curve.name,
        data: dataDataset,
        datalabels: {
          color: function (context: any) {
            const index = context.dataIndex;
            const value = context.dataset.data[index];
            /**
             * Trois cas de figure pour la couleur
             * 1: value == " " alors parseInt => Naan -> couleur transparente
             * 2: value == "0" -> couleur #000
             * 3: value != " " && value != "0" -> couleur #fff ( Le cas ou on a une valeur )
             */
            const color = isNaN(parseInt(value))
              ? "rgba(255,255,255,0)"
              : value == 0
              ? Color.black
              : Color.white;
            return color;
          },
        },
      });
    } else if (curve.curveType === CurveType.stackedBar) {
      datasets.push({
        label: curve.name,
        type: "bar",
        backgroundColor:
          indicatorMode === IndicatorMode.Weekly
            ? colorsByWeeks
            : [curve.color],
        borderColor: curve.color,
        hoverBorderColor: curve.color,
        barPercentage: 1,
        order: 3,
        stack: "stacked-bar",
        data: dataDataset,
        yAxisID: "y",
        datalabels: {
          color: function (context: any) {
            const index = context.dataIndex;
            const value = context.dataset.data[index];
            return value === 0 ? "rgba(255,255,255,0)" : "#fff";
          },
        },
      });
    } else if (curve.curveType === CurveType.line) {
      datasets.push({
        label: curve.name,
        type: "line",
        // yAxisID: "line",
        backgroundColor: Color.white,
        borderColor: curve.color,
        hoverBorderColor: curve.color,
        pointRadius: 0,
        order: 1,
        data: dataDataset,
        stack: curve.name,
        datalabels: {
          color: function (context: any) {
            const index = context.dataIndex;
            const value = context.dataset.data[index];
            return value === 0 ? "rgba(255,255,255,0)" : "#000";
          },
          anchor: "end",
          align: "end",
        },
      });
    }
  });

  if (indicatorMode == IndicatorMode.Module) {
    let dataDataset = [];
    labels = GetMonthDays(date);
    dataDataset = Array(nbDays).fill(" ");

    datas.forEach((d, i) => {
      dataDataset[i] = d;
    });
    console.log("dataDataset", dataDataset);
    datasets.push({
      label: indicatorName,
      type: "bar",
      backgroundColor: Color.blue,
      borderColor: Color.blue,
      hoverBorderColor: Color.blue,
      barPercentage: 1,
      order: 2,
      stack: indicatorName,
      data: dataDataset,
      datalabels: {
        color: function (context: any) {
          const index = context.dataIndex;
          const value = context.dataset.data[index];
          /**
           * Trois cas de figure pour la couleur
           * 1: value == " " alors parseInt => Naan -> couleur transparente
           * 2: value == "0" -> couleur #000
           * 3: value != " " && value != "0" -> couleur #fff ( Le cas ou on a une valeur )
           */
          const color = isNaN(parseInt(value))
            ? "rgba(255,255,255,0)"
            : value == 0
            ? Color.black
            : Color.white;
          return color;
        },
      },
    });
  }

  if (isDisplayCumulative) {
    datasets.forEach((dset) => {
      if (dset.stack == "stacked-bar") {
        for (let i = 0; i < dset.data.length; i++) {
          if (stackedValues[i] == undefined) {
            stackedValues[i] = dset.data[i];
          } else {
            let newValue =
              parseFloat(stackedValues[i]) + parseFloat(dset.data[i]);
            stackedValues[i] = isNaN(newValue) ? " " : newValue.toString();
          }
        }
      }
    });
  }

  // Création des données pour les targets
  targets.forEach((target: Target) => {
    const targetData = Array(nbDays).fill(" ");

    // Calculer les données pour la target: cas hebdo
    if (indicatorMode === IndicatorMode.Weekly) {
      const targetPerDay = target.target / range;
      if (target.targetType == TargetType.Croissante) {
        for (let i = 0; i < range; i++) targetData[i] = targetPerDay * (i + 1);
      } else if (target.targetType == TargetType.Horizontale) {
        for (let i = 0; i < range; i++) targetData[i] = target.target;
      } else if (target.targetType == TargetType.Decroissante) {
        for (let i = 0; i < range; i++)
          targetData[i] = target.target - targetPerDay * i;
      }
    }

    // Calculer les données pour la target: cas journalier + mensuel
    else {
      const targetPerDay = target.target / nbDays;
      if (target.targetType == TargetType.Croissante) {
        for (let i = 0; i < nbDays; i++) targetData[i] = targetPerDay * (i + 1);
      } else if (target.targetType == TargetType.Horizontale) {
        for (let i = 0; i < nbDays; i++) targetData[i] = target.target;
      } else if (target.targetType == TargetType.Decroissante) {
        for (let i = 0; i < nbDays; i++)
          targetData[i] = target.target - targetPerDay * (i + 1);
      }
    }

    datasets.push({
      order: 0,
      label: target.name,
      type: "line",
      yAxisId: "line",
      backgroundColor: Color.white,
      borderColor: target.color,
      hoverBackgroundColor: Color.white,
      hoverBorderColor: target.color,
      stack: Math.random().toString(),
      pointRadius: 0,
      data: targetData,
      datalabels: {
        labels: {
          title: null,
        },
      },
    });
  });

  if (stackedValues.length > 0) {
    datasets.push({
      label: "",
      type: "line",
      backgroundColor: "transparent",
      borderColor: "transparent",
      hoverBackgroundColor: "transparent",
      hoverBorderColor: "transparent",
      barPercentage: 1,
      order: 5,
      stack: "stacked-values",
      data: stackedValues,
      datalabels: {
        color: function (context: any) {
          const index = context.dataIndex;
          const value = context.dataset.data[index];
          return value === 0 ? "rgba(255,255,255,0)" : "#000";
        },
        anchor: "end",
        align: "end",
      },
    });
  }

  return {
    labels: labels,
    datasets: datasets,
  };
};

/* Format option for data charts */
const GetDataOptions = (unity: string = "0", datas: Array<Data>) => {
  let maxValue = 0.5;
  let minValue = 0;

  datas.forEach((data) => {
    if (maxValue < data.data) maxValue = data.data;
    if (minValue > data.data) minValue = data.data;
  });

  return {
    plugins: {
      datalabels: {
        color: (ctx: any) => {
          const index = ctx.dataIndex;
          const value = ctx.dataset.data[index];
          return value == 0 ? Color.black : Color.white;
        },
        rotation: (ctx: any) => {
          const index = ctx.dataIndex;
          const value = ctx.dataset.data[index];
          return value.length >= 3 ? 270 : 0;
        },
      },
    },
    maintainAspectRatio: false,
    legend: {
      display: true,
    },
    scales: {
      y: {
        gridLines: {
          display: false,
        },
        stacked: true,
        ticks: {
          stepSize: unity == "10" ? 1 : 0.5,
          beginAtZero: true,
          min: minValue,
          max: maxValue,
          callback: function (value: any, index: number) {
            switch (unity) {
              case "0":
                return value + "%";

              case "1":
                return parseInt(value) + "€";

              case "2":
                return parseInt(value) + "k€";

              case "3":
                return parseInt(value) + "M€";

              case "4":
                value = parseFloat(value) * 10;
                value = parseInt(value);
                value /= 10;
                return value + "€";

              case "5":
                value = parseFloat(value) * 10;
                value = parseInt(value);
                value /= 10;
                return value + "k€";

              case "6":
                value = parseFloat(value) * 10;
                value = parseInt(value);
                value /= 10;
                return value + "M€";

              case "7":
                value = parseFloat(value) * 100;
                value = parseInt(value);
                value /= 100;
                return value + "€";

              case "8":
                value = parseFloat(value) * 100;
                value = parseInt(value);
                value /= 100;
                return value + "k€";

              case "9":
                return value + "H";

              case "10":
                return value;

              case "11":
                return index % 2 == 0 ? parseInt(value) : "";

              case "12":
                return value + "/H";

              case "13":
                return value + " Pcs";

              case "14":
                return value + " Pcs/H";

              case "15":
                return value + "s";

              case "16":
                return value + "m";

              case "17":
                return value + "h";

              default:
                return value;
            }
          },
        },
      },
      line: {
        display: false,
        gridLines: {
          display: false,
        },
        stacked: false,
        ticks: {
          stepSize: unity == "10" ? 1 : 0.5,
          beginAtZero: true,
          min: minValue,
          max: maxValue,
        },
      },
    },
  };
};

/* GetComments for top5 */
const GetComment = (datas: Array<Data>, date: Date, indicatorMode: number) => {
  let comments: Array<any> = [];

  // Commentaire pour les indicateurs hebdo
  if (indicatorMode === IndicatorMode.Weekly) {
    let weeks: Array<string> = [];
    datas.forEach((data) => {
      const date = "S" + moment(data.date, "DD-MM-YYYY").format("w");
      if (!weeks.includes(date) && data.comment != "") {
        weeks.push(date);
        comments.push({
          label: date,
          comment: data.comment,
        });
      }
    });
    return comments;
  }

  // Commentaires pour les indicateurs journaliers
  const currentMonth = moment(date).month();
  datas.forEach((data) => {
    const dataDate = moment(data.date, "DD/MM/YYYY");
    if (dataDate.month() === currentMonth) {
      if (data.comment != "") {
        comments.push({
          label: dataDate.format("DD/MM"),
          comment: data.comment,
        });
      }
    }
  });

  // @ts-ignore
  comments.sort((a, b) => {
    if (moment(a.label, "DD/MM").date() > moment(b.label, "DD/MM").date()) {
      return -1;
    } else if (
      moment(a.label, "DD/MM").date() < moment(b.label, "DD/MM").date()
    ) {
      return 1;
    }
    return 0;
  });

  return comments;
};

const displayTargetType = (targetTypeId: number): string => {
  let targetTypeText = "";
  Object.entries(TargetTypeFrench).forEach(
    (key: Array<string>, value: number) => {
      value == targetTypeId && (targetTypeText = key[1].toString());
    }
  );
  return targetTypeText;
};

const displayTargetGoal = (targetGoalId: number): string => {
  let targetGoalText = "";
  Object.entries(TargetGoalFrench).forEach(
    (key: Array<string>, value: number) => {
      value == targetGoalId && (targetGoalText = key[1].toString());
    }
  );
  return targetGoalText;
};

const displayCurveType = (curveTypeId: number): string => {
  let curveTypeText = "";
  Object.entries(CurveTypeFrench).forEach(
    (key: Array<string>, value: number) => {
      value == curveTypeId && (curveTypeText = key[1].toString());
    }
  );
  return curveTypeText;
};

const displayIndicatorReading = (readingId: number): string => {
  let readingText = "";
  Object.entries(Reading).forEach((key: Array<string>, value: number) => {
    value == readingId && (readingText = key[1].toString());
  });
  return readingText;
};

const displayIndicatorUnity = (unityId: string): string => {
  let unityText = "";
  Object.entries(Unities).forEach((key: Array<string>, value: number) => {
    value == parseInt(unityId) && (unityText = key[1].toString());
  });
  return unityText;
};

const getInitialDate = (isAlterateDate: boolean = false): Date => {
  const actualDate = new Date();
  if (isAlterateDate) {
    return moment(actualDate).subtract(1, "days").toDate();
  } else {
    return new Date();
  }
};

export {
  GetFloatMonth,
  GetMonthDays,
  GetHistoricalsDatasets,
  GetHistoricalsOptions,
  GetDataDatasets,
  GetDataOptions,
  GetComment,
  displayCurveType,
  displayTargetType,
  displayTargetGoal,
  displayIndicatorReading,
  displayIndicatorUnity,
  getInitialDate,
};
