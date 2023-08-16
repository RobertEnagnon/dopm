import { Responsible } from "../../../../../models/responsible";
import {
  Control,
  Controller,
  DeepRequired,
  FieldErrorsImpl,
} from "react-hook-form";
import { FicheAdd } from "../../../../../models/fiche";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {Col, FormGroup, Input, InputGroup, Label, Row} from "reactstrap";
import CharactersCounter from "../../../creation/components/charactersCounter";
import ModalComponent from "../../../modal";
import AddResponsibleForm from "../../../components/responsible/addResponsible";

const SafetyApplied = (props: {
  responsibleSecurites: Array<Responsible>;
  addResponsible: Function;
  control: Control<FicheAdd, any>;
  errors: FieldErrorsImpl<DeepRequired<FicheAdd>>;
  submitted: boolean;
  values: FicheAdd;
  setValue: Function;
  watch?: Function;
  onChangeField: Function;
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const {
    responsibleSecurites,
    addResponsible,
    control,
    errors,
    values,
    watch,
    onChangeField
  } = props;

  const { t } = useTranslation();

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

  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Row>
        <Col>
          <FormGroup floating>
            <CharactersCounter
              maxCharacter={200}
              actualValue={watch ? watch("mesureSecurisation") : ""}
              inputRender={(max: number) => {
                return (
                  <Controller
                    name="mesureSecurisation"
                    control={control}
                    defaultValue={values.mesureSecurisation}
                    render={({ field }) => (
                      <Input
                        autoComplete="off"
                        rows={4}
                        type="textarea"
                        maxLength={max}
                        id="mesureSecurisation"
                        className={
                          errors.mesureSecurisation
                            ? "text-input error"
                            : "text-input"
                        }
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          onChangeField();
                        }}
                        placeholder={t(
                          "ficheSecuriteCreation.SafetyAppliedAction"
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
              htmlFor="mesureSecurisation"
              style={{ display: "block" }}
            >
              {t("ficheSecuriteCreation.SafetyAppliedAction")}
            </Label>
            {errors.mesureSecurisation && (
                <div className="input-feedback">{errors.mesureSecurisation.message}</div>
            )}
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col>
          <ModalComponent
            children={
              <AddResponsibleForm
                addResponsible={addResponsible}
                closeModalAdd={handleModalClose}
              />
            }
            open={isModalOpen}
            hide={() => setIsModalOpen(false)}
          />
          <FormGroup>
            <label
              htmlFor="responsibleSecuriteId"
              className="label"
              style={{ display: "block" }}
            >
              {t("ficheSecuriteCreation.SafetyAppliedResponsible")}
            </label>
            <InputGroup>
              {sortResponsible(responsibleSecurites).map((responsible) => {
                return (
                  <Controller
                    name="responsibleSecuriteId"
                    control={control}
                    key={responsible.lastname}
                    render={({ field }) => {
                      return (
                        <Col xs={12} className="radio-container">
                          <Input
                            type="radio"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              onChangeField();
                            }}
                            checked={
                              watch &&
                              watch("responsibleSecuriteId") == responsible.id
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
            {errors.responsibleSecuriteId && (
                <div className="input-feedback">{errors.responsibleSecuriteId.message}</div>
            )}
          </FormGroup>
        </Col>
      </Row>
    </>
  );
};

export default SafetyApplied;
