import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Form,
  Input,
  Row,
  FormFeedback,
} from "reactstrap";
import { ToastContainer } from "react-toastify";
import { Controller, useFieldArray, useForm } from "react-hook-form";

import { DatePickerCalendar } from "react-nice-dates";
import "react-nice-dates/build/style.css";
import { fr } from "date-fns/locale";
import moment from "moment";

import { useTop5 } from "../../components/context/top5.context";
import { useIndicator } from "../../hooks/Top5/indicator";
import { notify, NotifyActions } from "../../utils/dopm.utils";
import { getInitialDate, RegexByUnities } from "../../utils/top5.utils";

import { Category } from "../../models/Top5/category";
import { Data } from "../../models/Top5/data";

import {
  CreateData,
  GetDataByDateAndCurves,
  UpdateData,
} from "../../services/Top5/data";
import { IndicatorCalculHisto, IndicatorMode } from "../../models/Top5/indicator";
import { permissionsList } from "../../models/Right/permission";
import { useUser } from "../../components/context/user.context";

type FormValues = {
  indicators: {
    indicatorId: number;
    unity: string;
    name: string;
    curves: { name: string; data: string; idData: number }[];
    comment: string;
    indicatorCalculHisto: IndicatorCalculHisto; indicatorMode: number;
  }[];
};

const DataForm = () => {
  const top5 = useTop5();
  const userContext = useUser();
  const categories = useMemo(
    () =>
      top5.categories.filter((c) => {
        return userContext.checkAccess(
          permissionsList.ajoutDonneesCategorie,
          top5.currentBranch.id,
          c.id
        );
      }) || [],
    [top5.categories]
  );
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >(undefined);
  const [selectedDate, setSelectedDate] = useState<Date>(
    getInitialDate(userContext.currentUser.isAlterateDate)
  );

  // Liste des données pour le mois courant
  const [datasOfTheMonth, setDatasOfTheMonth] = useState<Data[]>([]);

  // Données en cours d'ajout / update
  const [activeForm, setActiveForm] = useState(true);

  const { indicators, UpdateHistorical } = useIndicator({ category: selectedCategory });
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  const { control, handleSubmit } = useForm<FormValues>({
    mode: "onBlur",
  });
  const { fields, append, remove } = useFieldArray({
    name: "indicators",
    control,
  });

  useEffect(() => {
    refreshForm();

    let errors: { [key: string]: boolean } = {};
    for (const indicator of indicators) {
      for (const curve of indicator.curves || []) {
        errors[curve.name] = false;
      }
    }
    setErrors(errors);
  }, [indicators, selectedDate]);

  const refreshForm = async () => {
    remove();
    let indic: Array<any> = [];
    let dataCurves: Array<any> = [];

    for (let i = 0; i < indicators.length; i++) {
      indicators[i].curves?.forEach((cur: any) => {
        delete cur?.data;
        delete cur?.dataId;
      });

      indic.push({
        indicatorId: indicators[i].id,
        name: indicators[i].name,
        curves: indicators[i].curves,
        unity: indicators[i].unity,
        comment: "",
        indicatorMode: indicators[i].indicatorMode,
        indicatorCalculHisto: indicators[i].indicatorCalculHisto
      });
      dataCurves = dataCurves.concat(indicators[i].curves);
    }

    GetDataByDateAndCurves(dataCurves, selectedDate)
      .then((r) => {
        // Stocker les données du mois
        setDatasOfTheMonth([]);
        setDatasOfTheMonth((arr) => [...arr, ...r]);

        let datas = r?.filter(
          (d) => d.date == selectedDate?.toLocaleDateString("fr")
        );

        for (let i = 0; i < datas.length; i++) {
          let indexIndic = indic.findIndex(
            (indicator) => indicator.indicatorId == datas[i].curve?.indicator_id
          );

          if (indexIndic != -1) {
            let indexCurve = indic[indexIndic].curves.findIndex(
              (curve: any) => curve.name == datas[i].curve?.name
            );
            // console.log(indexCurve)

            if (indexCurve != -1) {
              indic[indexIndic].curves[indexCurve].data = datas[i].data;
              indic[indexIndic].curves[indexCurve].dataId = datas[i].id;

              if (indexCurve == 0) {
                indic[indexIndic].comment = datas[i].comment;
              }
            }
          }
        }

        if (datas.length == 0) {
          indic.forEach((ind: any) => {
            ind.curves.forEach((cur: any) => {
              delete cur?.data;
              delete cur?.dataId;
            });
          });
        }

        append(indic);
      })
      // Stocker aussi les donées du mois précédent
      .then(() => {
        let dateMonthBefore: Date = moment(selectedDate)
          .startOf("month")
          .subtract(1, "d")
          .toDate();
        GetDataByDateAndCurves(dataCurves, dateMonthBefore).then((r) => {
          setDatasOfTheMonth((arr) => [...arr, ...r]);
        });
      })
      // et du mois suivant
      .then(() => {
        let dateMonthBefore: Date = moment(selectedDate)
          .endOf("month")
          .add(1, "d")
          .toDate();
        GetDataByDateAndCurves(dataCurves, dateMonthBefore).then((r) => {
          setDatasOfTheMonth((arr) => [...arr, ...r]);
        });
      });
  };

  const onSubmit = async (data: any) => {
    setActiveForm(false);
    let submitData = data.indicators;
    let dataToSend: Array<Data> = [];
    let datasToUpdate: Array<Array<Data>> = [];
    let indicatorsMode: Array<number> = [];
    let indicatorsCalculHistorical: Array<number> = [];
    let realizedAction = "ajoutées";

    let error = false;// Génération d'une liste d'indicateurs qui ont été créés ou modifiés
    submitData.forEach(
      (indicator: {
        curves: any[];
        comment: string;
        indicatorMode: number;
        indicatorId: number;
        indicatorCalculHisto: IndicatorCalculHisto;
      }) => {
        indicator.curves.forEach((curve, index) => {
          // Type d'opération: création ou modification
          if (curve.dataId) realizedAction = "modifées";

          // Stockage de la donnée
          if (curve.data != "-") {
            dataToSend.push({
              id: curve.dataId ?? 0,
              date: selectedDate.toDateString(),
              data: curve.data || "", // si le champ est vide alors ''
              comment: index == 0 ? indicator.comment : "",
              curveId: curve.id,
            });

            // Stockage du mode d'indicateur
            indicatorsMode.push(indicator.indicatorMode);

            // Si l'indicateur est hebdo
            if (indicator.indicatorMode === IndicatorMode.Weekly) {
              // Créer une liste contenant toutes les dates de la semaine courante

              // Le cas des dimanches est un cas particulier à gérer spécialement
              let datesOfTheWeek: Array<string> = [];
              let jStart = 1;
              let jEnd = 8;
              if (moment(selectedDate).format("dddd") === "dimanche") {
                jStart = -6;
                jEnd = 1;
              }

              // Création de la liste
              for (let j = jStart; j < jEnd; j++)
                datesOfTheWeek.push(
                  moment(selectedDate).day(j).format("DD/MM/YYYY")
                );

              // Chercher les données qui font partie de la même semaine
              // pour modifier aussi leur valeur
              let dataToUpdate = datasOfTheMonth.filter(
                (d) => (d!.curve!.indicator_id === indicator.indicatorId && datesOfTheWeek.includes(d.date) && d!.curve!.id === curve.id))
              datasToUpdate.push(dataToUpdate);
            }
            else
              datasToUpdate.push([])
          } else {
            error = true;
            errors[curve.name] = true;
            setErrors({ ...errors });
          }
        });


        if (!error && indicator.indicatorCalculHisto != IndicatorCalculHisto.ANY && new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()).getTime() == new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getTime()) {
          // check si la saisie concerne le dernier jour du mois avec une historisation automatique
          indicatorsCalculHistorical.push(indicator.indicatorId)
        }
      });

    if (!error) {// Création ou modification des données
      for (let i = 0; i < dataToSend.length; i++) {
        // Traitement du cas particulier du dimanche
        // (pour le cas hebdomadaire, lorsqu'on va aller modifier les données des
        // autres semaines)
        let jStart = 1;
        let jEnd = 8;
        if (moment(dataToSend[i].date).format("dddd") === "dimanche") {
          jStart = -6;
          jEnd = 1;
        }

        if (dataToSend[i].id == 0) {
          if (indicatorsMode[i] === IndicatorMode.Daily)
            await CreateData({ ...dataToSend[i], date: selectedDate.toLocaleDateString("fr") });

          // Dans le cas hebdo, on crée aussi les données pour les autres jours de la semaine
          else if (indicatorsMode[i] === IndicatorMode.Weekly) {
            for (let j = jStart; j < jEnd; j++) {
              await CreateData({
                ...dataToSend[i],
                date: moment(dataToSend[i].date).day(j).format('DD/MM/YYYY')
              })
            }
          }
        } else {
          if (indicatorsMode[i] === IndicatorMode.Daily)
            await UpdateData({ ...dataToSend[i], date: selectedDate.toLocaleDateString("fr") });

          // Dans le cas hebdo, on modifie aussi les données pour les autres jours de la semaine
          else if (indicatorsMode[i] === IndicatorMode.Weekly) {
            //console.log('datasToUpdate', datasToUpdate)
            for (let j = 0; j < datasToUpdate[i].length; j++)
              await UpdateData({
                ...datasToUpdate[i][j],
                data: dataToSend[i].data,
                comment: dataToSend[i].comment
              })
          }
        }
      }

      // Actualise l'historisation automatique après la création / modif des données
      for (let i = 0; i < indicatorsCalculHistorical.length; i++) {
        console.log('Update historical : ', indicatorsCalculHistorical[i]);
        await UpdateHistorical(indicatorsCalculHistorical[i], new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()).toString());
      }

      top5.getCurrentCategories();

      notify(`Les données ont été ${realizedAction}.`, NotifyActions.Successful);
      refreshForm();
    }

    setActiveForm(true);
  };

  const onError = (error: any) => {
    console.log(`Error : ${error}`);
  };

  return (
    <div key={categories.toString()}>
      <ToastContainer
        position={"top-right"}
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Form onSubmit={handleSubmit(onSubmit, onError)}>
        <Row>
          <Col md={9}>
            <Card>
              <CardHeader className="bg-white">
                <CardTitle tag="h5" className="d-flex align-items-center m-0">
                  Catégories
                </CardTitle>
              </CardHeader>
              <CardBody style={{ paddingBottom: 0 }}>
                <Row>
                  {categories.map((category, index) => {
                    return (
                      <Col key={index} md={4} style={{ marginBottom: "1.25rem" }}>
                        <Button
                          outline={category.id != selectedCategory?.id}
                          block
                          color="primary"
                          onClick={() => setSelectedCategory(category)}
                        >
                          {category.name}
                        </Button>
                      </Col>
                    );
                  })}
                </Row>
              </CardBody>
            </Card>

            {fields && (
              <Row>
                {fields.map((indicator, index) => {
                  if (
                    indicator.indicatorMode !== IndicatorMode.Daily &&
                    indicator.indicatorMode !== IndicatorMode.Weekly
                  )
                    return;

                  const indicatorDate = `${indicator.name} - ${indicator.indicatorMode === IndicatorMode.Daily
                    ? selectedDate.toLocaleDateString("fr")
                    : "S" +
                    moment(selectedDate).format("w") +
                    " - " +
                    moment(selectedDate).format("y")
                    }`;

                  return (
                    <>
                      <Col md={6} key={indicator.id}>
                        <Card>
                          <CardHeader className="bg-white">
                            <CardTitle
                              tag="h5"
                              className="d-flex align-items-center m-0"
                            >
                              {indicatorDate}
                            </CardTitle>
                          </CardHeader>
                          <CardBody>
                            <Row>
                              {indicator.curves?.map((curve, cIndex) => {
                                return (
                                  <Col md={3} key={cIndex}>
                                    <Controller
                                      name={`indicators.${index}.curves.${cIndex}.data`}
                                      control={control}
                                      render={({ field }) => (
                                        <Input
                                          key={`indicators.${index}.curves.${cIndex}.data`}
                                          type="text"
                                          placeholder={curve.name}
                                          {...field}
                                          invalid={errors[curve.name]}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            errors[curve.name] = false;
                                            setErrors({ ...errors });
                                            if (
                                              (value.match(
                                                RegexByUnities[
                                                  parseInt(indicator.unity, 10)
                                                ].regex
                                              )?.length || 0) > 0
                                            )
                                              field.onChange(value);
                                            else if (value.length == 0)
                                              field.onChange(value);
                                            else if (value === "-") field.onChange(value)
                                            else {
                                              errors[curve.name] = true;
                                              setErrors({ ...errors });
                                            }
                                          }}
                                        />
                                      )}
                                    />
                                    <FormFeedback>
                                      {
                                        RegexByUnities[
                                          parseInt(indicator.unity, 10)
                                        ].message
                                      }
                                    </FormFeedback>
                                  </Col>
                                );
                              })}
                              <Col>
                                <Controller
                                  name={`indicators.${index}.comment`}
                                  control={control}
                                  render={({ field }) => (
                                    <Input
                                      key={`indicators.${index}.comment`}
                                      type="text"
                                      placeholder="Commentaire"
                                      {...field}
                                    />
                                  )}
                                />
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                      </Col>
                    </>
                  );
                })}
              </Row>
            )}
          </Col>

          {indicators && (
            <Col md={3}>
              <Card>
                <CardBody>
                  <DatePickerCalendar
                    date={selectedDate}
                    onDateChange={(date) => setSelectedDate(date ?? new Date())}
                    locale={fr}
                  />
                </CardBody>
              </Card>
              <Button className="w-75" type="submit" color="success" block disabled={!activeForm}>
                Valider
              </Button>
            </Col>
          )}
        </Row>
        {/* <Row>
                    <Col md={{ size: 3, offset: 9 }}>
                        <Button
                            className="w-25"
                            type="submit"
                            color="success"
                            block
                        >Valider</Button>
                    </Col>
                </Row> */}
      </Form>
    </div>
  );
};

export default DataForm;
