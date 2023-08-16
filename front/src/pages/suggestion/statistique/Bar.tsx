import { Grid } from "@material-ui/core";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  DropdownItem,
} from "reactstrap";
import { Bar as BarChart } from "react-chartjs-2";
import { Context } from "chartjs-plugin-datalabels/types/context";
import { ChartData, Chart, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { GetSuggestions } from "../../../services/suggestion";
import { Suggestion } from "../../../models/suggestion";
import {Color} from "../../../utils/dopm.utils";

Chart.register(...registerables, ChartDataLabels);
Chart.defaults.scale.grid.display = false;

type SuggestionGet = Suggestion & {
    createdAt: Date,
    updatedAt: Date
}
type FicheBarType = SuggestionGet & {
  day: number,
  month: number,
  year: number
}

const months = [
  { number: 1, value: "Janvier" },
  { number: 2, value: "Février" },
  { number: 3, value: "Mars" },
  { number: 4, value: "Avril" },
  { number: 5, value: "Mai" },
  { number: 6, value: "Juin" },
  { number: 7, value: "Juillet" },
  { number: 8, value: "Aout" },
  { number: 9, value: "Septembre" },
  { number: 10, value: "Octobre" },
  { number: 11, value: "Novembre" },
  { number: 12, value: "Decembre" },
];
const years = [
  2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031,
];

type DatasetType = {
  label?: string,
  type?: string,
  yAxisID?: string,
  backgroundColor?: string | Array<string>,
  borderColor?: string | Array<string>,
  hoverBackgroundColor?: string | Array<string>,
  hoverBorderColor?: string | Array<string>,
  pointRadius?: number,
  order?: number,
  data: Array<number>,
  barPercentage?: number,
  stack?: string,
  comment?: Array<string>,
  datalabels?: Object,
}

export default function Bar({ periode, critere }: { periode: string, critere: string }) {
  const [chartData, setChartData] = useState<{ labels: Array<string>, datasets: Array<DatasetType> }>();
  const [sugs, setSugs] = useState<Array<FicheBarType>>([]);
  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [minValueData, setMinValueData] = useState<number>();
  const [maxValueData, setMaxValueData] = useState<number>();

  const getDays = (date: Date) => {
    let month = date.getMonth() + 1;
    let lastDay =
      new Date(date.getFullYear(), date.getMonth() + 1, -1).getDate() + 1;

    let days = [];

    for (let i = 1; i < lastDay + 1; i++) {
      days.push(`${("0" + i).slice(-2)}/${("0" + month).slice(-2)}`);
    }

    return days;
  }

  const getStatus = (statusWorkflow: any) => {
    let status
    if (!statusWorkflow) {
      status = "Nouvelle"
    } else {
      status = "En cours"
    }

    if (statusWorkflow?.secondValidated) {
      status = "Validée"
    }

    if (statusWorkflow?.firstValidated === false || statusWorkflow?.secondValidated === false) {
      status = "Refusée"
    }

    return status
  }

  useEffect(() => {
    GetSuggestions()
      .then((sugs) => {
        setSugs(sugs.map((fiche: SuggestionGet) => ({
          ...fiche,
          day: fiche.createdAt.getDate(),
          month: fiche.createdAt.getMonth(),
          year: fiche.createdAt.getFullYear(),
        })))
      })
  }, [])

  useEffect(() => {
    if (sugs?.length > 0) {
      if (periode === "mensuel") {
        const currentSugs = sugs.filter((v) => {
          return v.month === month && v.year === year;
        })
        const days = getDays(new Date(year, month))
        if (critere === "status") {
          const indicators = [
            { name: "Nouvelle", color: "#efefef" },
            { name: "En cours", color: "rgb(255 152 0 / 100%)" },
            { name: "Validée", color: "rgb(139 195 74 / 100%)" },
            { name: "Refusée", color: "rgb(229 104 104 / 100%)" },
          ];
          const datasets = indicators.map((indicator) => {

            const filtred = currentSugs.filter(sug => indicator.name === getStatus(sug.statusWorkflow))

            const data = days.map((d) => {
              const currentDay = parseInt(d.split("/")[0]);
              return filtred.filter((f) => {
                return f.day === currentDay;
              }).length
            })
            return {
              label: indicator.name,
              type: "bar",
              backgroundColor: indicator.color,
              borderColor: indicator.color,
              hoverBackgroundColor: indicator.color,
              hoverBorderColor: indicator.color,
              barPercentage: 1,
              order: 3,
              stack: "stacked-bar",
              data: data,
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
                  const color = isNaN(parseInt(value))? "rgba(255,255,255,0)": value == 0? Color.black: Color.white
                  return color
                },
                rotation: (ctx: any) => {
                  const index = ctx.dataIndex;
                  const value = ctx.dataset.data[index];
                  return value.length >= 3 ? 270 : 0;
                },
              }
            }
          })
          setChartData({ datasets, labels: days });
        } else {
          const data = days.map((d) => {
            const currentDay = parseInt(d.split("/")[0]);
            return currentSugs.filter((f) => {
              return f.day === currentDay;
            }).length;
          })
          const dataset = {
            label: "Suggestion",
            type: "bar",
            backgroundColor: "#3b7ddd",
            borderColor: "#3b7ddd",
            hoverBackgroundColor: "#3b7ddd",
            hoverBorderColor: "#3b7ddd",
            barPercentage: 1,
            order: 3,
            data: data,
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
                const color = isNaN(parseInt(value))? "rgba(255,255,255,0)": value == 0? Color.black: Color.white
                return color
              },
              rotation: (ctx: any) => {
                const index = ctx.dataIndex;
                const value = ctx.dataset.data[index];
                return value.length >= 3 ? 270 : 0;
              },
            }
          }
          setChartData({ datasets: [dataset], labels: days })
        }
      } else if (periode === "annuel") {
        const currentSugs = sugs.filter(sug => sug.year === year)

        const monthNames = months.map((m) => {
          return m.value;
        })

        if (critere === "status") {
          const indicators = [
            { name: "Nouvelle", color: "#efefef" },
            { name: "En cours", color: "rgb(255 152 0 / 100%)" },
            { name: "Validée", color: "rgb(139 195 74 / 100%)" },
            { name: "Refusée", color: "rgb(229 104 104 / 100%)" },
          ];
          const datasets = indicators.map((indicator) => {

            const filtred = currentSugs.filter((sug) => indicator.name === getStatus(sug.statusWorkflow))

            const data = monthNames.map((d, index) => {
              return filtred.filter((f) => {
                return f.month === index
              }).length
            })
            return {
              label: indicator.name,
              type: "bar",
              backgroundColor: indicator.color,
              borderColor: indicator.color,
              hoverBackgroundColor: indicator.color,
              hoverBorderColor: indicator.color,
              barPercentage: 1,
              order: 3,
              stack: "stacked-bar",
              data: data,
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
                  const color = isNaN(parseInt(value))? "rgba(255,255,255,0)": value == 0? Color.black: Color.white
                  return color
                },
                rotation: (ctx: any) => {
                  const index = ctx.dataIndex;
                  const value = ctx.dataset.data[index];
                  return value.length >= 3 ? 270 : 0;
                },
              }
            }
          })
          setChartData({ datasets, labels: monthNames });
        } else {
          const data = months.map((m, index) => {
            return currentSugs.filter((f) => {
              return f.month === index;
            }).length
          })
          const dataset = {
            label: "Suggestion",
            type: "bar",
            backgroundColor: "#3b7ddd",
            borderColor: "#3b7ddd",
            hoverBackgroundColor: "#3b7ddd",
            hoverBorderColor: "#3b7ddd",
            barPercentage: 1,
            order: 3,
            data: data,
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
                const color = isNaN(parseInt(value))? "rgba(255,255,255,0)": value == 0? Color.black: Color.white
                return color
              },
              rotation: (ctx: any) => {
                const index = ctx.dataIndex;
                const value = ctx.dataset.data[index];
                return value.length >= 3 ? 270 : 0;
              },
            }
          };
          setChartData({ datasets: [dataset], labels: monthNames });
        }
      }
    }
  }, [sugs, month, year, periode, critere])

  useEffect(() => {
    if (chartData) {
      const totals = chartData.labels.map((v, i) => {
        let total = 0;
        chartData.datasets.forEach((d) => {
          total = total + d.data[i];
        });
        return total;
      });
      console.log(totals);
      const limits = totals.reduce(
        (currentLimits, newValue) => {
          return {
            min: newValue < currentLimits.min ? newValue : currentLimits.min,
            max: newValue > currentLimits.max ? newValue : currentLimits.max,
          };
        },
        {
          min: totals[0] || 0,
          max: totals[0] || 0,
        }
      );
      setMaxValueData(limits.max);
      setMinValueData(limits.min);
    }
  }, [chartData])

  const optionsData = {
    plugins: {
      datalabels: {
        color: function (context: Context) {
          const index = context.dataIndex;
          const value = context.dataset.data[index];
          const curveType = context.dataset.type;
          let color;

          curveType === "line"
            ? (color = "black")
            : value === 0
              ? (color = "black")
              : (color = "white");
          return color;
        },
        rotation: function (context: Context) {
          const index = context.dataIndex;
          const value = context.dataset.data[index];

          if (value && value >= 3) {
            return 270;
          } else {
            return 0;
          }
        },
      },
    },
    maintainAspectRatio: false,
    legend: {
      display: true,
    },
    scales: {
      yAxes:
      {
        stacked: true,
        ticks: {
          beginAtZero: true,
          min: minValueData,
          max: maxValueData,
          callback: (value: number) => {
            return value;
          },
        },
      },
      xAxes:
      {
        stacked: true,
        gridLines: {
          color: "transparent",
        },
      },
    },
  }

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={1}
    >
      <Grid
        container
        item
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
      >
        {periode === "mensuel" && (
          <Grid item>
            <UncontrolledDropdown className="d-inline-block">
              <DropdownToggle
                caret
                color="White"
                style={{ fontSize: "0.9em", padding: "0", marginRight: "6px" }}
              >
                {months[month].value}
              </DropdownToggle>
              <DropdownMenu right>
                {months.map((m, i) => {
                  return (
                    <DropdownItem key={i} onClick={() => setMonth(i)}>
                      {m.value}
                    </DropdownItem>
                  );
                })}
              </DropdownMenu>
            </UncontrolledDropdown>
          </Grid>
        )}
        <Grid item>
          <UncontrolledDropdown className="d-inline-block">
            <DropdownToggle
              caret
              color="White"
              style={{ fontSize: "0.9em", padding: "0", marginRight: "6px" }}
            >
              {year}
            </DropdownToggle>
            <DropdownMenu right>
              {years.map(y => <DropdownItem key={y} onClick={() => setYear(y)}>{y}</DropdownItem>)}
            </DropdownMenu>
          </UncontrolledDropdown>
        </Grid>
      </Grid>
      <Grid item style={{ height: "500px", width: "100%" }}>
        {chartData && (
          <BarChart data={chartData as ChartData<"bar">} options={optionsData as any} />
        )}
      </Grid>
    </Grid>
  );
}
