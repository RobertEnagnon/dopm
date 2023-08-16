import { Modal } from "react-bootstrap";
import {
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  UncontrolledDropdown,
} from "reactstrap";
import classnames from "classnames";
import { useEffect, useState } from "react";
import ExtractionTab from "./ExtractionTab";
import { useTop5 } from "../../context/top5.context";
import { GetCategoriesByBranch } from "../../../services/Top5/category";
import { Category } from "../../../models/Top5/category";
import { Indicator } from "../../../models/Top5/indicator";
import { GetIndicatorsByCategories } from "../../../services/Top5/indicator";
import { Curve } from "../../../models/Top5/curve";
import { GetCurvesByIndicators } from "../../../services/Top5/curve";
import { GetHistoByIndicators } from "../../../services/Top5/historical";
import { Data } from "../../../models/Top5/data";
import { Historical } from "../../../models/Top5/historical";
import { GetDataByDateAndCurves } from "../../../services/Top5/data";
import { getYears, monthLabel, Unities } from "../../../utils/top5.utils";
import { Colors } from "../../../utils/dopm.utils";

const Extraction = () => {
  const options = {
    filterType: "checkbox",
    downloadOptions: {
      separator: ";",
      filterOptions: { useDisplayedColumnsOnly: true },
    },
    onDownload: (buildHead: any, buildBody: any, columns: any, data: any) => {
      return "\uFEFF" + buildHead(columns) + buildBody(data);
    },
  };

  const top5 = useTop5();

  const [branch] = useState(top5.currentBranch);
  const [categories, setCategories] = useState<Array<Category>>([]);
  const [indicators, setIndicators] = useState<Array<Indicator>>([]);
  const [curves, setCurves] = useState<Array<Curve>>([]);
  const [histo, setHistos] = useState<Array<Historical>>([]);
  const [data, setData] = useState<Array<Data>>([]);

  const [activeTab, setActiveTab] = useState("1");
  const [columns, setColumns] = useState<Array<string>>([]);
  const [dataExtract, setDatasExtract] = useState<Array<any>>([]);

  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  useEffect(() => {
    GetCategoriesByBranch(branch.id).then((cat) => {
      setCategories(cat);
    });
  }, [branch]);

  useEffect(() => {
    GetIndicatorsByCategories(categories).then((ind) => {
      setIndicators(ind);
    });
  }, [categories]);

  useEffect(() => {
    GetCurvesByIndicators(indicators).then((cur) => {
      setCurves(cur);
    });

    GetHistoByIndicators(indicators).then((his) => {
      setHistos(his);
    });
  }, [indicators]);

  useEffect(() => {
    GetDataByDateAndCurves(curves, currentDate).then((dat) => {
      setData(() => dat);
    });
  }, [curves, currentDate]);

  useEffect(() => {
    let exportedDatas: Array<any> = [];
    let exportedHistos: Array<any> = [];

    switch (activeTab) {
      case "1":
        setColumns([
          "Nom Catégorie",
          "Nom Indicateur",
          "Jour de Lecture",
          "Unité",
          "Responsable",
          "Affichage en cumulé",
          "Nom Courbe",
          "Type Courbe",
          "Couleur",
          "Date",
          "Donnée",
          "Commentaire",
        ]);

        data.forEach((d) => {
          const curve = curves.find((curve) => curve.id === d.curve?.id);
          const indicator = indicators.find(
            (ind) => ind.id === curve?.indicatorId
          );
          const category = categories.find(
            (category) =>
              category!.indicator!.filter((ind) => ind.id == indicator!.id)
                .length > 0
          );

          if (curve && indicator && category) {
            exportedDatas.push([
              category.name,
              indicator.name,
              ConvertReading(indicator.reading!),
              Unities[parseInt(indicator.unity!)],
              indicator.responsible,
              indicator.isDisplayCumulative ? "Oui" : "Non",
              curve.name,
              ConvertCurveType(curve.curveType),
              Colors.find((v) => v.value == curve.color)?.name ?? "",
              d.date,
              d.data,
              d.comment,
            ]);
          }
        });
        setDatasExtract(exportedDatas);

        break;

      case "2":
        setColumns([
          "Nom Catégorie",
          "Nom Indicateur",
          "Jour de Lecture",
          "Unité",
          "Responsable",
          "Affichage en cumulé",
          "Mois",
          "Année",
          "Donnée",
          "Cible",
        ]);

        histo.forEach((h) => {
          const indicator = indicators.find(
            (indicator) => indicator.id === h.indicatorId
          );
          const category = categories.find(
            (category) =>
              category!.indicator!.filter((ind) => ind.id == indicator!.id)
                .length > 0
          );

          if (indicator && category) {
            console.log(indicator.unity);
            exportedHistos.push([
              category.name,
              indicator.name,
              ConvertReading(indicator.reading!),
              Unities[parseInt(indicator.unity!)],
              indicator.responsible,
              indicator.isDisplayCumulative ? "Oui" : "Non",
              h.month,
              h.year,
              h.data,
              h.target,
            ]);
          }
        });

        setDatasExtract(exportedHistos);
        break;

      default:
        break;
    }
  }, [activeTab, data]);

  const ConvertReading = (reading: number) => {
    let convertedReading = "";

    switch (reading) {
      case 0:
        convertedReading = "J-1";
        break;

      case 1:
        convertedReading = "J";
        break;

      case 2:
        convertedReading = "J+1";
        break;
    }

    return convertedReading;
  };

  const ConvertCurveType = (curveType: number) => {
    let convertedCurveType;

    switch (curveType) {
      case 0:
        convertedCurveType = "Histogramme";
        break;

      case 1:
        convertedCurveType = "Histogramme Empilé";
        break;

      case 2:
        convertedCurveType = "Courbe";
        break;
    }

    return convertedCurveType;
  };

  const onChangeDateHandler = (type: string, change: number) => {
    if (currentDate != undefined && setCurrentDate != undefined) {
      let newDate: Date = new Date(currentDate);
      if (type == "year") {
        newDate.setFullYear(change);
      } else if (type == "month") {
        newDate.setMonth(change);
      }

      setCurrentDate(newDate);
    }
  };

  return (
    <>
      <Modal.Header>
        <h3>Extraction Données Top5</h3>
        {activeTab === "1" && (
          <div>
            <UncontrolledDropdown className="d-inline-block">
              <DropdownToggle
                caret
                color="White"
                style={{ fontSize: "0.9em", padding: "0", marginRight: "6px" }}
              >
                {monthLabel[currentDate!.getMonth()]}
              </DropdownToggle>
              <DropdownMenu right>
                {monthLabel.map((m, i) => {
                  return (
                    <DropdownItem
                      key={`${m}${i * Date.now()}`}
                      onClick={() => onChangeDateHandler("month", i)}
                    >
                      {m}
                    </DropdownItem>
                  );
                })}
              </DropdownMenu>
            </UncontrolledDropdown>
            <UncontrolledDropdown className="d-inline-block">
              <DropdownToggle
                caret
                color="White"
                style={{ fontSize: "0.9em", padding: "0", marginRight: "6px" }}
              >
                {currentDate!.getFullYear()}
              </DropdownToggle>
              <DropdownMenu right>
                {getYears().map((year, i) => {
                  return (
                    <DropdownItem
                      key={`${year}${i * Date.now()}`}
                      onClick={() =>
                        onChangeDateHandler("year", parseInt(year))
                      }
                    >
                      {year}
                    </DropdownItem>
                  );
                })}
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        )}
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "1" })}
                onClick={() => setActiveTab("1")}
                style={{ cursor: 'pointer' }}
              >
                Données
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "2" })}
                onClick={() => setActiveTab("2")}
                style={{ cursor: 'pointer' }}
              >
                Historiques
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={activeTab} style={{ marginTop: "30px" }}>
            <TabPane tabId="1">
              <ExtractionTab
                title={"Extraction des données"}
                columns={columns}
                data={dataExtract}
                options={options}
              />
            </TabPane>
            <TabPane tabId="2">
              <ExtractionTab
                title={"Extraction des historiques"}
                columns={columns}
                data={dataExtract}
                options={options}
              />
            </TabPane>
          </TabContent>
        </Container>
      </Modal.Body>
    </>
  );
};

export default Extraction;
