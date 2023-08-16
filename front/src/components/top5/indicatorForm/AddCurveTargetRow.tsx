import React from "react";
import { Button, Col, Row } from "reactstrap";
import {IndicatorMode} from "../../../models/Top5/indicator";

interface AddCuvreTargetRowProps {
  curveFields: any;
  handleAddCurve: React.MouseEventHandler<HTMLButtonElement>;
  targetFields: any;
  handleAddTarget: React.MouseEventHandler<HTMLButtonElement>;
  indicatorMode: number;
}

export const AddCurveTargetRow = ({
  curveFields,
  handleAddCurve,
  targetFields,
  handleAddTarget,
  indicatorMode
}: AddCuvreTargetRowProps) => {
  return (
    <Row>
        {indicatorMode !== IndicatorMode.Module &&
          <Col md={5}>
            {curveFields.length < 3 && (
              <Button color="primary" size="sm" onClick={handleAddCurve}>
                Ajouter une courbe
              </Button>
            )}
          </Col>
        }
      <Col md={7}>
        {targetFields.length < 3 && (
          <Button color="primary" size="sm" onClick={handleAddTarget}>
            Ajouter une target
          </Button>
        )}
      </Col>
    </Row>
  );
};
