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

const Sender = (props: {
  control: Control<FicheAdd, any>;
  errors: FieldErrorsImpl<DeepRequired<FicheAdd>>;
  submitted: boolean;
  values: FicheAdd;
  edit?: boolean;
  setValue: Function;
}) => {
  const { control, errors, submitted, values, edit, setValue } = props;

  useEffect(() => {
    setValue("senderFirstname", values.senderFirstname);
    setValue("senderLastname", values.senderLastname);
  }, [values]);

  const { t } = useTranslation();

  return (
    <>
      <h3 style={{ paddingTop: "8px" }}>
        {t("ficheSecuriteCreation.senderTitle")}
      </h3>

      <Row className="ml-1">
        <Col md={4} key="senderFirstname">
          <FormGroup>
            <label
              htmlFor="senderFirstname"
              className="label"
              style={{ display: "block" }}
            >
              {t("ficheSecuriteCreation.senderFirstName")}
            </label>
            <Controller
              name="senderFirstname"
              control={control}
              defaultValue={values.senderFirstname || ""}
              render={({ field }) => (
                <Input
                  readOnly={edit}
                  autoComplete="off"
                  type="text"
                  id="senderFirstname"
                  className={
                    props.errors.senderFirstname && props.submitted
                      ? "text-input error"
                      : "text-input"
                  }
                  {...field}
                />
              )}
            />

            {errors.senderFirstname && submitted && (
              <div className="input-feedback">
                {errors.senderFirstname.message}
              </div>
            )}
          </FormGroup>
        </Col>

        <Col md={4} key="senderLastname">
          <FormGroup>
            <label
              htmlFor="senderLastname"
              className="label"
              style={{ display: "block" }}
            >
              {t("ficheSecuriteCreation.senderName")}
            </label>
            <Controller
              name="senderLastname"
              control={control}
              defaultValue={values.senderLastname || ""}
              render={({ field }) => (
                <Input
                  readOnly={edit}
                  autoComplete="off"
                  type="text"
                  id="senderLastname"
                  className={
                    errors.senderLastname && submitted
                      ? "text-input error"
                      : "text-input"
                  }
                  {...field}
                />
              )}
            />

            {errors.senderLastname && submitted && (
              <div className="input-feedback">
                {errors.senderLastname.message}
              </div>
            )}
          </FormGroup>
        </Col>
      </Row>
    </>
  );
};

export default Sender;
