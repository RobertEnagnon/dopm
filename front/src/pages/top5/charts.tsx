import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Input,
  InputGroup,
  InputGroupText,
  ListGroup,
  ListGroupItem,
  Row,
} from "reactstrap";

import { useTop5 } from "../../components/context/top5.context";
import Chart from "../../components/top5/chart";
import ButtonList from "../../components/top5/buttonlist";
import "./charts.scss";

import {
  DataType,
  GetComment,
  GetDataDatasets,
  GetDataOptions,
  GetFloatMonth,
  GetHistoricalsDatasets,
  GetHistoricalsOptions,
  Unities,
} from "../../utils/top5.utils";
import moment from "moment";

//import {Data} from "../../models/data";
import { Historical } from "../../models/Top5/historical";
import { Indicator, IndicatorMode } from "../../models/Top5/indicator";
import { Category } from "../../models/Top5/category";

// START
import {
  DownloadIndicatorFile,
  GetIndicatorsByCategory,
} from "../../services/Top5/indicator";
import { GetChartByIndicator, GetChartByModule } from "../../services/chart";
import { permissionsList } from "../../models/Right/permission";
import { useUser } from "../../components/context/user.context";

const Charts = () => {
  const userContext = useUser();
  const top5 = useTop5();
  const categories = useMemo(
    () =>
      top5.categories.filter(
        (c) =>
          userContext.checkAccess(
            permissionsList.lectureGraphique,
            top5.currentBranch.id,
            c.id
          ) ||
          userContext.checkAccess(
            permissionsList.ajoutDonneesCategorie,
            top5.currentBranch.id,
            c.id
          )
      ) || [],
    [top5.categories]
  );
  const PUBLIC_API = process.env.REACT_APP_PUBLIC_URL;

  // const [ atcategories, setCategories ] = useState<Array<Category>>( [] );
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >(undefined);
  const [indicators, setIndicators] = useState<Array<Indicator>>([]);
  const [selectedIndicator, setSelectedIndicator] = useState<
    Indicator | undefined
  >(undefined);
  const [historicalsDatasets, setHistoricalsDatasets] =
    useState<any>(undefined);
  const [historicalsOptions, setHistoricalsOptions] = useState<any>(undefined);
  const [dataDatasets, setDataDatasets] = useState<any>(undefined);
  const [dataOptions, setDataOptions] = useState<any>(undefined);
  const [comments, setComments] = useState<Array<any>>([]);
  const [date, setDate] = useState(new Date());
  const [range, setRange] = useState(selectedIndicator?.range ?? 5);
  const [isImageFullScreen, setIsImageFullScreen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [histo, setHisto] = useState<Historical[]>([]);

  /* Select by default first category or define on an undefined value when we haven't atcategories */
  useEffect(() => {
    if (categories) {
      const category = new URLSearchParams(window.location.search).get(
        "category"
      );
      if (categories.length > 0) {
        let categoryIndex: Array<Category> = [];
        if (category) {
          categoryIndex = categories.filter(
            (c: any) => c.id === parseInt(category)
          );
        }
        setSelectedCategory(
          Object.assign(
            {},
            categoryIndex.length ? categoryIndex[0] : categories[0]
          )
        );
      } else {
        setSelectedCategory(undefined);
      }
    }
  }, [categories]);

  /* Update indicators when we selected a Category */
  useEffect(() => {
    setLoading(true);

    if (selectedCategory) {
      GetIndicatorsByCategory(selectedCategory.id, true).then((res) => {
        if (res) {
          setIndicators(res);
          setSelectedIndicator(Object.assign({}, res[0]));
          setRange(res[0].range ?? 5);
        }
      });
    } else {
      setIndicators([]);
      setSelectedIndicator(undefined);
    }
  }, [selectedCategory]);

  useEffect(() => {
    setLoading(true);

    if (selectedIndicator) {
      if (selectedIndicator.indicatorMode === IndicatorMode.Module) {
        console.log(selectedIndicator);
        GetChartByModule(
          selectedIndicator.id,
          selectedIndicator.module as number,
          selectedIndicator.moduleZoneId as number,
          date
        ).then((chart) => {
          let histos: Array<Historical> = chart.historical;
          setHisto(histos);
          if (chart.targets.length > 0) {
            setHistoricalsDatasets(
              Object.assign(
                {},
                GetHistoricalsDatasets(histos, chart.targets[0]?.targetGoal, true)
              )
            );
            setHistoricalsOptions(
              Object.assign(
                {},
                GetHistoricalsOptions(selectedIndicator.unity, histos)
              )
            );
          }
          let datasetsByChart: { labels: string[]; datasets: any[] } =
            GetDataDatasets(
              [],
              chart.data,
              chart.targets,
              date,
              false,
              selectedIndicator.indicatorMode,
              range,
              selectedIndicator.name
            );
          setDataDatasets(Object.assign({}, datasetsByChart));
          setDataOptions(
            Object.assign(
              {},
              GetDataOptions(selectedIndicator.unity, chart.data)
            )
          );
          setComments(
            GetComment(chart.data, date, selectedIndicator.indicatorMode)
          );
          setLoading(false);
        });
      } else {
        (selectedIndicator.indicatorMode === IndicatorMode.Weekly
          ? GetChartByIndicator(selectedIndicator.id, date, range)
          : GetChartByIndicator(selectedIndicator.id, date)
        ).then((chart) => {
          if (chart) {
            const floatMonth = GetFloatMonth();
            let histos: Array<Historical> = [];
            floatMonth.forEach((m: any, index) => {
              const histo: any = chart.historical.find(
                (h) => h.year == m.year && h.month == m.number
              );
              if (histo) {
                histos[index] = {
                  id: histo.id,
                  data: histo.data,
                  target: histo.target,
                  comment: histo.comment,
                  month: histo.month,
                  year: histo.year,
                  indicatorId: histo.indicator_id,
                };
              } else {
                histos[index] = {
                  id: 0,
                  month: m.number,
                  year: m.year,
                  comment: "",
                  target: 0,
                  data: 0,
                };
              }
            });
            setHisto(histos);
            if (chart.targets.length > 0 && chart.curves.length > 0) {
              setHistoricalsDatasets(
                Object.assign(
                  {},
                  GetHistoricalsDatasets(histos, chart.targets[0]?.targetGoal)
                )
              );
              setHistoricalsOptions(
                Object.assign(
                  {},
                  GetHistoricalsOptions(selectedIndicator.unity, histos)
                )
              );

              // Dans la fontion GetDataDatasets qu'il faut modifier les datas et les labels pour le mode hebdo
              // Il faut aussi rajouter le mode d'indicateur en paramètre sans doutelet datasetsByChart: { labels: string[]; datasets: any[] } =
              let datasetsByChart = GetDataDatasets(
                chart.curves,
                chart.data,
                chart.targets,
                date,
                selectedIndicator?.isDisplayCumulative == true,
                selectedIndicator.indicatorMode,
                range
              );
              setDataDatasets(Object.assign({}, datasetsByChart));
              setDataOptions(
                Object.assign(
                  {},
                  GetDataOptions(selectedIndicator.unity, chart.data)
                )
              );
              setComments(
                GetComment(chart.data, date, selectedIndicator.indicatorMode)
              );
              setLoading(false);
            } else {
              setHistoricalsDatasets(undefined);
              setHistoricalsOptions(undefined);
              setDataDatasets(undefined);
              setDataOptions(undefined);
              setComments([]);
              setLoading(false);
            }
          }
        });
      }
    } else {
      /* No indicator selected, so no data to display */
      setHistoricalsDatasets(undefined);
      setHistoricalsOptions(undefined);
      setComments([]);
      setLoading(false);
    }
  }, [selectedIndicator, date, range]);
  const clicCategory = (index: number) => {
    if (categories[index]) {
      setSelectedCategory(Object.assign({}, categories[index]));
    }
  };

  /* Update range when we selected an indicator */
  useEffect(() => {
    if (selectedIndicator) setRange(selectedIndicator.range ?? 5);
  }, [selectedIndicator]);

  const clicIndicator = (index: number) => {
    if (indicators[index]) {
      if (
        indicators[index].indicatorMode === IndicatorMode.File &&
        indicators[index].fileName
      ) {
        DownloadIndicatorFile(indicators[index].id).then((r) => {
          if (r?.data?.file) {
            window.open(`${PUBLIC_API}/${r.data.file}`, "_blank");
          }
        });
      } else {
        if (
          indicators[index].fileType === undefined ||
          indicators[index].fileType === 0
        ) {
          setSelectedIndicator(Object.assign({}, indicators[index]));
        }

        if (indicators[index].fileType === 1) {
          setSelectedIndicator(Object.assign({}, indicators[index]));
          indicators[index].fileType === 1 && setIsImageFullScreen(true);
        }

        if (indicators[index].fileType === 2) {
          window.open(`${PUBLIC_API}${indicators[index].fileName}`, "_blank");
        }
      }
    }
  };

  const cssCardStyle = {
    CardHeader: { padding: "0" },
    CardBody: { padding: "0" },
    CardTitle: {
      textAlign: "center",
      marginBottom: "0.1rem",
      marginTop: "0.3rem",
    },
  };

  return (
    <>
      {loading && (
        <div className="loadRing">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      )}

      {categories?.length > 0 && (
        <Row>
          <Col md="12">
            <ButtonList
              title="Catégories"
              horizontal
              data={categories}
              selectedData={selectedCategory?.id}
              onClick={clicCategory}
              css={{
                CardTitle: {
                  // marginBottom: 0,
                  display: "flex",
                  alignItems: "center",
                },
              }}
            />
          </Col>
        </Row>
      )}
      <Row style={{ alignItems: "stretch" }}>
        <Col md="2">
          {indicators?.length > 0 && (
            <ButtonList
              title="Indicateurs"
              horizontal={false}
              data={indicators}
              selectedData={selectedIndicator?.id}
              onClick={clicIndicator}
              css={{
                CardBody: { padding: "0", paddingBottom: "0.4em" },
                CardHeader: { padding: "0" },
                CardTitle: {
                  textAlign: "center",
                  marginBottom: "0.1rem",
                  marginTop: "0.3rem",
                },
              }}
            />
          )}
        </Col>

        {selectedIndicator &&
          historicalsDatasets &&
          (selectedIndicator.indicatorMode === IndicatorMode.Daily ||
            (selectedIndicator.indicatorMode === IndicatorMode.Weekly &&
              (!selectedIndicator.range || selectedIndicator.range <= 5)) ||
            selectedIndicator?.indicatorMode === IndicatorMode.Monthly ||
            selectedIndicator?.indicatorMode === IndicatorMode.Module) && (
            <Col
              md={
                selectedIndicator?.indicatorMode === IndicatorMode.Monthly
                  ? 10
                  : 3
              }
            >
              <Chart
                name={selectedIndicator.name}
                data={historicalsDatasets}
                options={historicalsOptions}
                css={cssCardStyle}
                dataType={DataType.Histo}
              />
            </Col>
          )}

        {selectedIndicator &&
          dataDatasets &&
          (selectedIndicator.indicatorMode === IndicatorMode.Daily ||
            selectedIndicator.indicatorMode === IndicatorMode.Module) && (
            <Col md="7">
              <Chart
                name={selectedIndicator.name}
                data={dataDatasets}
                options={dataOptions}
                css={cssCardStyle}
                dataType={DataType.Data}
                date={date}
                setDate={setDate}
              />
            </Col>
          )}

        {selectedIndicator &&
          dataDatasets &&
          selectedIndicator?.indicatorMode === IndicatorMode.Weekly && (
            <Col
              md={
                selectedIndicator.range && selectedIndicator.range > 5
                  ? "10"
                  : "7"
              }
            >
              <Chart
                name={selectedIndicator.name}
                data={dataDatasets}
                options={dataOptions}
                css={cssCardStyle}
                dataType={DataType.Data}
                range={range}
                setRange={setRange}
              />
            </Col>
          )}

        {selectedIndicator &&
          selectedIndicator.indicatorMode === IndicatorMode.PDF &&
          selectedIndicator.fileType === 0 && (
            <Col>
              <embed
                width={"100%"}
                height={"660px"}
                type="application/pdf"
                src={`${PUBLIC_API}${selectedIndicator.fileName}`}
              />
            </Col>
          )}

        {selectedIndicator &&
          isImageFullScreen &&
          selectedIndicator.fileType === 1 && (
            <div
              onClick={() => setIsImageFullScreen(false)}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "fixed",
                top: "0",
                left: "0",
                height: "100%",
                width: "100%",
                backgroundColor: "rgba(0,0,0,0.7)",
                cursor: "pointer",
                zIndex: 9999999999999,
              }}
            >
              <embed
                width={"90%"}
                height={"90%"}
                src={`${PUBLIC_API}${selectedIndicator.fileName}`}
              />
            </div>
          )}
      </Row>
      <Row>
        <Col md="8">
          {selectedIndicator &&
          (selectedIndicator.indicatorMode !== IndicatorMode.Module &&
            selectedIndicator.indicatorMode !== IndicatorMode.PDF) &&
            <Card>
              <CardHeader className="bg-white">
                <CardTitle tag="h5" className="m-0">
                  Commentaires
                </CardTitle>
              </CardHeader>
              <CardBody>
                {/**
                 * Les indicateurs en mode mensuel
                 * ont des commentaires par mois
                 */}
                {selectedIndicator?.indicatorMode === IndicatorMode.Monthly ? (
                  <ListGroup type="unstyled" flush className="p-0">
                    {histo.map((his: Historical, index) => {
                      if (his.indicatorId === selectedIndicator.id) {
                        return his.comment && his.comment.length >= 1 ? (
                          <ListGroupItem
                            key={`${selectedIndicator.id * Date.now()}-${
                              index * Date.now()
                            }`}
                            className={`p-0`}
                          >
                            {`${his.month}/${his.year} - ${his.comment}`}
                          </ListGroupItem>
                        ) : (
                          ""
                        );
                      }
                    })}
                  </ListGroup>
                ) : selectedIndicator && comments.length > 0 ? (
                  <ListGroup type="unstyled" flush className="p-0">
                    {comments.map((comment, index) => {
                      const today = moment().format("DD/MM");
                      const labelDate = moment(comment.label, "DD/MM").format(
                        "DD/MM"
                      );
                      return (
                        <ListGroupItem
                          key={`${selectedIndicator.id * Date.now()}-${
                            index * Date.now()
                          }`}
                          className={`p-0 ${
                            today === labelDate ? "font-weight-bold" : null
                          }`}
                        >
                          {`${comment.label} - ${comment.comment}`}
                        </ListGroupItem>
                      );
                    })}
                  </ListGroup>
                ) : null}
              </CardBody>
            </Card>
          }
        </Col>
        {selectedIndicator &&
          (selectedIndicator.indicatorMode !== IndicatorMode.Module &&
            selectedIndicator.indicatorMode !== IndicatorMode.PDF) && (
          <Col md="4">
            <Card>
              <CardHeader className="bg-white">
                <CardTitle tag="h5" className="m-0">
                  Responsable & Unit&eacute;
                </CardTitle>
              </CardHeader>
              <CardBody className="d-flex flex-column gap-2">
                <Row>
                  <Col>
                    <InputGroup size="sm">
                      <InputGroupText>Responsable : </InputGroupText>
                      <Input
                        disabled
                        type="text"
                        name="responsible"
                        id="responsible"
                        bsSize="sm"
                        value={selectedIndicator?.responsible}
                      />
                    </InputGroup>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <InputGroup size="sm">
                      <InputGroupText htmlFor="unity">
                        Unit&eacute; :{" "}
                      </InputGroupText>
                      <Input
                        disabled
                        type="text"
                        name="unity"
                        id="unity"
                        bsSize="sm"
                        value={
                          selectedIndicator?.unity
                            ? Unities[parseInt(selectedIndicator.unity)]
                            : ""
                        }
                      />
                    </InputGroup>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        )}
      </Row>
    </>
  );
};

export default Charts;
