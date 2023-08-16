import {
  Control,
  Controller,
  DeepRequired,
  FieldErrorsImpl,
  UseFormWatch,
} from "react-hook-form";
import { FicheAdd } from "../../../../../models/fiche";
import {Col, FormGroup, Input, InputGroup, Label, Row} from "reactstrap";
import { useService } from "../../../../../hooks/service";
import { useTranslation } from "react-i18next";

const Service = (props: {
  watch: UseFormWatch<FicheAdd>;
  control: Control<FicheAdd, any>;
  errors: FieldErrorsImpl<DeepRequired<FicheAdd>>;
  submitted: boolean;
  values: FicheAdd;
  setValue: Function;
  onChangeField: Function;
}) => {
  const { control, errors, values, watch, onChangeField } = props;
  const { services } = useService();
  const { t } = useTranslation();

  return (
    <Row>
      <Col>
        <FormGroup>
          <label
            htmlFor="serviceId"
            className="label"
            style={{ display: "block" }}
          >
            {t("ficheSecuriteCreation.senderService")}
          </label>

          <InputGroup>
            {services.map((service) => {
              return (
                <Controller
                  name="serviceId"
                  control={control}
                  defaultValue={values.serviceId}
                  key={service.name}
                  render={({ field }) => {
                    return (
                      <Col xs={12} key={service.id} className="radio-container">
                        <Input
                          type="radio"
                          {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              onChangeField();
                            }}
                          checked={watch("serviceId") == service.id}
                          value={service.id}
                          id={service.name}
                        />
                        <Label for={service.name} checked>
                          {service.name}
                        </Label>
                      </Col>
                    );
                  }}
                />
              );
            })}
          </InputGroup>
          {errors.serviceId && (
              <div className="input-feedback">{errors.serviceId.message}</div>
          )}
        </FormGroup>
      </Col>
    </Row>
  );
};

export default Service;
