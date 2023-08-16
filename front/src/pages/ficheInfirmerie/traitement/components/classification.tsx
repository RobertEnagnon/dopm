import { Col, FormGroup, Input, InputGroup, Label } from "reactstrap";
import styles from "../index.module.css";
import { useState } from "react";
import { DeepRequired, FieldErrorsImpl, Controller, Control } from "react-hook-form";
import { useEffect } from "react";
import { FicheInfAdd } from "../../../../models/ficheinf";
import { useCategory } from "../../../../hooks/FicheInfirmerie/fiCategory";
import { Classification } from "../../../../models/FicheInfirmerie/classification";

const ClassificationComp = (props: { control: Control<FicheInfAdd, any>, errors: FieldErrorsImpl<DeepRequired<FicheInfAdd>>, submitted: boolean, values: FicheInfAdd, setValue: Function }) => {
  const { categories } = useCategory<Classification>({endpoint: 'fi_classification'})

  const {
    control,
    errors,
    submitted,
    values,
    setValue
  } = props;

  const [classificationId, setClassificationId] = useState(values.classificationId === undefined ? -1 : values.classificationId)
  useEffect(() => {
    setValue("classificationId", values.classificationId)
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

        {categories && (
          <InputGroup>
            {categories.map(
              (classification) => {
                return (
                  <Controller
                    key={classification.id}
                    name="classificationId"
                    control={control}
                    defaultValue={values.classificationId}
                    render={({ field }) => <Col
                      className="radio-container"
                      key={classification.id}
                      xs={6}
                      md={3}
                    >
                      <Input
                        type="radio"
                        value={classification.id}
                        id={`cls${classification.name}`}
                        checked={classification.id === classificationId}
                        onChange={(e) => { field.onChange(e.target.value); setClassificationId(parseInt(e.target.value)) }}
                      />
                      <Label for={`cls${classification.name}`} check>
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

export default ClassificationComp
