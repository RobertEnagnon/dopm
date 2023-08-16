import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  Input,
  Row,
  Table,
  UncontrolledDropdown,
} from "reactstrap";
import { useEffect, useMemo, useState } from "react";
import { getYears, monthLabel } from "../../utils/top5.utils";
import { useTop5 } from "../../components/context/top5.context";
import { Category } from "../../models/Top5/category";
import { useIndicator } from "../../hooks/Top5/indicator";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { CreateHisto, UpdateHisto } from "../../services/Top5/historical";
import { notify, NotifyActions } from "../../utils/dopm.utils";
import { useHistorical } from "../../hooks/Top5/historical";
import { IndicatorMode } from "../../models/Top5/indicator";
import { permissionsList } from "../../models/Right/permission";
import { useUser } from "../../components/context/user.context";
import IndicatorComment from "../../components/top5/indicatorForm/IndicatorComment";

type FormValues = {
  indicators: {
    indicatorId: number;
    indicatorMode: number;
    name: string;
    historicals: {
      data: string;
      target: string;
      comment: string;
      year: string;
      month: string;
      idHisto: number;
    }[];
  }[];
};

const HistoForm = () => {
  const userContext = useUser();
  const top5 = useTop5();
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
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear()?.toString()
  );
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >(undefined);

  // Données en cours d'ajout / update
  const [activeForm, setActiveForm] = useState(true);

  const indicators = useIndicator({ category: selectedCategory }).indicators;
  const histoHook = useHistorical(indicators, selectedYear);
  const { control, watch, handleSubmit } = useForm<FormValues>({
    mode: "onBlur",
  });
  const { fields, append, remove } = useFieldArray({
    name: "indicators",
    control,
  });

  /* Refresh form */
  useEffect(() => {
    onInitForm();
  }, [histoHook.data]);

  const onInitForm = () => {
    remove();
    append(histoHook.data);
  };

  const onSubmit = async (data: any) => {
    setActiveForm(false);
    let submitData = data.indicators;
    let dataToSend: Array<any> = [];
    let realizedAction = "ajoutées";

    submitData.forEach(
      (indicator: {
        historicals: {
          data: string;
          target: string;
          comment: string;
          year: string;
          month: string;
          idHisto: number;
        }[];
        indicatorId: number;
      }) => {
        indicator.historicals.forEach((histo, indexHisto) => {
          if (histo.idHisto) realizedAction = "modifiées";
          if (
            histo.data ||
            histo.target ||
            histo.data === "" ||
            histo.target === ""
          ) {
            dataToSend.push({
              id: histo.idHisto ?? 0,
              month: (indexHisto + 1).toString().padStart(2, "0"),
              year: selectedYear,
              data: histo.data,
              target: histo.target,
              comment: histo.comment ? histo.comment : "",
              indicatorId: indicator.indicatorId,
            });
          }
        });
      }
    );

    for (let i = 0; i < dataToSend.length; i++) {
      if (dataToSend[i].id == 0) {
        await CreateHisto(dataToSend[i]);
      } else {
        await UpdateHisto(dataToSend[i]);
      }
    }

    notify(`Les données ont été ${realizedAction}.`, NotifyActions.Successful);
    await histoHook.refreshForm();
    setActiveForm(true);

  };

  const onError = (error: any) => {
    console.log(`Error : ${error}`);
  };

  return (
    <div>
      {/**Pas de ToastContainer ici, car l'elt parent l'a deja */}
      <Form onSubmit={handleSubmit(onSubmit, onError)}>
        <Row>
          <Col>
            <Card>
              <CardHeader className="bg-white">
                <Row>
                  <Col>
                    <CardTitle
                      tag="h5"
                      className="d-flex align-items-center m-0"
                    >
                      Catégories
                    </CardTitle>
                  </Col>
                  <Col md={1}>
                    <div className={"card-actions float-right"}>
                      <UncontrolledDropdown className={"d-inline-block"}>
                        <DropdownToggle
                          caret
                          color={"white"}
                          style={{
                            fontSize: "1em",
                            padding: 0,
                            marginRight: "6px",
                          }}
                        >
                          {selectedYear}
                        </DropdownToggle>
                        <DropdownMenu right>
                          {getYears().map((year) => {
                            return (
                              <DropdownItem
                                key={year}
                                onClick={() => {
                                  setSelectedYear(year);
                                }}
                              >
                                {year}
                              </DropdownItem>
                            );
                          })}
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </div>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Row>
                  {categories.length > 0 &&
                    categories.map((category) => {
                      return (
                        <Col key={`cat-${category.id}`}>
                          <Button
                            outline={category.id !== selectedCategory?.id}
                            block
                            color={"primary"}
                            onClick={() => {
                              setSelectedCategory(category);
                            }}
                          >
                            {category.name}
                          </Button>
                        </Col>
                      );
                    })}
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {fields &&
          fields.map((indicator, iIndex) => {
            if (
              indicator.indicatorMode === IndicatorMode.Daily ||
              indicator.indicatorMode === IndicatorMode.Weekly ||
              indicator.indicatorMode === IndicatorMode.Monthly
            ) {
              return (
                <Row key={`${selectedYear}-${indicator.id}`}>
                  <Col>
                    <Card>
                      <CardHeader className="bg-white">
                        <CardTitle
                          tag={"h5"}
                          className="d-flex align-items-center m-0"
                        >
                          {indicator.name}
                        </CardTitle>
                      </CardHeader>
                      <CardBody>
                        <Row>
                          <Col>
                            <Table borderless size="sm" responsive>
                              <thead>
                                <tr>
                                  <th>Mois</th>
                                  {monthLabel.map((m, i) => {
                                    return (
                                      <th key={`${m}-${i * Date.now()}`}>
                                        {m}
                                      </th>
                                    );
                                  })}
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <th>Réel</th>
                                  {monthLabel.map((m, hIndex) => {
                                    return (
                                      <td key={`real-${hIndex}`}>
                                        <Controller
                                          name={`indicators.${iIndex}.historicals.${hIndex}.data`}
                                          control={control}
                                          render={({ field }) => (
                                            <Input
                                              type="number"
                                              placeholder={`Histo. ${m}`}
                                              {...field}
                                            />
                                          )}
                                        />
                                      </td>
                                    );
                                  })}
                                </tr>
                                <tr>
                                  <th>Target</th>
                                  {monthLabel.map((m, hIndex) => {
                                    return (
                                      <td key={`target-${hIndex}`}>
                                        <Controller
                                          name={`indicators.${iIndex}.historicals.${hIndex}.target`}
                                          control={control}
                                          render={({ field }) => (
                                            <Input
                                              type="number"
                                              placeholder={`Target. ${m}`}
                                              {...field}
                                            />
                                          )}
                                        />
                                      </td>
                                    );
                                  })}
                                </tr>
                                {indicators.filter(
                                  (el) => el.id === indicator.indicatorId
                                )[0] &&
                                  indicators.filter(
                                    (el) => el.id === indicator.indicatorId
                                  )[0].indicatorMode ===
                                  IndicatorMode.Monthly && (
                                    <tr>
                                      <th>Commentaire</th>
                                      {monthLabel.map((m, hIndex) => {
                                        return (
                                          <td key={`comment-${hIndex}`}>
                                            <IndicatorComment
                                              id={
                                                indicator.historicals[hIndex]
                                                  .idHisto
                                              }
                                              month={hIndex + 1}
                                              year={selectedYear}
                                              indicatorId={
                                                indicator.indicatorId
                                              }
                                              defaultComment={
                                                indicator.historicals[hIndex]
                                                  .comment
                                                  ? indicator.historicals[
                                                    hIndex
                                                  ].comment
                                                  : ""
                                              }
                                              dataValue={{
                                                target: watch(
                                                  `indicators.${iIndex}.historicals.${hIndex}.target`
                                                ),
                                                data: watch(
                                                  `indicators.${iIndex}.historicals.${hIndex}.data`
                                                ),
                                              }}
                                            />
                                          </td>
                                        );
                                      })}
                                    </tr>
                                  )}
                              </tbody>
                            </Table>
                            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                              <Button
                                color="success"
                                type="submit"
                                className="btn btn-lg"
                                disabled={!activeForm}
                              >
                                Valider
                              </Button>
                            </div>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              );
            }
          })}
      </Form>
    </div>
  );
};

export default HistoForm;
