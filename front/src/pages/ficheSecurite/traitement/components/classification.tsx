import { Col, FormGroup, Input, InputGroup, Label } from "reactstrap";
import styles from "../index.module.css";
import { useState } from "react";
import { DeepRequired, FieldErrorsImpl, Controller, Control } from "react-hook-form";
import type { FicheAdd } from "../../../../models/fiche";
import { useClassification } from "../../../../hooks/FicheSecurite/classification";
import { useEffect } from "react";

const Classification = (props: { control: Control<FicheAdd, any>, errors: FieldErrorsImpl<DeepRequired<FicheAdd>>, submitted: boolean, values: FicheAdd, setValue: Function }) => {
  const { classifications } = useClassification();

  const {
    control,
    errors,
    submitted,
    values,
    setValue
  } = props;

  const [classificationId, setClassificationId] = useState(values.classificationId === undefined ? -1 : values.classificationId);
  useEffect(() => {
    setValue("classificationId", values.classificationId);
  }, [values])

  useEffect(() => {
    setClassificationId(values.classificationId === undefined ? -1 : values.classificationId)
  }, [values])

  return (
    <FormGroup>
      <Col>
        <label
          htmlFor="classificationId"
          className="label"
          style={{ display: "block" }}
        >
          Classification
        </label>

        {classifications && (
          <InputGroup style={{ marginLeft: "12px" }}>
            {classifications.map(
              (classification) => {
                return (
                  <Controller
                    key={classification.id}
                    name="classificationId"
                    control={control}
                    defaultValue={values.classificationId}
                    render={({ field }) => <Col
                      key={classification.id}
                      xs={6}
                      md={3}
                    >
                      <Label check>
                        <Input
                          type="radio"
                          value={classification.id}
                          checked={classification.id === classificationId}
                          onChange={(e) => { field.onChange(e.target.value); setClassificationId(parseInt(e.target.value)) }}
                        />{" "}
                        {classification.name}
                      </Label>
                    </Col>}
                  />
                );
              }
            )}
          </InputGroup>
        )}
        {errors.classificationId &&
          submitted && (
            <div className={styles.inputFeedback}>
              {errors.classificationId.message}
            </div>
          )}
      </Col>
    </FormGroup>
  );
}

export default Classification;
