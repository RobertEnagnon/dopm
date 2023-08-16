import {
  Control,
  Controller,
  DeepRequired,
  FieldErrorsImpl,
  UseFormWatch,
} from "react-hook-form";
import { FicheAdd } from "../../../../../models/fiche";
import {Col, FormGroup, Input, InputGroup, Label, Row} from "reactstrap";
import { useEffect } from "react";
import { useZone } from "../../../../../hooks/zone";
import { useTranslation } from "react-i18next";
import CharactersCounter from "../../../creation/components/charactersCounter";

const Description = (props: {
  watch: UseFormWatch<FicheAdd>;
  control: Control<FicheAdd, any>;
  errors: FieldErrorsImpl<DeepRequired<FicheAdd>>;
  submitted: boolean;
  values: FicheAdd;
  setValue: Function;
  onChangeField: Function;
}) => {
  const { zones, subzones, fetchSubzones } = useZone();
  const { control, errors, submitted, values, setValue, watch, onChangeField } = props;
  const { t } = useTranslation();

  useEffect(() => {
    if(!watch("zoneId") && !watch("subzoneId")) {
      if (values.zoneId != -1) fetchSubzones(values.zoneId || 0);

      setValue("zoneId", values.zoneId);
      setValue("subzoneId", values.subzoneId);
    }
  }, [values, watch]);

  useEffect(() => {
    if (watch("zoneId")) {
      fetchSubzones(watch("zoneId") || 0);
    }
  }, [watch("zoneId")]);

  return (
    <>
      {/*Zone*/}
      <Row>
        <Col>
          <FormGroup>
            <label
              htmlFor="zoneId"
              className="label"
              style={{ display: "block" }}
            >
              {t("ficheSecuriteCreation.location1")}
            </label>

            <InputGroup>
              {zones.map((zone) => {
                return (
                  <Controller
                    name="zoneId"
                    control={control}
                    defaultValue={values.zoneId}
                    key={zone.name}
                    render={({ field }) => {
                      return (
                        <Col xs={6} key={zone.id} className="radio-container">
                          <Input
                            type="radio"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              onChangeField()
                            }}
                            checked={watch("zoneId") == zone.id}
                            value={zone.id}
                            id={zone.name}
                          />
                          <Label for={zone.name} checked>
                            {zone.name}
                          </Label>
                        </Col>
                      );
                    }}
                  />
                );
              })}
            </InputGroup>
            {errors.zoneId && (
                <div className="input-feedback">{errors.zoneId.message}</div>
            )}
          </FormGroup>
        </Col>
      </Row>

      {/*Sous-Zone*/}
      {subzones.length > 0 && (
        <Row>
          <Col>
            <FormGroup>
              <label
                htmlFor="subzoneId"
                className="label"
                style={{ display: "block" }}
              >
                {t("ficheSecuriteCreation.location2")}
              </label>
              <InputGroup>
                {subzones.map((subzone) => {
                  return (
                    <Controller
                      name="subzoneId"
                      control={control}
                      defaultValue={values.subzoneId}
                      key={subzone.name}
                      render={({ field }) => {
                        return (
                          <Col
                            xs={6}
                            key={subzone.id}
                            className="radio-container"
                          >
                            <Input
                              type="radio"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                onChangeField()
                              }}
                              checked={watch("subzoneId") == subzone.id}
                              value={subzone.id}
                              id={subzone.name}
                            />
                            <Label for={subzone.name} checked>
                              {subzone.name}
                            </Label>
                          </Col>
                        );
                      }}
                    />
                  );
                })}
              </InputGroup>
              {errors.subzoneId && (
                  <div className="input-feedback">{errors.subzoneId.message}</div>
              )}
            </FormGroup>
          </Col>
        </Row>
      )}

      {/*Description*/}
      <Row>
        <Col>
          <FormGroup floating>
            <CharactersCounter
              actualValue={watch ? watch("description") || "" : ""}
              inputRender={(max: number) => {
                return (
                  <Controller
                    name="description"
                    control={control}
                    defaultValue={values.description}
                    render={({ field }) => (
                      <Input
                        style={{ minHeight: "150px" }}
                        autoComplete="off"
                        rows={4}
                        type="textarea"
                        maxLength={max}
                        id="description"
                        placeholder={t("ficheSecuriteCreation.descTite")}
                        className={
                          errors.description && submitted
                            ? "text-input error"
                            : "text-input"
                        }
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          onChangeField()
                        }}
                      />
                    )}
                  />
                );
              }}
            />
            <Label
              className="label"
              htmlFor="description"
            >
              {t("ficheSecuriteCreation.descTite")}
            </Label>
              {errors.description && (
                <div className="input-feedback">{errors.description.message}</div>
              )}
          </FormGroup>
        </Col>
      </Row>
    </>
  );
};

export default Description;
