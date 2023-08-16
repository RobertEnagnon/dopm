import { Control, Controller, FieldError } from "react-hook-form";
import { Row, Col, FormGroup, Alert } from "reactstrap";

import { useUser } from "../../../../hooks/user";
import { useService } from "../../../../hooks/service";
import { useTeam } from "../../../../hooks/team";
import { SuggestionFormValues } from "./SuggestionForm";

interface SugServicesRowProps {
  control: Control<SuggestionFormValues, any>;
  errors: {
    id?: FieldError | undefined;
    sugCategoryId?: FieldError | undefined;
    sugClassificationId?: FieldError | undefined;
    senderFirstname?: FieldError | undefined;
    senderLastname?: FieldError | undefined;
    description?: FieldError | undefined;
    serviceId?: FieldError | undefined;
    teamId?: FieldError | undefined;
    responsibleId?: FieldError | undefined;
  };
}

export const SugServicesRow = ({ control, errors }: SugServicesRowProps) => {
  const { services } = useService();
  const { teams } = useTeam();
  const { usersResponsible } = useUser();

  return (
    <>
      <Row className="ml-1">
        <Col className="pl-0">
          <FormGroup>
            <label
              htmlFor="serviceId"
              className="label"
              style={{ display: "block" }}
            >
              Service
            </label>
            <Controller
              name="serviceId"
              control={control}
              render={({ field }) => {
                return (
                  <select
                    id="serviceId"
                    className="form-select"
                    style={{ display: "block" }}
                    {...field}
                  >
                    <option value={0}>Select service</option>
                    {services &&
                      services.map((service) => {
                        return (
                          <option value={service.id} key={service.id}>
                            {service.name}
                          </option>
                        );
                      })}
                  </select>
                );
              }}
            />
            {errors.serviceId && (
              <Alert color="danger" style={{ padding: "0.5rem" }}>
                {errors.serviceId.message}
              </Alert>
            )}
          </FormGroup>
        </Col>
        <Col className="pl-0">
          <FormGroup>
            <label
              htmlFor="teamId"
              className="label"
              style={{ display: "block" }}
            >
              Equipe
            </label>
            <Controller
              name={"teamId"}
              control={control}
              render={({ field }) => {
                return (
                  <select
                    id="teamId"
                    className="form-select"
                    style={{ display: "block" }}
                    {...field}
                  >
                    <option value={0}>Select team</option>
                    {teams &&
                      teams.map((team) => {
                        return (
                          <option value={team.id} key={team.id}>
                            {team.name}
                          </option>
                        );
                      })}
                  </select>
                );
              }}
            />
            {errors.teamId && (
              <Alert color="danger" style={{ padding: "0.5rem" }}>
                {errors.teamId.message}
              </Alert>
            )}
          </FormGroup>
        </Col>
        <Col className="pl-0">
          <FormGroup>
            <label
              htmlFor="responsibleId"
              className="label"
              style={{ display: "block" }}
            >
              Responsable
            </label>
            <Controller
              name={"responsibleId"}
              control={control}
              render={({ field }) => {
                return (
                  <select
                    id="responsibleId"
                    className="form-select"
                    style={{ display: "block" }}
                    {...field}
                  >
                    <option value={0}>Select responsable</option>
                    {usersResponsible &&
                      usersResponsible.map((responsible) => {
                        return (
                          <option value={responsible.id} key={responsible.id}>
                            {`${responsible.firstname} ${responsible.lastname}`}
                          </option>
                        );
                      })}
                  </select>
                );
              }}
            />
            {errors.responsibleId && (
              <Alert color="danger" style={{ padding: "0.5rem" }}>
                {errors.responsibleId.message}
              </Alert>
            )}
          </FormGroup>
        </Col>
      </Row>
    </>
  );
};
