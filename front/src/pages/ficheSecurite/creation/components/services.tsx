import { Col, FormGroup, Row } from "reactstrap";
import {
  DeepRequired,
  FieldErrorsImpl,
  Control,
  Controller,
} from "react-hook-form";
import type { FicheAdd } from "../../../../models/fiche";
import { useService } from "../../../../hooks/service";
import { useTeam } from "../../../../hooks/team";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const Services = (props: {
  control: Control<FicheAdd, any>;
  errors: FieldErrorsImpl<DeepRequired<FicheAdd>>;
  submitted: boolean;
  values: FicheAdd;
  setValue: Function;
}) => {
  const { services } = useService();
  const { teams } = useTeam();

  const { control, errors, submitted, values, setValue } = props;

  useEffect(() => {
    setValue("serviceId", values.serviceId);
    setValue("teamId", values.teamId);
  }, [values]);

  const { t } = useTranslation();
  return (
    <Row className="ml-1">
      <Col md={4}>
        <FormGroup>
          <label
            htmlFor="serviceId"
            className="label"
            style={{ display: "block" }}
          >
            {t("ficheSecuriteCreation.senderService")}
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
                  {t("ficheSecuriteCreation.senderSeclect")}{" "}
                  {t("ficheSecuriteCreation.senderService")}
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

      <Col md={4}>
        <FormGroup>
          <label
            htmlFor="teamId"
            className="label"
            style={{ display: "block" }}
          >
            {t("ficheSecuriteCreation.senderTeam")}
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
                  {t("ficheSecuriteCreation.senderSeclect")}{" "}
                  {t("ficheSecuriteCreation.senderTeam")}
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
  );
};

export default Services;
