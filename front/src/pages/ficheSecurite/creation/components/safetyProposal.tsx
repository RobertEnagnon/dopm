import { Col, FormGroup, Input, Row } from "reactstrap";
import { Responsible } from "../../../../models/responsible";
import {
  Controller,
  Control,
  DeepRequired,
  FieldErrorsImpl,
  UseFormResetField,
} from "react-hook-form";
import type { FicheAdd } from "../../../../models/fiche";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import CharactersCounter from "./charactersCounter";

const SafetyProposal = (props: {
  responsibleConservatoires: Array<Responsible>;
  resetField: UseFormResetField<FicheAdd>;
  control: Control<FicheAdd, any>;
  errors: FieldErrorsImpl<DeepRequired<FicheAdd>>;
  submitted: boolean;
  values: FicheAdd;
  setValue: Function;
  watch?: Function;
}) => {
  const sortResponsible = (responsibles: Array<Responsible>) => {
    return responsibles.sort((a, b) => {
      if (a.lastname < b?.lastname) {
        return -1;
      }
      if (a.lastname > b.lastname) {
        return 1;
      }
      if (a.firstname < b.firstname) {
        return -1;
      }
      if (a.firstname > b.firstname) {
        return 1;
      }
      return 0;
    });
  };

  const {
    responsibleConservatoires,
    control,
    errors,
    submitted,
    values,
    setValue,
    resetField,
    watch,
  } = props;

  useEffect(() => {
    setValue("mesureConservatoire", values.mesureConservatoire);
    if (values.responsibleConservatoireId)
      setValue("responsibleConservatoireId", values.responsibleConservatoireId);
    if (values.deadLineConservatoire)
      setValue(
        "deadLineConservatoire",
        values.deadLineConservatoire?.substring(0, 10)
      );
  }, [values]);

  const { t } = useTranslation();
  return (
    <>
      <h3 style={{ paddingTop: "8px" }}>
        {t("ficheSecuriteCreation.SafetyProposalTitle")}
      </h3>
      <Row>
        <Col md={8}>
          <FormGroup>
            <label
              className="label"
              htmlFor="mesureConservatoire"
              style={{ display: "block" }}
            >
              {t("ficheSecuriteCreation.SafetyAppliedAction")}
            </label>
            <CharactersCounter
              maxCharacter={200}
              actualValue={watch ? watch("mesureConservatoire") : ""}
              inputRender={(max: number) => {
                return (
                  <Controller
                    name="mesureConservatoire"
                    control={control}
                    defaultValue={values.mesureConservatoire}
                    render={({ field }) => (
                      <Input
                        autoComplete="off"
                        rows={4}
                        type="textarea"
                        maxLength={max}
                        id="mesureConservatoire"
                        className={
                          errors.mesureConservatoire && submitted
                            ? "text-input error"
                            : "text-input"
                        }
                        {...field}
                      />
                    )}
                  />
                );
              }}
            />

            {errors.mesureConservatoire && submitted && (
              <div className="input-feedback">
                {errors.mesureConservatoire.message}
              </div>
            )}
          </FormGroup>
        </Col>
        <Col md={4}>
          <Row>
            <FormGroup>
              <Col>
                <label
                  htmlFor="responsibleConservatoireId"
                  className="label"
                  style={{ display: "block" }}
                >
                  {t("ficheSecuriteCreation.SafetyAppliedResponsible")}
                </label>

                <Controller
                  name="responsibleConservatoireId"
                  control={control}
                  defaultValue={values.responsibleConservatoireId}
                  render={({ field }) => (
                    <select
                      id="responsibleConservatoireId"
                      className="form-select"
                      style={{ display: "block" }}
                      {...field}
                      onChange={(e) =>
                        e.target.value == "-1"
                          ? resetField("responsibleConservatoireId")
                          : field.onChange(e)
                      }
                    >
                      <option value="-1">
                        {t("ficheSecuriteCreation.senderSeclect")}{" "}
                        {t("ficheSecuriteCreation.SafetyAppliedResponsible")}
                      </option>
                      {responsibleConservatoires &&
                        sortResponsible(responsibleConservatoires).map(
                          (responsibleConservatoire) => {
                            return (
                              <option
                                value={responsibleConservatoire.id}
                                key={responsibleConservatoire.id}
                              >
                                {responsibleConservatoire.lastname.toUpperCase() +
                                  " " +
                                  responsibleConservatoire.firstname}
                              </option>
                            );
                          }
                        )}
                    </select>
                  )}
                />

                {errors.responsibleConservatoireId && submitted && (
                  <div className="input-feedback">
                    {errors.responsibleConservatoireId.message}
                  </div>
                )}
              </Col>
            </FormGroup>
          </Row>
          <Row>
            <FormGroup>
              <Col md={12} xs={12}>
                <label
                  htmlFor="deadLineConservatoire"
                  className="label"
                  style={{ display: "block" }}
                >
                  {t("ficheSecuriteCreation.SafetyProposalDate")}
                </label>

                <Controller
                  name="deadLineConservatoire"
                  control={control}
                  render={({ field }) => (
                    <Input
                      autoComplete="off"
                      type="date"
                      id="deadLineConservatoire"
                      className={
                        errors.deadLineConservatoire && submitted
                          ? "form-control error"
                          : "form-control"
                      }
                      {...field}
                      onChange={(e) => {
                        e.target.value === ""
                          ? resetField("deadLineConservatoire")
                          : field.onChange(e);
                      }}
                    />
                  )}
                />

                {errors.deadLineConservatoire && submitted && (
                  <div className="input-feedback">
                    {errors.deadLineConservatoire.message}
                  </div>
                )}
              </Col>
            </FormGroup>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default SafetyProposal;
