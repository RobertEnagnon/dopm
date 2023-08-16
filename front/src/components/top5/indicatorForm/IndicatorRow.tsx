import {
  Alert,
  Col,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Row,
} from "reactstrap";
import { Reading, Unities } from "../../../utils/top5.utils";
import { Controller } from "react-hook-form";
import { useEffect } from "react";
import "./indicator.scss";
import {IndicatorMode, IndicatorModule} from "../../../models/Top5/indicator";
import {useZone} from "../../../hooks/zone";

interface IndicatorRowProps {
  errors: any;
  register: any;
  control: any;
  indicatorMode: IndicatorMode;
  curves: any;
}

export const IndicatorRow = ({
  errors,
  register,
  control,
  indicatorMode,
  curves,
}: IndicatorRowProps) => {
  const INCLUDED_UNITY = [
    IndicatorMode.Daily,
    IndicatorMode.Weekly,
    IndicatorMode.Monthly,
    IndicatorMode.Module
  ];
  const INCLUDED_READING = [
    IndicatorMode.Daily,
    IndicatorMode.Module
  ];
  const MODULES = [
    {
      label: "Fiche Sécurité",
      value: IndicatorModule.FicheSecurity,
    },
  ];

  const { zones } = useZone();

  useEffect(() => {
    register("name", {
      validate: (value: string) =>
        value?.trim()?.length == 0
          ? "Vous devez saisir un nom."
          : value?.trim()?.length >= 3 ||
            "Le nom doit contenir au moins 3 caractères.",
    });

    register("responsible", {
      validate: (value: string) =>
        value?.trim()?.length == 0
          ? "Vous devez saisir un nom."
          : value?.trim()?.length >= 3 ||
            "Le nom doit contenir au moins 3 caractères.",
    });
  }, [register]);

  return (
    <>
      <Row>
        <Col md={3}>
          {errors.name && (
            <Alert color="danger" style={{ padding: "0.5rem" }}>
              {errors.name.message}
            </Alert>
          )}
          <InputGroup size="sm">
            <InputGroupText htmlFor="name">Indicateur :</InputGroupText>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input type="text" id="indicatorName" {...field} bsSize="sm" />
              )}
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          {errors.responsible && (
            <Alert color="danger" style={{ padding: "0.5rem" }}>
              {errors.responsible.message}
            </Alert>
          )}
          <InputGroup size="sm">
            <InputGroupText htmlFor="responsible">Responsable :</InputGroupText>
            <Controller
              name="responsible"
              control={control}
              render={({ field }) => (
                <Input type="text" id="responsibleName" {...field} bsSize="sm" />
              )}
            />
          </InputGroup>
        </Col>
        {(INCLUDED_UNITY.includes(indicatorMode)) && (
          <>
            <Col md={2}>
              <InputGroup size="sm">
                <InputGroupText htmlFor="unity">Unité :</InputGroupText>
                <Controller
                  name="unity"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Input type="select" {...field} bsSize="sm">
                        {Unities.map((unity, index) => {
                          return (
                            <option key={unity} value={index}>
                              {unity}
                            </option>
                          );
                        })}
                      </Input>
                    );
                  }}
                />
              </InputGroup>
            </Col>
            {(INCLUDED_READING.includes(indicatorMode)) &&
            <Col md={2}>
              <InputGroup size="sm">
                <InputGroupText html="reading">Lecture</InputGroupText>
                <Controller
                  name="reading"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Input
                        type="select"
                        {...field}
                        bsSize="sm"
                      >
                        {Reading.map((reading, index) => {
                          return (
                            <option key={reading} value={index}>
                              {reading}
                            </option>
                          );
                        })}
                      </Input>
                    );
                  }}
                />
              </InputGroup>
            </Col>}
            {curves.length > 1 && (
              <Col
                md={2}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Label>
                  <Controller
                    name="isDisplayCumulative"
                    control={control}
                    render={({ field }) => {
                      return (
                        <Input
                          type="checkbox"
                          id="isDisplayCumulative"
                          checked={field.value}
                          {...field}
                        />
                      );
                    }}
                  />
                  Afficher Cumulé
                </Label>
              </Col>
            )}
          </>
        )}
      </Row>

      {/*Remplir les données à partir d'une application*/}
      {indicatorMode === IndicatorMode.Module && (
          <Row className="mt-3">
              <Col md={3}>
                <InputGroup size="sm">
                  <InputGroupText html="module">Module :</InputGroupText>
                  <Controller
                      name="module"
                      control={control}
                      render={({ field }) => {
                        return (
                            <Input type="select" {...field}>
                              {MODULES.map((module) => {
                                return (
                                    <option
                                        key={module.label}
                                        value={module.value}
                                    >
                                      {module.label}
                                    </option>
                                );
                              })}
                            </Input>
                        );
                      }}
                  />
                </InputGroup>
              </Col>

              <Col md={3}>
                <InputGroup size="sm">
                  <InputGroupText html="moduleZoneId">Zone :</InputGroupText>
                  <Controller
                      name="moduleZoneId"
                      control={control}
                      render={({ field }) => {
                        // @ts-ignore
                        return (
                            <Input type="select" {...field}>
                              <option key="all" value="0">
                                Toutes
                              </option>
                              {zones.map((zone) => {
                                return (
                                    <option
                                        key={zone.id * Date.now()}
                                        value={zone.id}
                                    >
                                      {zone.name}
                                    </option>
                                );
                              })}
                            </Input>
                        );
                      }}
                  />
                </InputGroup>
              </Col>
          </Row>
      )}
    </>
  );
};
