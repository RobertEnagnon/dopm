import { Grid, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Fiche } from "../../../models/fiche";
import { Historical } from "../../../models/Top5/historical";
import { Curve } from "../../../models/Top5/curve";
import { Data } from "../../../models/Top5/data";
import { GetDataByDateAndCurves } from "../../../services/Top5/data";
import styles from "../dashboard.module.scss";
import { useTranslation } from "react-i18next";
import { Indicator } from "../../../models/Top5/indicator";

type VignetteProps = {
  tool: string;
  periode: string;
  titleChange: Function;
  indicator?: Indicator;
  fiches?: Array<Fiche>;
};

export default function Vignette({
  periode,
  titleChange,
  tool,
  indicator,
  fiches,
}: VignetteProps) {
  const [month] = useState<number>(new Date().getMonth());
  const [year] = useState<number>(new Date().getFullYear());
  const [data, setData] = useState<
    Array<{ name: string; color: string; value: number }>
  >([]);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    if (indicator) {
      if (periode === "mensuel")
        titleChange(`${indicator.name} - ${t("dashboard.vignettemensuel")}`);
      else titleChange(`${indicator.name} - ${t("dashboard.vignetteannuel")}`);
    }
  }, [indicator]);

  const getYearlyData = async () => {
    const historical: Array<Historical> = indicator?.historical || [];
    const currentYear = year || new Date().getFullYear();
    const selectedYearData = historical.filter((v) => {
      return parseInt(v.year) === currentYear;
    });
    const total = selectedYearData.reduce((currentTotal: number, current) => {
      return currentTotal + (isNaN(current.data) ? 0 : current.data);
    }, 0);
    setTotal(total);
  };

  const getMonthlyData = async (/*d*/) => {
    const curves: Array<Curve> = indicator?.curves || [];
    let curvesData: Array<{ name: string; color: string; value: number }> = [];
    let total = 0;
    const date = new Date(
      year !== undefined ? year : new Date().getFullYear(),
      month !== undefined ? month : new Date().getMonth(),
      1
    );
    for (let curve of curves) {
      const monthDatas = await GetDataByDateAndCurves([curve], date);
      const sum = monthDatas.reduce((currentTotal: number, current: Data) => {
        let currData = parseInt(current.data.toString());
        return currentTotal + (isNaN(currData) ? 0 : currData);
      }, 0);
      curvesData = [
        ...curvesData,
        { name: curve.name, color: curve.color, value: sum },
      ];
      total += sum;
    }
    setData(curvesData);
    setTotal(total);
  };

  useEffect(() => {
    if (tool === "FicheSecurite") {
      if (periode === "mensuel") titleChange(t("dashboard.vignettefsmensuel"));
      else titleChange(t("dashboard.vignettefsannuel"));
    }
  }, [tool, periode]);

  const getFicheData = () => {
    if (fiches) {
      const filtredFiches = fiches.filter((fiche) => {
        const date = new Date(fiche.createdAt);
        if (periode === "mensuel")
          return date.getMonth() === month && date.getFullYear() === year;
        else return date.getFullYear() === year;
      });
      setTotal(filtredFiches.length);

      const indicators = [
        { name: t("dashboard.vignettefsnews"), color: "#b5b5b5" },
        { name: t("dashboard.vignettefsinprogress"), color: "#ff9800" },
        { name: t("dashboard.vignettefsclosed"), color: "#8bc34a" },
        // { name: "Non FS", color: "#9e9e9e" },
      ];
      const vignetteData = indicators.map((indicator) => {
        const fichesByStatus = filtredFiches.filter(
          (fiche) => fiche.status == indicator.name
        );

        return {
          name: indicator.name,
          color: indicator.color,
          value: fichesByStatus.length,
        };
      });
      setData(vignetteData);
    }
  };

  useEffect(() => {}, [data]);

  useEffect(() => {
    if (tool === "FicheSecurite") {
      getFicheData();
    } else {
      if (indicator) {
        if (periode === "mensuel") getMonthlyData();
        else if (periode === "historique") getYearlyData();
      }
    }
  }, [indicator, month, year, fiches]);

  const { t } = useTranslation();
  return (
    <>
      <div className="v-wrapper" style={{ height: "100%" }}>
        <div
          className={`${styles.contentBody} d-flex flex-column justify-content-center align-items-center`}
          style={{ height: "100%" }}
        >
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={1}
          >
            {data.map((fiche) => {
              return (
                <Grid
                  item
                  xs={4}
                  container
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                  style={{ color: fiche.color }}
                  key={`${indicator ? indicator.id : "0"}-${fiche.name}`}
                >
                  <Grid item>
                    <Typography
                      variant="subtitle1"
                      style={{ color: fiche.color }}
                    >
                      <b>{fiche.name}</b>
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="h6" style={{ color: fiche.color }}>
                      {fiche.value}
                    </Typography>
                  </Grid>
                </Grid>
              );
            })}
          </Grid>
          <Typography className="mt-5" variant="subtitle1" align="center">
            {`Total:`}
          </Typography>
          <Typography className="" variant="h4" align="center">
            {`${total}`}
          </Typography>
        </div>
      </div>
    </>
  );
}
