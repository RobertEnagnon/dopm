import { Grid } from "@material-ui/core";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Context } from "chartjs-plugin-datalabels/types/context";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  Row,
} from "reactstrap";
import { Fiche } from "../../../models/fiche";
import { ChartData } from "chart.js";
import { months, getMonthesLabels } from "./services";
import { GetFiches } from "../../../services/FicheSecurite/fiche";
import styles from "../dashboard.module.scss";
import {
  useHistoricalIndicator,
  useHistoricalMonthly,
} from "../../../hooks/Top5/historical";
import { GetDataDatasets, Ranges } from "../../../utils/top5.utils";
import { useFicheSecHisto } from "../../../hooks/FicheSecurite/fiche";
import { DatasetType } from "../../../models/Top5/dataset";
import { useTranslation } from "react-i18next";
import { Indicator, IndicatorMode } from "../../../models/Top5/indicator";
import { GetChartByIndicator } from "../../../services/chart";
const years = [
  2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031,
];

type HistogrammeProps = {
  tool: string;
  indicator: Indicator;
  periode: string;
  titleChange: Function;
};

export default function Histogramme({
  titleChange,
  periode,
  indicator,
  tool,
}: HistogrammeProps) {
  const { t } = useTranslation();
  const [minValueData, setMinValueData] = useState<number>();
  const [maxValueData, setMaxValueData] = useState<number>();
  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [range, setRange] = useState(indicator?.range ?? 5);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [barData, setbarData] = useState<{
    type: string;
    labels: Array<string>;
    datasets: Array<DatasetType>;
  }>();
  const [fiches, setFiches] = useState<Array<Fiche>>([]);
  const [getHistoricalByIndicator] = useHistoricalIndicator();
  const [getHistoMonthlyByIndicatorAndDate] = useHistoricalMonthly();
  const [getFicheSecHistoByDate] = useFicheSecHisto();

  const options = {
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
        display: function (context: Context) {
          return context.dataset.data[context.dataIndex] !== 0;
        },
        align: "end",
        offset: 5,
      },
    },
    maintainAspectRatio: false,
    legend: {
      display: true,
    },
    scales: {
      y: {
        stacked: true,
        ticks: {
          suggestedMin: minValueData || 0,
          suggestedMax: maxValueData || 0,
          callback: (value: number) => {
            return value;
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
          suggestedMin: minValueData || 0,
          suggestedMax: maxValueData || 0,
          callback: (value: number) => {
            return value;
          },
        },
      },
    },
  };

  const handleSelectMonth = (m: number) => {
    setMonth(m);
  };

  const handleSelectYear = (y: number) => {
    setYear(y);
  };

  const getHistoMonthly = async () => {
    if (indicator.id) {
      const { datasets, currentMinValue, currentMaxValue, days } =
        await getHistoMonthlyByIndicatorAndDate({
          indicator,
          indicatorId: indicator.id,
          month,
          year,
        });
      setMinValueData(currentMinValue);
      setMaxValueData(currentMaxValue);

      // Workaround pour ne pas afficher la courbe de l'indicateur lorsque les données
      // ne sont pas encore renseignées
      let dataWithoutZero: Array<any> = [...datasets];
      for (let d of dataWithoutZero)
        if (d.type === "line")
          for (let i = 0; i < d.data.length; i++)
            if (
              d.data[i] === " " ||
              d.data[i] === "" ||
              d.data[i] === 0 ||
              isNaN(d.data[i])
            )
              d.data[i] = "N/A";

      setbarData({ datasets: dataWithoutZero, labels: days, type: "bar" });

      if (indicator.indicatorMode === IndicatorMode.Weekly) {
        const chart = await GetChartByIndicator(
          indicator.id,
          selectedDate,
          indicator.range
        );

        let datasetsByChart: { labels: string[]; datasets: DatasetType[] } =
          GetDataDatasets(
            chart.curves,
            chart.data,
            chart.targets,
            selectedDate,
            indicator.isDisplayCumulative == true,
            indicator.indicatorMode,
            range
          );

        setbarData({
          datasets: datasetsByChart.datasets,
          labels: datasetsByChart.labels,
          type: "bar",
        });
      }
    }
  };

  const getFicheSecHisto = (sDate: Date) => {
    const { datasets, dates } = getFicheSecHistoByDate(fiches, sDate, "years");
    setbarData({ datasets, labels: dates, type: "bar" });
    titleChange(t("dashboard.histogrammefsannuel"));
  };

  const getFichesSecMonthly = (sDate: Date) => {
    const { datasets, dates } = getFicheSecHistoByDate(fiches, sDate, "months");
    setbarData({ datasets, labels: dates, type: "bar" });
    titleChange(t("dashboard.histogrammefsmensuel"));
  };

  const getHistorical = async () => {
    const { datasets } = await getHistoricalByIndicator(indicator);
    setbarData({
      labels: getMonthesLabels(),
      datasets,
      type: "bar",
    });
  };

  useEffect(() => {
    let isMounted = true;
    if (tool === "Top5") {
      if (indicator) {
        titleChange(`${t("dashboard.indicator")} ${indicator.name}`);
        if (periode === "historique") {
          getHistorical();
        } else if (periode === "mensuel") {
          getHistoMonthly();
        }
      }
    } else if (tool === "FicheSecurite" && isMounted) {
      if (fiches?.length === 0) {
        GetFiches().then((fiches) => {
          if (isMounted) {
            setFiches(fiches);
          }
        });
      }
    }

    return () => {
      // 👇️ when component unmounts, set isMounted to false
      isMounted = false;
    };
  }, [indicator, periode, tool, range]);

  useEffect(() => {
    if (tool === "FicheSecurite" && fiches?.length > 0) {
      let SDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDay()
      );
      if (periode === "mensuel") {
        getFichesSecMonthly(SDate);
      }
      if (periode === "annuel") {
        getFicheSecHisto(SDate);
      }
    }
  }, [fiches, selectedDate]);

  useEffect(() => {
    setSelectedDate(
      new Date(
        new Date().setFullYear(
          year !== undefined ? year : new Date().getFullYear(),
          month !== undefined ? month : new Date().getMonth(),
          1
        )
      )
    );
    if (periode === "mensuel" && indicator) getHistoMonthly();
  }, [month, year]);

  const isWeekly = indicator?.indicatorMode === IndicatorMode.Weekly;

  return (
    <div className={`${styles.vwrapper} ${styles.vwrapperHisto} h-100`}>
      <Grid
        item
        container
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
      >
        {/* Affichage Semaines glissantes */}
        {isWeekly && !(tool === "Top5" && periode === "historique") && (
          <Row>
            <div>Semaines glissantes :</div>
            <UncontrolledDropdown className="d-inline-block">
              <DropdownToggle
                caret
                color="White"
                style={{
                  fontSize: "0.9em",
                  padding: "0",
                  marginRight: "15px",
                  marginLeft: "10px",
                }}
              >
                {range}
              </DropdownToggle>
              <DropdownMenu right>
                {Ranges.map((range: number) => {
                  return (
                    <DropdownItem key={range} onClick={() => setRange!(range)}>
                      {range}
                    </DropdownItem>
                  );
                })}
              </DropdownMenu>
            </UncontrolledDropdown>
          </Row>
        )}

        {!isWeekly && periode === "mensuel" && (
          <Grid item>
            <UncontrolledDropdown className="d-inline-block">
              <DropdownToggle
                caret
                color="White"
                style={{
                  fontSize: "0.9em",
                  padding: "0",
                  marginRight: "6px",
                }}
              >
                {months[selectedDate.getMonth()]}
              </DropdownToggle>
              <DropdownMenu end>
                {months.map((m, i) => {
                  return (
                    <DropdownItem
                      key={i}
                      onClick={() => {
                        handleSelectMonth(i);
                      }}
                    >
                      {t("services." + m)}
                    </DropdownItem>
                  );
                })}
              </DropdownMenu>
            </UncontrolledDropdown>
          </Grid>
        )}
        {!(tool === "Top5" && periode === "historique") && !isWeekly && (
          <Grid item>
            <UncontrolledDropdown className="d-inline-block">
              <DropdownToggle
                caret
                color="White"
                style={{ fontSize: "0.9em", padding: "0", marginRight: "6px" }}
              >
                {selectedDate.getFullYear()}
              </DropdownToggle>

              <DropdownMenu end>
                {years.map((y, i) => {
                  return (
                    <DropdownItem
                      key={i}
                      onClick={() => {
                        handleSelectYear(y);
                      }}
                    >
                      {y}
                    </DropdownItem>
                  );
                })}
              </DropdownMenu>
            </UncontrolledDropdown>
          </Grid>
        )}
      </Grid>
      <div className={styles.contentBody}>
        <div className="h-100">
          {barData && (
            <Bar
              data={barData as ChartData<"bar">}
              options={options as any}
              className={styles.histoCanvas}
            />
          )}
        </div>
      </div>
    </div>
  );
}
