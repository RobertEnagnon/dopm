import {Col, FormFeedback, FormGroup, Input, InputGroup, Label, Row} from "reactstrap";
import {
  Controller,
  Control,
  DeepRequired,
  FieldErrorsImpl,
  UseFormResetField,
} from "react-hook-form";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Responsible } from "../../../../../models/responsible";
import { FicheAdd } from "../../../../../models/fiche";
import CharactersCounter from "../../../creation/components/charactersCounter";

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
      <Row>
        <Col>
          <FormGroup floating>
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
                        placeholder={t(
                          "ficheSecuriteCreation.SafetyProposalAction"
                        )}
                        style={{ minHeight: "150px" }}
                      />
                    )}
                  />
                );
              }}
            />
            <Label
              className="label"
              htmlFor="mesureConservatoire"
              style={{ display: "block" }}
            >
              {t("ficheSecuriteCreation.SafetyAppliedAction")}
            </Label>
            {errors.mesureConservatoire && submitted && (
                <FormFeedback tooltip>
                  {errors.mesureConservatoire.message}
                </FormFeedback>
            )}
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col>
          <FormGroup>
            <label
              htmlFor="responsibleConservatoireId"
              className="label"
              style={{ display: "block" }}
            >
              {t("ficheSecuriteCreation.SafetyAppliedResponsible")}
            </label>
            <InputGroup>
              {sortResponsible(responsibleConservatoires).map((responsible) => {
                return (
                  <Controller
                    name="responsibleConservatoireId"
                    control={control}
                    key={responsible.lastname}
                    render={({ field }) => {
                      return (
                        <Col xs={12} className="radio-container">
                          <Input
                            type="radio"
                            {...field}
                            checked={
                              watch &&
                              watch("responsibleConservatoireId") ==
                                responsible.id
                            }
                            value={responsible.id}
                            id={responsible.lastname}
                          />
                          <Label for={responsible.lastname} checked>
                            {responsible.lastname}
                          </Label>
                        </Col>
                      );
                    }}
                  />
                );
              })}
            </InputGroup>
            {errors.responsibleConservatoireId && submitted && (
                <FormFeedback tooltip>
                  {errors.responsibleConservatoireId.message}
                </FormFeedback>
            )}
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col>
          <FormGroup floating>
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
                      ? "text-input error"
                      : "text-input"
                  }
                  {...field}
                  onChange={(e) => {
                    e.target.value === ""
                      ? resetField("deadLineConservatoire")
                      : field.onChange(e);
                  }}
                  placeholder={t("ficheSecuriteCreation.SafetyProposalDate")}
                />
              )}
            />
            <Label
              htmlFor="deadLineConservatoire"
              className="label"
              style={{ display: "block" }}
            >
              {t("ficheSecuriteCreation.SafetyProposalDate")}
            </Label>
            {errors.deadLineConservatoire && submitted && (
                <FormFeedback tooltip>
                  {errors.deadLineConservatoire.message}
                </FormFeedback>
            )}
          </FormGroup>
        </Col>
      </Row>
    </>
  );
};

export default SafetyProposal;
