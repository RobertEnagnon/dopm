import { Col, FormGroup, Input, Row } from "reactstrap";
import {
  Controller,
  Control,
  DeepRequired,
  FieldErrorsImpl,
  UseFormResetField,
} from "react-hook-form";
import type { FicheInfAdd } from "../../../../models/ficheinf";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Responsible } from "../../../../models/responsible";
import { useService } from "../../../../hooks/service";
import { useTeam } from "../../../../hooks/team";

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

const Sender = (props: {
  control: Control<FicheInfAdd, any>;
  responsibleConservatoires: Array<Responsible>;
  resetField: UseFormResetField<FicheInfAdd>;
  errors: FieldErrorsImpl<DeepRequired<FicheInfAdd>>;
  submitted: boolean;
  values: FicheInfAdd;
  edit?: boolean;
  setValue: Function;
}) => {
  const {
    control,
    errors,
    submitted,
    values,
    edit,
    setValue,
    responsibleConservatoires,
    resetField,
  } = props;

  const { services } = useService();
  const { teams } = useTeam();

  useEffect(() => {
    setValue("serviceId", values.serviceId);
    setValue("teamId", values.teamId);
  }, [values]);

  useEffect(() => {
    setValue("senderFirstname", values.senderFirstname);
    setValue("senderLastname", values.senderLastname);
    setValue("post", values.post);
    setValue("responsibleSecuriteId", values.responsibleSecuriteId);
    setValue("serviceId", values.serviceId);
    setValue("teamId", values.teamId);
  }, [values]);

  const { t } = useTranslation();

  return (
    <>
      <Row className="ml-1">
        <Col key="senderFirstname">
          <FormGroup>
            <label
              htmlFor="senderFirstname"
              className="label"
              style={{ display: "block" }}
            >
              {t("ficheInfirmerieCreation.senderFirstName")}
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

        <Col key="senderLastname">
          <FormGroup>
            <label
              htmlFor="senderLastname"
              className="label"
              style={{ display: "block" }}
            >
              {t("ficheInfirmerieCreation.senderName")}
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

        <Col key="post">
          <FormGroup>
            <label
              htmlFor="post"
              className="label"
              style={{ display: "block" }}
            >
              {t("ficheInfirmerieCreation.post")}
            </label>
            <Controller
              name="post"
              control={control}
              defaultValue={values.post || ""}
              render={({ field }) => (
                <Input
                  readOnly={edit}
                  autoComplete="off"
                  type="text"
                  id="post"
                  className={
                    errors.post && submitted ? "text-input error" : "text-input"
                  }
                  {...field}
                />
              )}
            />

            {errors.post && submitted && (
              <div className="input-feedback">{errors.post.message}</div>
            )}
          </FormGroup>
        </Col>
      </Row>
      <Row className="ml-1">
        <Col>
          <FormGroup>
            <label
              htmlFor="responsibleSecuriteId"
              className="label"
              style={{ display: "block" }}
            >
              {t("ficheInfirmerieCreation.SafetyAppliedResponsible")}
            </label>

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
                  onChange={(e) =>
                    e.target.value == "-1"
                      ? resetField("responsibleSecuriteId")
                      : field.onChange(e)
                  }
                >
                  <option value="-1">
                    {t("ficheInfirmerieCreation.senderSeclect")}{" "}
                    {t("ficheInfirmerieCreation.SafetyAppliedResponsible")}
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

            {errors.responsibleSecuriteId && submitted && (
              <div className="input-feedback">
                {errors.responsibleSecuriteId.message}
              </div>
            )}
          </FormGroup>
        </Col>

        <Col>
          <FormGroup>
            <label
              htmlFor="serviceId"
              className="label"
              style={{ display: "block" }}
            >
              {t("ficheInfirmerieCreation.senderService")}
            </label>

            <Controller
              name="serviceId"
              control={control}
              defaultValue={values.serviceId}
              render={({ field }) => (
                <select
                  id="serviceId"
                  className="form-select"
                  style={{ display: "block" }}
                  {...field}
                >
                  <option value="-1">
                    {t("ficheInfirmerieCreation.senderSeclect")}{" "}
                    {t("ficheInfirmerieCreation.senderService")}
                  </option>
                  {services &&
                    services.map((service) => {
                      return (
                        <option value={service.id} key={service.id}>
                          {service.name}
                        </option>
                      );
                    })}
                </select>
              )}
            />

            {errors.serviceId && submitted && (
              <div className="input-feedback">{errors.serviceId.message}</div>
            )}
          </FormGroup>
        </Col>

        <Col>
          <FormGroup>
            <label
              htmlFor="teamId"
              className="label"
              style={{ display: "block" }}
            >
              {t("ficheInfirmerieCreation.senderTeam")}
            </label>

            <Controller
              name="teamId"
              control={control}
              defaultValue={values.teamId}
              render={({ field }) => (
                <select
                  id="teamId"
                  className="form-select"
                  style={{ display: "block" }}
                  {...field}
                >
                  <option value="-1">
                    {t("ficheInfirmerieCreation.senderSeclect")}{" "}
                    {t("ficheInfirmerieCreation.senderTeam")}
                  </option>
                  {teams &&
                    teams.map((team) => {
                      return (
                        <option value={team.id} key={team.id}>
                          {team.name}
                        </option>
                      );
                    })}
                </select>
              )}
            />

            {errors.teamId && submitted && (
              <div className="input-feedback">{errors.teamId.message}</div>
            )}
          </FormGroup>
        </Col>
      </Row>
    </>
  );
};

export default Sender;
