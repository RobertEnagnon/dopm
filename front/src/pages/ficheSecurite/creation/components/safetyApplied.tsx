import { Col, FormGroup, Input, Row } from "reactstrap";
import ModalComponent from "../../modal";
import AddResponsibleForm from "../../components/responsible/addResponsible";
import { Grid } from "@material-ui/core";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import {
  Controller,
  Control,
  DeepRequired,
  FieldErrorsImpl,
} from "react-hook-form";
import type { FicheAdd } from "../../../../models/fiche";
import { Responsible } from "../../../../models/responsible";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import CharactersCounter from "./charactersCounter";

const SafetyApplied = (props: {
  responsibleSecurites: Array<Responsible>;
  addResponsible: Function;
  control: Control<FicheAdd, any>;
  errors: FieldErrorsImpl<DeepRequired<FicheAdd>>;
  submitted: boolean;
  values: FicheAdd;
  setValue: Function;
  watch?: Function;
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const {
    responsibleSecurites,
    addResponsible,
    control,
    errors,
    submitted,
    values,
    setValue,
    watch,
  } = props;

  useEffect(() => {
    setValue("mesureSecurisation", values.mesureSecurisation);
    setValue("responsibleSecuriteId", values.responsibleSecuriteId);
  }, [values]);

  const { t } = useTranslation();

  const sortResponsible = (responsibles: Array<Responsible>) => {
    return responsibles.sort((a, b) => {
      if (a.lastname?.trim()?.toUpperCase() < b.lastname?.trim()?.toUpperCase()) {
        return -1;
      }
      if (a.lastname?.trim()?.toUpperCase() > b.lastname?.trim()?.toUpperCase()) {
        return 1;
      }
      if (a.firstname?.trim()?.toUpperCase() < b.firstname?.trim()?.toUpperCase()) {
        return -1;
      }
      if (a.firstname?.trim()?.toUpperCase() > b.firstname?.trim()?.toUpperCase()) {
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
      <h3 style={{ paddingTop: "8px" }}>
        {t("ficheSecuriteCreation.SafetyAppliedTitle")}
      </h3>
      <Row >
        <Col md={8}>
          <FormGroup>
            <label
              className="label"
              htmlFor="mesureSecurisation"
              style={{ display: "block" }}
            >
              {t("ficheSecuriteCreation.SafetyAppliedAction")}
            </label>
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
                          errors.mesureSecurisation && submitted
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

            {errors.mesureSecurisation && submitted && (
              <div className="input-feedback">
                {errors.mesureSecurisation.message}
              </div>
            )}
          </FormGroup>
        </Col>
        <Col md={4}>
          <Row>
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
              <Col>
                <label
                  htmlFor="responsibleSecuriteId"
                  className="label"
                  style={{ display: "block" }}
                >
                  {t("ficheSecuriteCreation.SafetyAppliedResponsible")}
                </label>
                <Grid container direction="row" alignItems="center">
                  <Grid item>
                    <Controller
                      name="responsibleSecuriteId"
                      control={control}
                      defaultValue={values.responsibleSecuriteId}
                      render={({ field }) => (
                        <select
                          id="responsibleSecuriteId"
                          className="form-select"
                          style={{ display: "block" }}
                          {...field}
                        >
                          <option value="-1">
                            {t("ficheSecuriteCreation.senderSeclect")}{" "}
                            {t(
                              "ficheSecuriteCreation.SafetyAppliedResponsible"
                            )}
                          </option>
                          {responsibleSecurites &&
                            sortResponsible(responsibleSecurites).map(
                              (responsibleSecurite) => {
                                return (
                                  <option
                                    value={responsibleSecurite.id}
                                    key={responsibleSecurite.id}
                                  >
                                    {responsibleSecurite.lastname.toUpperCase() +
                                      " " +
                                      responsibleSecurite.firstname}
                                  </option>
                                );
                              }
                            )}
                        </select>
                      )}
                    />
                  </Grid>
                  {/*<Grid item>*/}
                  {/*  <Button*/}
                  {/*    type="button"*/}
                  {/*    onClick={(e) => {*/}
                  {/*      e.stopPropagation();*/}
                  {/*      setIsModalOpen(true);*/}
                  {/*    }}*/}
                  {/*    color="primary"*/}
                  {/*    outline*/}
                  {/*  >*/}
                  {/*    <FontAwesomeIcon icon={faPlus} />*/}
                  {/*  </Button>*/}
                  {/*</Grid>*/}
                </Grid>

                {errors.responsibleSecuriteId && submitted && (
                  <div className="input-feedback">
                    {errors.responsibleSecuriteId.message}
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

export default SafetyApplied;
