import { ChangeEvent, useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Col,
  FormGroup,
  Label,
  Row,
  Input,
} from "reactstrap";
import { Controller, useFieldArray, useForm } from "react-hook-form";

import {
  Indicator,
  IndicatorMode,
  CalculHisto,
  IndicatorCalculHisto,
  IndicatorModule,
} from "../../../models/Top5/indicator";
import { Curve } from "../../../models/Top5/curve";
import { Target } from "../../../models/Top5/target";

import {
  CurveType,
  TargetGoal,
  TargetType,
  Ranges,
} from "../../../utils/top5.utils";

import { IndicatorRow } from "./IndicatorRow";
import { CurveTargetRow } from "./CurveTargetRow";
import { AddCurveTargetRow } from "./AddCurveTargetRow";
import { TitleRow } from "./TitleRow";
import { PDFRow } from "./PDFRow";
import { UseIndicatorReturnProps } from "../../../hooks/Top5/indicator";
import { FileRow } from "./FileRow";
import { Colors } from "../../../utils/dopm.utils";

interface IndicatorFormProps {
  indicatorHook: UseIndicatorReturnProps;
  setIndicatorOnCreation?: Function;
  setIndicatorOnEdition?: Function;
}

export interface FormValues {
  id: number;
  name: string;
  responsible: string;
  isDisplayCumulative: boolean;
  unity: number;
  reading: number;
  curves: Array<Curve>;
  targets: Array<Target>;
  fileType: number;
  fileName: string;
  indicatorCalculHisto: number;
  range: number;
  module: number;
  moduleZoneId: number|undefined;
}

const IndicatorForm = ({
  indicatorHook,
  setIndicatorOnCreation,
  setIndicatorOnEdition,
}: IndicatorFormProps) => {
  const indicator = indicatorHook.selectedIndicator;
  const calculHistorical: CalculHisto[] = indicatorHook.calculHistorical;
  const [indicatorMode, setIndicatorMode] = useState<IndicatorMode>(
    indicator?.indicatorMode || IndicatorMode.Daily
  );
  const [file, setFile] = useState<File>();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormValues>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      id: 0,
      name: "",
      unity: 0,
      responsible: "",
      isDisplayCumulative: false,
      reading: 0,
      curves: indicator
        ? []
        : [
            {
              color: Colors[0].value,
              curveType: CurveType.bar,
              id: 0,
              name: "",
            },
          ],
      targets: indicator
        ? []
        : [
            {
              color: Colors[0].value,
              id: 0,
              name: "",
              target: 0,
              targetGoal: TargetGoal.targetMin,
              targetType: TargetType.Croissante,
            },
          ],
      indicatorCalculHisto: IndicatorCalculHisto.ANY,
      fileType: 0,
      fileName: "",
      range: 5,
      module: IndicatorModule.FicheSecurity,
      moduleZoneId: undefined,
    },
  });

  const {
    fields: curveFields,
    append: curveAppend,
    remove: curveRemove,
    // @ts-ignore
  } = useFieldArray({
    name: "curves",
    control,
  });

  const {
    fields: targetFields,
    append: targetAppend,
    remove: targetRemove,
  } = useFieldArray({
    name: "targets",
    control,
  });

  const targets = indicator?.targets?.map((target: Target) => ({
    ...target,
    targetId: target.id,
  }));

  const curves = indicator?.curves?.map((curve: Curve) => ({
    ...curve,
    curveId: curve.id,
  }));

  useEffect(() => {
    if (indicator) {
      // @ts-ignore
      setValue("id", indicator!.id);
      setValue("name", indicator!.name);
      setValue(
        "responsible",
        indicator!.responsible ? indicator!.responsible : ""
      );
      setValue("isDisplayCumulative", indicator!.isDisplayCumulative == true);
      setValue("unity", indicator!.unity ? parseInt(indicator!.unity) : 0);
      setValue("reading", indicator!.reading ? indicator!.reading : 0);
      setValue("curves", curves ? curves : []);
      setValue("targets", targets ? targets : []);
      setValue(
        "indicatorCalculHisto",
        indicator.indicatorCalculHisto
          ? indicator.indicatorCalculHisto
          : IndicatorCalculHisto.ANY
      );
      setValue("fileType", indicator!.fileType ? indicator!.fileType : 0);
      setValue("fileName", indicator!.fileName ?? "");
      setValue("range", indicator!.range ?? 5);
    }

    setIndicatorMode(indicatorMode);
  }, [indicator, setValue, indicatorMode]);

  const handleAddCurve = () => {
    curveAppend({
      color: Colors[0].value,
      curveType: CurveType.bar,
      id: 0,
      name: "",
    });
  };

  const handleAddTarget = () => {
    targetAppend({
      color: Colors[0].value,
      id: 0,
      name: "",
      target: 0,
      targetGoal: TargetGoal.targetMin,
      targetType: TargetType.Croissante,
    });
  };

  const saveFile = async (event: ChangeEvent) => {
    const element = event.target as HTMLInputElement;
    if (element?.files && element.files[0]) {
      setFile(element.files[0]);
    }
  };

  const onSubmit = async (data: any) => {
    if (indicator) {
      const indicatorToSave: Indicator = {
        ...indicator,
        name: data.name,
        indicatorMode: indicatorMode,
        responsible: data.responsible,
        unity: data.unity,
        reading: data.reading,
        isDisplayCumulative: data.isDisplayCumulative,
        indicatorCalculHisto: data.indicatorCalculHisto,
        curves: data.curves,
        targets: data.targets,
        fileType: data.fileType,
        fileName: data.fileName,
        range: data.range,
      };
      if( !indicator.moduleZoneId ) {
        delete indicator.moduleZoneId;
        delete indicator.module;
      }

      await indicatorHook.OnUpdateIndicator({ ...indicatorToSave, file });
      setIndicatorOnEdition?.(false);
    } else {
      await indicatorHook.OnAddIndicator({
        ...data,
        isDisplayCumulative: data.isDisplayCumulative ? 1 : 0,
        indicatorMode,
        file,
      });
      setIndicatorOnCreation?.(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TitleRow
        indicator={indicator}
        indicatorMode={indicatorMode}
        setIndicatorMode={setIndicatorMode}
      />
      <IndicatorRow
        errors={errors}
        register={register}
        control={control}
        indicatorMode={indicatorMode}
        curves={curveFields}
      />
      {indicatorMode === IndicatorMode.PDF ? (
        <PDFRow control={control} setValue={setValue} saveFile={saveFile} />
      ) : (
        <>
          {indicatorMode === IndicatorMode.File ? (
            <FileRow errors={errors} register={register} control={control} />
          ) : (
            <>
              <CurveTargetRow
                errors={errors}
                curveFields={curveFields}
                curveRemove={curveRemove}
                control={control}
                targetFields={targetFields}
                targetRemove={targetRemove}
                register={register}
                indicatorMode={indicatorMode}
              />
              <AddCurveTargetRow
                curveFields={curveFields}
                handleAddCurve={handleAddCurve}
                targetFields={targetFields}
                handleAddTarget={handleAddTarget}
                indicatorMode={indicatorMode}
              />

              {/* Nombre de semaines à afficher */}
              {indicatorMode === IndicatorMode.Weekly && (
                <Row>
                  <Col className="mt-3">
                    <FormGroup row>
                      <Col md={2}>
                        <Label className="mr-2">Plage de semaines :</Label>
                        <Controller
                          name="range"
                          control={control}
                          render={({ field }) => {
                            return (
                              <Input
                                {...field}
                                type="select"
                                onChange={(e) =>
                                  setValue("range", parseInt(e.target.value))
                                }
                              >
                                {Ranges.map((value: number) => (
                                  <option key={value} value={value}>
                                    {value}
                                  </option>
                                ))}
                              </Input>
                            );
                          }}
                        />
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>
              )}

              {/* Remplir l'historique à partir des données */}
              {indicatorMode === IndicatorMode.Daily && (
                <Row>
                  <Col className="mt-3 align-items-center">
                    <FormGroup row className="formCalculHistorical">
                      <Col md={12}>
                        <Label
                          for="calculHistorical"
                          className="labelCalculHistorical mr-2"
                        >
                          Historique Automatique :
                        </Label>
                        <ButtonGroup>
                          {calculHistorical.map((calcul) => (
                            <Controller
                              key={calcul.id}
                              name="indicatorCalculHisto"
                              control={control}
                              render={({ field }) => (
                                <Button
                                  className="radioButton"
                                  color="primary"
                                  outline
                                  type="button"
                                  onClick={() => {
                                    setValue("indicatorCalculHisto", calcul.id);
                                  }}
                                  active={
                                    watch("indicatorCalculHisto") == calcul.id
                                  }
                                  {...field}
                                >
                                  {calcul.libelle}
                                </Button>
                              )}
                            />
                          ))}
                        </ButtonGroup>
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>
              )}
            </>
          )}
        </>
      )}

      <Row style={{ marginTop: "10px" }}>
        {indicator ? (
          <Col md={{ size: 2, offset: 10 }}>
            <Row>
              <Col>
                <Button block color="success" size="lg">
                  Valider
                </Button>
              </Col>
            </Row>
          </Col>
        ) : (
          <Col md={{ size: 3, offset: 9 }}>
            <Row>
              <Col>
                <Button block color="success" size="lg">
                  Valider
                </Button>
              </Col>
            </Row>
          </Col>
        )}
      </Row>
    </form>
  );
};

export default IndicatorForm;
