import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Col,
  FormGroup,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Row,
  Table,
} from "reactstrap";
import {
  CalculHisto,
  Indicator,
  IndicatorMode,
} from "../../../models/Top5/indicator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faPencil,
  faTrash,
  faArchive,
} from "@fortawesome/free-solid-svg-icons";

import {
  CurveType,
  displayCurveType,
  displayIndicatorReading,
  displayIndicatorUnity,
  displayTargetGoal,
  displayTargetType,
} from "../../../utils/top5.utils";
import { Curve } from "../../../models/Top5/curve";
import { Target } from "../../../models/Top5/target";

import { ConfirmationModal } from "../../../components/common/ConfirmationModal";
import "./Settings.scss";
import { UseIndicatorReturnProps } from "../../../hooks/Top5/indicator";
import { Color } from "../../../utils/dopm.utils";
import { useState } from "react";

const displayMode = (indicator: Indicator): string => {
  let mode: string = "Mode ";
  if (indicator.indicatorMode == IndicatorMode.Daily) mode += "journalier";
  else if (indicator.indicatorMode == IndicatorMode.Weekly)
    mode += "hebdomadaire";
  else if (indicator.indicatorMode == IndicatorMode.Monthly) mode += "mensuel";
  else if (indicator.indicatorMode == IndicatorMode.PDF) mode += "pdf";
  else if (indicator.indicatorMode == IndicatorMode.File) mode += "fichier";

  return mode;
};

interface IndicatorCardProps {
  indicator: Indicator;
  indicatorHook: UseIndicatorReturnProps;
  index: number;
  setIndicatorOnEdition: Function;
  indicatorOnDeletion: boolean;
  setIndicatorOnDeletion: Function;
  archivedIndicators: boolean;
}

export const IndicatorCard = ({
  indicator,
  index,
  indicatorHook,
  setIndicatorOnEdition,
  indicatorOnDeletion,
  setIndicatorOnDeletion,
  archivedIndicators,
}: IndicatorCardProps) => {
  const confirmIndicatorDelete = async () => {
    await indicatorHook.OnDeleteIndicator(indicatorHook.selectedIndicator!);
    setIndicatorOnDeletion(false);
  };

  const confirmIndicatorArchive = async () => {
    await indicatorHook.OnArchiveIndicator(indicatorHook.selectedIndicator!);
    setIndicatorOnArchive(false);
  };

  const calculHistorical: CalculHisto[] = indicatorHook.calculHistorical;

  const [indicatorOnArchive, setIndicatorOnArchive] = useState(false);

  return (
    <>
      <ConfirmationModal
        open={indicatorOnDeletion}
        title="Suppression indicateur"
        description={"Étes-vous sûr de supprimer l'indicateur ?"}
        hide={() => setIndicatorOnDeletion(false)}
        confirm={confirmIndicatorDelete}
      />
      <ConfirmationModal
        open={indicatorOnArchive}
        title={`${
          indicator.isArchived ? "Désarchivage" : "Archivage"
        } d'indicateur`}
        description={`Étes-vous sûr de vouloir ${
          indicator.isArchived ? "désarchiver" : "archiver"
        } l'indicateur ?`}
        hide={() => setIndicatorOnArchive(false)}
        confirm={confirmIndicatorArchive}
      />
      <Card
        style={{ backgroundColor: archivedIndicators ? "#eeeeee" : "white" }}
      >
        <CardHeader className="bg-white">
          <CardTitle
            tag="h3"
            style={{
              height: 20,
              fontSize: "1.4em",
            }}
          >
            <Row>
              <Col md={3}>
                <div style={{ marginLeft: 5 }}>{indicator.name}</div>
              </Col>
              <Col md={7} />
              <Col
                md={2}
                style={{ display: "flex", justifyContent: "flex-end" }}
              >
                <div style={{ marginRight: 5 }}>
                  <FontAwesomeIcon
                    color="primary"
                    icon={faPencil}
                    className="pencil-style"
                    onClick={() => {
                      indicatorHook.setSelectedIndicator(indicator);
                      setIndicatorOnEdition(true);
                    }}
                  />
                </div>
                <div style={{ marginLeft: 5 }}>
                  <FontAwesomeIcon
                    color="primary"
                    icon={faArchive}
                    className="trashcan-style"
                    onClick={() => {
                      indicatorHook.setSelectedIndicator(indicator);
                      setIndicatorOnArchive(true);
                    }}
                  />
                </div>
                <div style={{ marginLeft: 10, width: 15 }}>
                  <FontAwesomeIcon
                    color="primary"
                    icon={faTrash}
                    className="trashcan-style"
                    onClick={() => {
                      indicatorHook.setSelectedIndicator(indicator);
                      setIndicatorOnDeletion(true);
                    }}
                  />
                </div>
              </Col>
            </Row>
          </CardTitle>
        </CardHeader>
        <CardBody>
          <Row style={{ marginLeft: 5, height: 20 }}>
            <Col md={1}>
              {index !== 0 && (
                <FontAwesomeIcon
                  color="primary"
                  icon={faChevronUp}
                  className="arrow-style"
                  onClick={async () =>
                    await indicatorHook.changeIndicatorOrder(indicator, false)
                  }
                />
              )}
            </Col>
          </Row>
          <Row style={{ marginLeft: 60, marginRight: 20 }}>
            <Col>
              <Row>
                <Col md={3}>
                  <InputGroup size="sm">
                    <InputGroupText>Indicateur :</InputGroupText>
                    <Input
                      value={indicator.name}
                      disabled
                      style={{
                        backgroundColor: Color.white,
                      }}
                      bsSize="sm"
                    />
                  </InputGroup>
                </Col>
                <Col md={3}>
                  <InputGroup size="sm">
                    <InputGroupText>Responsable :</InputGroupText>
                    <Input
                      value={indicator.responsible}
                      disabled
                      style={{
                        backgroundColor: Color.white,
                      }}
                      bsSize="sm"
                    />
                  </InputGroup>
                </Col>

                  <>
                    <Col md={2}>
                      <InputGroup size="sm">
                        <InputGroupText>Unité :</InputGroupText>
                        <Input
                          value={displayIndicatorUnity(indicator.unity!)}
                          disabled
                          style={{
                            backgroundColor: Color.white,
                          }}
                          bsSize="sm"
                        />
                      </InputGroup>
                    </Col>
                    {indicator.indicatorMode === IndicatorMode.Daily && (
                      <Col md={2}>
                        <InputGroup size="sm">
                          <InputGroupText>Lecture :</InputGroupText>
                          <Input
                            value={displayIndicatorReading(indicator.reading!)}
                            disabled
                            style={{
                              backgroundColor: Color.white,
                            }}
                            bsSize="sm"
                          />
                        </InputGroup>
                      </Col>
                    )}
                    {indicator.curves &&
                      indicator.curves.filter(
                        (c) => c.curveType == CurveType.stackedBar
                      ).length > 1 && (
                        <Col
                          md={2}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Label>
                            <Input
                              type="checkbox"
                              checked={indicator.isDisplayCumulative}
                              disabled
                              style={{
                                backgroundColor: Color.white,
                              }}
                            />
                            Afficher Cumulé
                          </Label>
                        </Col>
                      )}
                  </>
                </Row>
                {indicator.indicatorMode == IndicatorMode.Daily ||
                indicator.indicatorMode == IndicatorMode.Weekly ||
                indicator.indicatorMode == IndicatorMode.Monthly ||
                indicator.indicatorMode == IndicatorMode.Module ? (
                  <>
                    <Row style={{ marginTop: "10px" }}>
                  {indicator.indicatorMode != IndicatorMode.Module && (
                        <Col
                          md={5}
                          style={{ borderRight: "3px ridge #04598c" }}
                        >
                          <Table borderless size="sm" responsive>
                            <thead>
                              <tr>
                                <th>Courbe</th>
                                <th>Type</th>
                                <th>Couleur</th>
                              </tr>
                            </thead>
                            <tbody>
                              {indicator?.curves?.map(
                                (curve: Curve, index: number) => {
                                  return (
                                    <tr key={`curve-${index}`}>
                                      <td>
                                        <Input
                                          value={curve.name}
                                          disabled
                                          style={{
                                            backgroundColor: Color.white,
                                          }}
                                      bsSize="sm"  />
                                      </td>
                                      <td>
                                        <Input
                                          value={displayCurveType(

                                          curve.curveType

                                        )}
                                          disabled
                                          style={{
                                            backgroundColor: Color.white,
                                          }}
                                      bsSize="sm"  />
                                      </td>
                                      <td>
                                        <Input
                                          disabled
                                          style={{
                                            backgroundColor: curve.color,
                                            color: Color.white,
                                          }}bsSize="sm"
                                        />
                                      </td>
                                    </tr>
                                  );
                                }
                              )}
                            </tbody>
                          </Table>
                        </Col>
                      )}
                  <Col md={7}>
                    <Table borderless size="sm" responsive>
                      <thead>
                        <tr>
                          <th>Target</th>
                          <th>Type</th>
                          <th colSpan={2}>Objectif</th>
                          <th>Couleur</th>
                        </tr>
                      </thead>
                      <tbody>
                        {indicator?.targets?.map(
                          (target: Target, index: number) => {
                            return (
                              <tr key={`target-${index}`}>
                                <td>
                                  <Input
                                    value={target.name}
                                    disabled
                                    style={{
                                      backgroundColor: Color.white,
                                    }}
                                    bsSize="sm"
                                  />
                                </td>
                                <td>
                                  <Input
                                    value={displayTargetType(target.targetType)}
                                    disabled
                                    style={{
                                      backgroundColor: Color.white,
                                    }}
                                    bsSize="sm"
                                  />
                                </td>
                                <td>
                                  <Input
                                    value={displayTargetGoal(target.targetGoal)}
                                    disabled
                                    style={{
                                      backgroundColor: Color.white,
                                    }}
                                    bsSize="sm"
                                      />
                                    </td>
                                    <td>
                                      {(indicator.indicatorMode ==
                                        IndicatorMode.Daily ||
                                        indicator.indicatorMode ==
                                          IndicatorMode.Weekly) && (
                                        <Input
                                          value={target.target}
                                          disabled
                                          style={{
                                            backgroundColor: Color.white,
                                          }}
                                      bsSize="sm"
                                  />
                                      )}
                                    </td>
                                    <td>
                                      <Input
                                        disabled
                                        style={{
                                          backgroundColor: target.color,
                                          color: Color.white,
                                        }}
                                      ></Input>
                                    </td>
                                  </tr>
                                );
                              }
                            )}
                          </tbody>
                        </Table>
                      </Col>
                    </Row>
                    {indicator.indicatorMode === IndicatorMode.Daily && (
                      <Row>
                        <Col className="mt-3 ml-2  align-items-center">
                          <FormGroup row className="formCalculHistorical">
                            <Col md={12}>
                              <Label for="calculHistorical" className="mr-2">
                                Historique Automatique :
                              </Label>

                              <ButtonGroup>
                                {calculHistorical.map((calcul) => (
                                  <Button
                                    className="radioButton"
                                    color="primary"
                                    outline
                                    type="button"
                                    active={
                                      indicator.indicatorCalculHisto ==
                                      calcul.id
                                    }
                                    disabled={
                                      indicator.indicatorCalculHisto !=
                                      calcul.id
                                    }
                                    style={{
                                      cursor: "auto",
                                    }}
                                  >
                                    {calcul.libelle}
                                  </Button>
                                ))}
                              </ButtonGroup>
                            </Col>
                          </FormGroup>
                        </Col>
                      </Row>
                    )}
                  </>
                ) : (
                  <>
                    {indicator.indicatorMode == IndicatorMode.PDF && (
                    <Row style={{ marginTop: 20 }}>
                        <Col md={5}>
                          <InputGroup>
                            <InputGroupText htmlFor="name">
                              Lien :
                            </InputGroupText>
                            <Input
                              placeholder={indicator.fileName}
                              disabled
                              style={{ backgroundColor: Color.white }}
                            />
                          </InputGroup>
                        </Col>
                        <Col md={6} style={{ marginLeft: 10 }}>
                          <Row>Type d'affichage</Row>
                          <Input
                            type="radio"
                            id="fileType0"
                            checked={indicator.fileType === 0}
                            disabled
                            style={{ backgroundColor: Color.white }}
                          />{" "}
                          Classique
                          <br />
                          <Input
                            type="radio"
                            id="fileType1"
                            checked={indicator.fileType === 1}
                            disabled
                            style={{ backgroundColor: Color.white }}
                          />{" "}
                          Full Screen
                          <br />
                          <Input
                            type="radio"
                            id="fileType2"
                            checked={indicator.fileType === 2}
                            disabled
                            style={{ backgroundColor: Color.white }}
                          />{" "}
                          Nouvel Onglet
                          <br />
                        </Col>
                      </Row>
                    )}
                  {indicator.indicatorMode === IndicatorMode.File && (
                      <Row style={{ marginTop: 20 }}>
                        <Col md={5}>
                          <InputGroup>
                            <InputGroupText htmlFor="name">
                              Lien :
                            </InputGroupText>
                            <Input
                              placeholder={indicator.fileName}
                              disabled
                              style={{ backgroundColor: Color.white }}
                            />
                          </InputGroup>
                        </Col>
                      </Row>
                    )}
                  </>
                )}
              </Col>
            </Row>
            <Row style={{ marginLeft: 5, height: 20 }}>
            <Col md={1}>
              {index !== indicatorHook.indicators.length - 1 && (
                <FontAwesomeIcon
                  color="primary"
                  icon={faChevronDown}
                  className="arrow-style"
                  onClick={async () =>
                    await indicatorHook.changeIndicatorOrder(indicator, true)
                  }
                />
              )}
            </Col>
          </Row>
        </CardBody>
        <CardFooter style={{ padding: "0" }}>
          <Row
            style={{
              textAlign: "center",
              fontSize: "small",
              flexWrap: "nowrap",
              opacity: 0.4,
              // border: 'solid 2px red'
            }}
          >
            <Col md={3}></Col>
            <Col md={6}>{displayMode(indicator)}</Col>
            <Col md={3} style={{ whiteSpace: "pre-line", fontStyle: "italic" }}>
              {`Dernière modification : ${indicator.updatedAt}`}
            </Col>
          </Row>
        </CardFooter>
      </Card>
    </>
  );
};
