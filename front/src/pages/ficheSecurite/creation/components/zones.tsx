import { Col, FormGroup, Row } from "reactstrap";
import { useEffect } from "react";
import {
  DeepRequired,
  FieldErrorsImpl,
  Controller,
  UseFormWatch,
  Control,
} from "react-hook-form";
import type { FicheAdd } from "../../../../models/fiche";
import { useZone } from "../../../../hooks/zone";
import { useTranslation } from "react-i18next";

const Zones = (props: {
  watch: UseFormWatch<FicheAdd>;
  control: Control<FicheAdd, any>;
  errors: FieldErrorsImpl<DeepRequired<FicheAdd>>;
  submitted: boolean;
  setValue: Function;
  values: FicheAdd;
}) => {
  const { zones, subzones, fetchSubzones } = useZone();

  const { control, errors, submitted, values, setValue, watch } = props;

  useEffect(() => {
    if (values.zoneId != -1) fetchSubzones(values.zoneId || 0);

    setValue("zoneId", values.zoneId);
    setValue("subzoneId", values.subzoneId);
  }, [values]);

  useEffect(() => {
    if (watch("zoneId")) {
      fetchSubzones(watch("zoneId") || 0);
    }
  }, [watch("zoneId")]);

  const { t } = useTranslation();
  return (
    <>
      <h3 style={{ paddingTop: "8px" }}>
        {t("ficheSecuriteCreation.locationTitle")}{" "}
      </h3>

      <Row className="ml-1">
        <Col md={4}>
          <FormGroup>
            <label
              htmlFor="zoneId"
              className="label"
              style={{ display: "block" }}
            >
              {t("ficheSecuriteCreation.location1")}
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
                    {t("ficheSecuriteCreation.senderSeclect")}{" "}
                    {t("ficheSecuriteCreation.location1")}
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

        <Col md={4}>
          <FormGroup>
            <label
              htmlFor="subzoneId"
              className="label"
              style={{ display: "block" }}
            >
              {t("ficheSecuriteCreation.location2")}
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
                    {t("ficheSecuriteCreation.senderSeclect")}{" "}
                    {t("ficheSecuriteCreation.location2")}
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
              <div className="input-feedback">{errors.subzoneId?.message}</div>
            )}
          </FormGroup>
        </Col>
      </Row>
    </>
  );
};

export default Zones;
