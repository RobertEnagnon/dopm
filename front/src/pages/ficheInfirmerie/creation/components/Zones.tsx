import { Col, FormGroup, Input, Row } from "reactstrap";
import { useEffect } from "react";
import {
  DeepRequired,
  FieldErrorsImpl,
  Controller,
  UseFormWatch,
  Control,
  UseFormResetField,
} from "react-hook-form";
import type { FicheInfAdd } from "../../../../models/ficheinf";
import { useZone } from "../../../../hooks/zone";
import { useTranslation } from "react-i18next";

const Zones = (props: {
  watch: UseFormWatch<FicheInfAdd>;
  resetField: UseFormResetField<FicheInfAdd>;
  control: Control<FicheInfAdd, any>;
  errors: FieldErrorsImpl<DeepRequired<FicheInfAdd>>;
  submitted: boolean;
  setValue: Function;
  values: FicheInfAdd;
}) => {
  const { zones, subzones, fetchSubzones } = useZone();

  const { control, errors, submitted, values, setValue, watch, resetField } =
    props;

  useEffect(() => {
    if (values.zoneId != -1) fetchSubzones(values.zoneId || 0);

    setValue("zoneId", values.zoneId);
    setValue("subzoneId", values.subzoneId);
    setValue("dateAccident", values.dateAccident);
    setValue("hourAccident", values.hourAccident);
  }, [values]);

  useEffect(() => {
    if (watch("zoneId")) {
      fetchSubzones(watch("zoneId") || 0);
    }
  }, [watch("zoneId")]);
  console.log("value", values);
  const { t } = useTranslation();
  return (
    <>
      <h3 style={{ paddingTop: "8px" }}>
        {t("ficheInfirmerieCreation.accidentTitle")}{" "}
      </h3>

      <Row className="ml-1">
        <Col md={3}>
          <FormGroup>
            <label
              htmlFor="dateAccident"
              className="label"
              style={{ display: "block" }}
            >
              {t("ficheInfirmerieCreation.dateAccident")}
            </label>

            <Controller
              name="dateAccident"
              control={control}
              defaultValue={values.dateAccident}
              render={({ field }) => (
                <Input
                  autoComplete="off"
                  type="date"
                  id="dateAccident"
                  className={
                    errors.dateAccident && submitted
                      ? "text-input error"
                      : "text-input"
                  }
                  {...field}
                  onChange={(e) => {
                    return e.target.value === ""
                      ? resetField("dateAccident")
                      : field.onChange(e);
                  }}
                />
              )}
            />

            {errors.dateAccident && submitted && (
              <div className="input-feedback">
                {errors.dateAccident.message}
              </div>
            )}
          </FormGroup>
        </Col>
        <Col md={2}>
          <FormGroup>
            <label
              htmlFor="hourAccident"
              className="label"
              style={{ display: "block" }}
            >
              {t("ficheInfirmerieCreation.hourAccident")}
            </label>
            <Controller
              name="hourAccident"
              control={control}
              defaultValue={values.hourAccident}
              render={({ field }) => (
                <Input
                  autoComplete="off"
                  type="time"
                  id="hourAccident"
                  defaultValue={values.hourAccident}
                  className={
                    errors.hourAccident && submitted
                      ? "text-input error"
                      : "text-input"
                  }
                  {...field}
                  onChange={(e) => {
                    return e.target.value === ""
                      ? resetField("hourAccident")
                      : field.onChange(e);
                  }}
                />
              )}
            />
          </FormGroup>
        </Col>
      </Row>
      <Row className="ml-1">
        <Col>
          <FormGroup>
              <label
                htmlFor="zoneId"
                className="label"
                style={{ display: "block" }}
              >
                {t("ficheInfirmerieCreation.location1")}
              </label>
              <Controller
                name="zoneId"
                control={control}
                defaultValue={values.zoneId}
                render={({ field }) => (
                  <select
                    id="zoneId"
                    className="form-select"
                    {...field}
                    style={{ display: "block" }}
                  >
                    <option value="-1">
                      {t("ficheInfirmerieCreation.senderSeclect")}{" "}
                      {t("ficheInfirmerieCreation.location1")}
                    </option>
                    {zones &&
                      zones.map((zone) => {
                        return (
                          <option value={zone.id} key={zone.id}>
                            {zone.name}
                          </option>
                        );
                      })}
                  </select>
                )}
              />

              {errors.zoneId && submitted && (
                <div className="input-feedback">{errors.zoneId.message}</div>
              )}
          </FormGroup>
        </Col>
        <Col>
          <FormGroup>
              <label
                htmlFor="subzoneId"
                className="label"
                style={{ display: "block" }}
              >
                {t("ficheInfirmerieCreation.location2")}
              </label>
              <Controller
                name="subzoneId"
                control={control}
                defaultValue={values.subzoneId}
                render={({ field }) => (
                  <select
                    id="subzoneId"
                    className="form-select"
                    style={{ display: "block" }}
                    {...field}
                  >
                    <option value="-1">
                      {t("ficheInfirmerieCreation.senderSeclect")}{" "}
                      {t("ficheInfirmerieCreation.location2")}
                    </option>
                    {subzones &&
                      subzones.map((zone) => (
                        <option key={zone.id} value={zone.id}>
                          {zone.name}
                        </option>
                      ))}
                  </select>
                )}
              />

              {errors.subzoneId && submitted && (
                <div className="input-feedback">
                  {errors.subzoneId?.message}
                </div>
              )}
          </FormGroup>
        </Col>
      </Row>
    </>
  );
};

export default Zones;
