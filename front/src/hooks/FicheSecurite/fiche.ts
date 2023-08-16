import {Fiche} from "../../models/fiche";
import {getDays, months} from "../../pages/dashboard/GridComponents/services";
import {DatasetType} from "../../models/Top5/dataset";

export const useFicheSecHisto = () => {
  const getFicheSecHistoByDate = (fiches: Array<Fiche>, sDate: Date, type: "years" | "months") => {
    if (fiches?.length > 0) {
      const mapDate = type === "years" ? months : getDays(sDate);
      const currentFiches = fiches.filter((f) => {
        const date = new Date(f.createdAt);
        if(type === "years")
        {
          return date.getFullYear() === sDate.getFullYear();
        }
        if(type === "months")
        {
          return (
            date.getMonth() === sDate.getMonth() &&
            date.getFullYear() === sDate.getFullYear()
          );
        }
      });
      const nouvellesData = mapDate.map((m, i) => {
        return currentFiches.filter((f) => {
          const date = new Date(f.createdAt);
          if (type === "years") {
            return date.getMonth() === i && f.status === "Nouvelle";
          }
          if (type === "months") {
            const currentDay = parseInt(m.split("/")[0]);
            return date.getDate() === currentDay && f.status === "Nouvelle";
          }
        }).length;
      });
      const enCoursData = mapDate.map((m, i) => {
        return currentFiches.filter((f) => {
          const date = new Date(f.createdAt);
          if (type === "years") {
            return date.getMonth() === i && f.status === "En cours";
          }
          if (type === "months") {
            const currentDay = parseInt(m.split("/")[0]);
            return date.getDate() === currentDay && f.status === "En cours";
          }
        }).length;
      });
      const nonFSData = mapDate.map((m, i) => {
        return currentFiches.filter((f) => {
          const date = new Date(f.createdAt);
          if (type === "years") {
            return date.getMonth() === i && f.status === "Non FS";
          }
          if (type === "months") {
            const currentDay = parseInt(m.split("/")[0]);
            return date.getDate() === currentDay && f.status === "Non FS";
          }
        }).length;
      });
      const clotureData = mapDate.map((m, i) => {
        return currentFiches.filter((f) => {
          const date = new Date(f.createdAt);
          if (type === "years") {
            return date.getMonth() === i && f.status === "Cloturée";
          }
          if (type === "months") {
            const currentDay = parseInt(m.split("/")[0]);
            return date.getDate() === currentDay && f.status === "Cloturée";
          }
        }).length;
      });
      const indicators = [
        { name: "Nouvelle", color: "#efefef", data: nouvellesData },
        { name: "En cours", color: "#ff9800", data: enCoursData },
        { name: "Cloturé", color: "#8bc34a", data: clotureData },
        { name: "Non FS", color: "#9e9e9e", data: nonFSData },
      ];
      const datasets: Array<DatasetType> = indicators.map((i) => {
        return {
          label: i.name,
          type: "bar",
          backgroundColor: i.color,
          borderColor: i.color,
          hoverBackgroundColor: i.color,
          hoverBorderColor: i.color,
          barPercentage: 1,
          order: 3,
          stack: "stacked-bar",
          data: i.data,
        };
      });

      return { datasets, dates: mapDate};
    }
    return { datasets: [], dates: [] };
  };
  return [ getFicheSecHistoByDate ]
}