import { DeepRequired, FieldErrorsImpl, Controller, Control } from "react-hook-form";
import type { FicheAdd } from "../../../../models/fiche";
import { Col, FormGroup } from "reactstrap";
import styles from "../index.module.css";
import { Responsible } from "../../../../models/responsible";
import { useEffect } from "react";

const Assignation = (props: { responsibles: Array<Responsible>, control: Control<FicheAdd, any>, errors: FieldErrorsImpl<DeepRequired<FicheAdd>>, submitted: boolean, values: FicheAdd, setValue: Function }) => {

  const {
    control,
    errors,
    submitted,
    values,
    setValue
  } = props;

  useEffect(() => {
    setValue("assignationId", values.assignationId);
  }, [values])

  return (
    <FormGroup>
      <Col>
        <label
          htmlFor="assignationId"
          className="label"
          style={{ display: "block" }}
        >
          Responsable
        </label>

        <Controller
          name="assignationId"
          control={control}
          defaultValue={values.assignationId}
          render={({ field }) => <select
            className="form-control"
            id="assignationId"
            style={{ display: "block" }}
            {...field}
          >
            <option value="">Select responsable</option>
            {props.responsibles.map((responsible) => {
              return (
                <option value={responsible.id} key={responsible.id}>
                  {responsible.firstname + " " + responsible.lastname}
                </option>
              );
            })}
          </select>}
        />

        {errors.assignationId &&
          submitted && (
            <div className={styles.inputFeedback}>
              {errors.assignationId.message}
            </div>
          )}
      </Col>
    </FormGroup>
  );
}

export default Assignation;
