import { useState } from "react";
import { Alert, Button, Col, Input, Row, Table } from "reactstrap";
import { CurveType, TargetGoal, TargetType } from "../../../utils/top5.utils";
import { Controller } from "react-hook-form";
import { ConfirmationModal } from "../../../components/common/ConfirmationModal";
import { DeleteTarget } from "../../../services/Top5/target";
import { DeleteCurve } from "../../../services/Top5/curve";
import {
  Color,
  Colors,
  notify,
  NotifyActions,
} from "../../../utils/dopm.utils";
import { IndicatorMode } from "../../../models/Top5/indicator";

interface CurveTargetRowProps {
  errors: any;
  curveFields: any;
  curveRemove: any;
  control: any;
  targetFields: any;
  targetRemove: any;
  register: any;
  indicatorMode: number;
}

export const CurveTargetRow = ({
  errors,
  curveFields,
  curveRemove,
  control,
  targetFields,
  targetRemove,
  indicatorMode,
}: CurveTargetRowProps) => {
  const [deleteTargetModal, setDeleteTargetModal] = useState<boolean>(false);
  const [deleteCurveModal, setDeleteCurveModal] = useState<boolean>(false);
  const [targetToDelete, setTargetToDelete] = useState({
    targetId: 0,
    index: 0,
  });
  const [curveToDelete, setCurveToDelete] = useState({
    curveId: 0,
    index: 0,
  });

  const deleteTarget = (targetId: number | undefined, index: number) => {
    if (targetFields.length > 1 && targetId) {
      setTargetToDelete({
        targetId,
        index,
      });
      setDeleteTargetModal(true);
    }

    if (targetFields.length > 1 && !targetId) {
      targetRemove(index);
    }

    if (targetFields.length === 1) {
      notify("Il faut avoir au moins une target", NotifyActions.Error);
    }
  };

  const deleteCurve = (curveId: number | undefined, index: number) => {
    if (curveFields.length > 1 && curveId) {
      setCurveToDelete({
        curveId,
        index,
      });
      setDeleteCurveModal(true);
    }

    if (curveFields.length > 1 && !curveId) {
      curveRemove(index);
    }

    if (curveFields.length === 1) {
      notify("Il faut avoir au moins une courbe", NotifyActions.Error);
    }
  };

  const confirmTargetDelete = () => {
    targetRemove(targetToDelete.index);
    DeleteTarget(targetToDelete.targetId);
    setDeleteTargetModal(false);
  };

  const confirmCurveDelete = () => {
    curveRemove(curveToDelete.index);
    DeleteCurve(curveToDelete.curveId);
    setDeleteCurveModal(false);
  };

  return (
    <>
      <ConfirmationModal
        open={deleteTargetModal}
        title="Suppression target"
        description={"Etes-vous sûr de supprimer la target ?"}
        hide={() => setDeleteTargetModal(false)}
        confirm={confirmTargetDelete}
      />
      <ConfirmationModal
        open={deleteCurveModal}
        title="Suppression courbe"
        description={"Etes-vous sûr de supprimer la courbe ?"}
        hide={() => setDeleteCurveModal(false)}
        confirm={confirmCurveDelete}
      />
      <Row style={{ marginTop: "10px" }}>
        {indicatorMode !== IndicatorMode.Module && (
          <Col md={5} style={{ borderRight: "3px ridge #04598c" }}>
            {errors.curves && errors.curves[0].name.message && (
              <Alert color="danger" style={{ padding: "0.5rem" }}>
                {errors.name.message}
              </Alert>
            )}
            <Table borderless  size="sm" responsive>
              <thead>
                <tr>
                  <th>Courbe</th>
                  <th>Type</th>
                  <th>Couleur</th>
                </tr>
              </thead>
              <tbody>
                {curveFields.map((curve: any, index: number) => {
                  return (
                    <tr key={`curve-${index}`}>
                      <td>
                        <Controller
                          name={`curves.${index}.name`}
                          control={control}
                          render={({ field }) => (
                            <Input
                              type="text"
                              placeholder="Nom de Courbe"
                              {...field}
                            />
                          )}
                        />
                      </td>
                      <td>
                        <Controller
                          name={`curves.${index}.curveType`}
                          control={control}
                          render={({ field }) => {
                            return (
                              <Input
                                type="select"
                                disabled={
                                  indicatorMode === IndicatorMode.Monthly
                                }
                                {...field}
                              >
                                <option value={CurveType.bar}>
                                  Histogramme
                                </option>
                                <option value={CurveType.stackedBar}>
                                  Histogramme Empilé
                                </option>
                                {indicatorMode !== IndicatorMode.Weekly && (
                                  <option value={CurveType.line}>Courbe</option>
                                )}
                              </Input>
                            );
                          }}
                        />
                      </td>
                      <td>
                        <Controller
                          name={`curves.${index}.color`}
                          control={control}
                          render={({ field }) => {
                            return (
                              <Input
                                type="select"
                                style={{
                                  backgroundColor: field.value,
                                  color: Color.white,
                                }}
                                disabled={
                                  indicatorMode === IndicatorMode.Monthly ||
                                  indicatorMode === IndicatorMode.Weekly
                                }
                                {...field}
                              >
                                {Colors.map((color, index) => {
                                  return (
                                    <option
                                      key={`curveColor-${index}`}
                                      value={color.value}
                                      style={{
                                        backgroundColor: `${color.value}`,
                                        color: Color.white,
                                      }}
                                    >
                                      {color.name}
                                    </option>
                                  );
                                })}
                              </Input>
                            );
                          }}
                        />
                      </td>
                      <td>
                        <Button
                          color="danger"
                          onClick={() => {
                            deleteCurve(curve.curveId, index);
                          }}
                        >
                          -
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Col>
        )}
        <Col md={indicatorMode === IndicatorMode.Module ? 12 : 7}>
          {errors.targets && errors.targets[0].name.message && (
            <Alert color="danger" style={{ padding: "0.5rem" }}>
              {errors.name.message}
            </Alert>
          )}
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
              {targetFields.map((target: any, index: number) => {
                return (
                  <tr key={`target-${index}`}>
                    <td>
                      <Controller
                        name={`targets.${index}.name`}
                        control={control}
                        render={({ field }) => {
                          return (
                            <Input
                              type="text"
                              placeholder="Nom de Target"
                              {...field}
                            />
                          );
                        }}
                      />
                    </td>
                    <td>
                      <Controller
                        name={`targets.${index}.targetType`}
                        control={control}
                        render={({ field }) => {
                          return (
                            <Input
                              type="select"
                              {...field}
                              disabled={indicatorMode === IndicatorMode.Monthly}
                            >
                              <option value={TargetType.Croissante}>
                                Croissante
                              </option>
                              <option value={TargetType.Horizontale}>
                                Horizontale
                              </option>
                              <option value={TargetType.Decroissante}>
                                Décroissante
                              </option>
                            </Input>
                          );
                        }}
                      />
                    </td>
                    <td>
                      <Controller
                        name={`targets.${index}.targetGoal`}
                        control={control}
                        render={({ field }) => {
                          return (
                            <Input type="select" {...field}>
                              <option value={TargetGoal.targetMin}>
                                Target Min.
                              </option>
                              <option value={TargetGoal.targetMax}>
                                Target Max.
                              </option>
                            </Input>
                          );
                        }}
                      />
                    </td>
                    {(indicatorMode == IndicatorMode.Daily ||
                      indicatorMode == IndicatorMode.Weekly ||
                      indicatorMode == IndicatorMode.Module) && (
                      <td>
                        <Controller
                          name={`targets.${index}.target`}
                          control={control}
                          render={({ field }) => {
                            return (<Input type="number" {...field} />
                          );
                          }}
                        />
                      </td>
                    )}
                    <td>
                      <Controller
                        name={`targets.${index}.color`}
                        control={control}
                        render={({ field }) => {
                          return (
                            <Input
                              type="select"
                              disabled={indicatorMode === IndicatorMode.Monthly}
                              style={{
                                backgroundColor: field.value,
                                color: Color.white,
                              }}
                              {...field}
                            >
                              {Colors.map((color, index) => {
                                return (
                                  <option
                                    key={`targetColor-${index}`}
                                    value={color.value}
                                    style={{
                                      backgroundColor: `${color.value}`,
                                      color: Color.white,
                                    }}
                                  >
                                    {color.name}
                                  </option>
                                );
                              })}
                            </Input>
                          );
                        }}
                      />
                    </td>
                    <td>
                      <Button
                        color="danger"
                        onClick={() => deleteTarget(target.targetId, index)}
                      >
                        -
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Col>
      </Row>
    </>
  );
};
