import React, { useState, useEffect } from "react";
import { Doughnut, Pie } from "react-chartjs-2";
import { Grid } from "@material-ui/core";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import "chartjs-plugin-datalabels";
import { Fiche } from "../../../models/fiche";
import { ChartData } from "chart.js";
import { GetFiches } from "../../../services/FicheSecurite/fiche";
import styles from "../dashboard.module.scss";
import { useData } from "../../../hooks/Top5/data";
import { useTranslation } from "react-i18next";
import { Indicator } from "../../../models/Top5/indicator";

type PieChartProps = {
  tool: string,
  format: string,
  titleChange: Function,
  indicator: Indicator,
}

const months = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];
const years = [
  2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031,
];
export default function PieChart({ format, titleChange, tool, indicator }: PieChartProps) {
  const { t } = useTranslation();
  let labels: Array<string> = [];
  let data: Array<number> = [];
  let colors: Array<string> = [];
  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [getCurveData] = useData();
  const [chartData, setChartData] = useState<ChartData<"pie" | "doughnut">>();
  const [fiches, setFiches] = useState<Array<Fiche>>([]);

  useEffect(() => {
    if (tool === "FicheSecurite") {
      if (fiches?.length > 0) {
        getFichesData();
      }
    } else if (tool === "Top5") getData();
  }, [month, year, fiches]);

  useEffect(() => {
    if (tool === "FicheSecurite") {
      titleChange(t("dashboard.piechartfs"));
      GetFiches().then(fiches => setFiches(fiches));
    }
  }, [tool]);
  const getFichesData = () => {
    const filtredFiches = fiches.filter((fiche) => {
      const date = new Date(fiche.createdAt);
      return date.getMonth() === month && date.getFullYear() === year;
    });
    const nouvellesData = filtredFiches.filter((f) => {
      return f.status === "Nouvelle";
    }).length;
    const enCoursData = filtredFiches.filter((f) => {
      return f.status === "En cours";
    }).length;

    const nonFSData = filtredFiches.filter((f) => {
      return f.status === "Non FS";
    }).length;

    const clotureData = filtredFiches.filter((f) => {
      return f.status === "Cloturée";
    }).length;
    const indicators = [
      { name: t("dashboard.vignettefsnews"), color: "#efefef", data: nouvellesData },
      { name: t("dashboard.vignettefsinprogress"), color: "#ff9800", data: enCoursData },
      { name: t("dashboard.vignettefsclosed"), color: "#8bc34a", data: clotureData },
      { name: "Non FS", color: "#9e9e9e", data: nonFSData },
    ];
    const colors = indicators.map((indicator) => {
      return indicator.color;
    });
    const labels = indicators.map((indicator) => {
      return indicator.name;
    });
    const data = indicators.map((indicator) => {
      return indicator.data;
    });

    setChartData({
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: colors,
        },
      ],
    });
  };
  const getData = async () => {
    if (indicator) {
      console.log
      titleChange(`${t("dashboard.indicator")} ${indicator.name}`);
      const newChartData = await getCurveData(indicator, month, year, labels, data, colors);
      setChartData({
        labels: newChartData.labels,
        datasets: [
          {
            data: newChartData.data,
            backgroundColor: newChartData.colors,
          },
        ],
      });
    }
  };
  return (
    <div className={`${styles.vwrapper} h-100`}>
      <Grid
        container
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
      >
        <Grid item>
          <UncontrolledDropdown className="d-inline-block">
            <DropdownToggle
              caret
              color="White"
              style={{ fontSize: "0.9em", padding: "0", marginRight: "6px" }}
            >
              {months[month]}
            </DropdownToggle>
            <DropdownMenu end>
              {months.map((m, i) => {
                return (
                  <DropdownItem key={i} onClick={() => setMonth(i)}>
                    {t("services." + m)}
                  </DropdownItem>
                );
              })}
            </DropdownMenu>
          </UncontrolledDropdown>
        </Grid>
        <Grid item>
          <UncontrolledDropdown className="d-inline-block">
            <DropdownToggle
              caret
              color="White"
              style={{ fontSize: "0.9em", padding: "0", marginRight: "6px" }}
            >
              {year}
            </DropdownToggle>
            <DropdownMenu end>
              {years.map((y, i) => {
                return (
                  <DropdownItem key={i} onClick={() => setYear(y)}>
                    {y}
                  </DropdownItem>
                );
              })}
            </DropdownMenu>
          </UncontrolledDropdown>
        </Grid>
      </Grid>
      <div className={styles.contentBody}>
        {chartData && format === "circulaire" && (
          <Pie
            style={{ height: "100%" }}
            data={chartData as ChartData<"pie">}
            options={{
              maintainAspectRatio: false,
              plugins: {
                datalabels: {
                  display: true,
                  color: "white",
                },
              },
            }}
          />
        )}
        {chartData && format === "cercle" && (
          <Doughnut
            style={{ height: "100%" }}
            data={chartData as ChartData<"doughnut">}
            options={{
              maintainAspectRatio: false,
              plugins: {
                datalabels: {
                  // display: (ctx) => {
                  //   return ctx;
                  // },
                  color: "white",
                },
              },
            }}
          />
        )}
      </div>
    </div>
  );
}
