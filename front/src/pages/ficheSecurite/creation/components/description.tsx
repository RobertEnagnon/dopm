import { Col, FormGroup, Input, Row } from "reactstrap";
import {
  Controller,
  Control,
  DeepRequired,
  FieldErrorsImpl,
} from "react-hook-form";
import type { FicheAdd } from "../../../../models/fiche";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import CharactersCounter from "./charactersCounter";

const Description = (props: {
  control: Control<FicheAdd, any>;
  errors: FieldErrorsImpl<DeepRequired<FicheAdd>>;
  submitted: boolean;
  values: FicheAdd;
  setValue: Function;
  watch?: Function;
}) => {
  const { control, errors, submitted, values, setValue, watch } = props;

  useEffect(() => {
    setValue("description", values.description);
  }, [values]);
  const { t } = useTranslation();

  return (
    <Row >
      <Col md={11} style={{ paddingLeft: "15px" }}>
        <FormGroup>
          <label
            className="label"
            htmlFor="description"
            style={{ display: "block" }}
          >
            <h3 style={{ paddingTop: "8px" }}>
              {t("ficheSecuriteCreation.descTite")}{" "}
            </h3>
          </label>
          <CharactersCounter
            actualValue={watch ? watch("description") : ""}
            inputRender={(max: number) => {
              return (
                <Controller
                  name="description"
                  control={control}
                  defaultValue={values.description}
                  render={({ field }) => (
                    <Input
                      autoComplete="off"
                      rows={4}
                      type="textarea"
                      maxLength={max}
                      id="description"
                      className={
                        errors.description && submitted
                          ? "text-input error ml-3"
                          : "text-input ml-3"
                        
                      }
                      {...field}
                    />
                  )}
                />
              );
            }}
          />

          {errors.description && submitted && (
            <div className="input-feedback">{errors.description.message}</div>
          )}
        </FormGroup>
      </Col>
    </Row>
  );
};

export default Description;
