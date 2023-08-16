import { Grid } from "@material-ui/core";
import { Col, FormGroup } from "reactstrap";
import { Control, Controller, FieldValues } from "react-hook-form";
import { Indicator } from "../../../models/Top5/indicator";
import styles from "../dashboard.module.scss";
import { useTranslation } from "react-i18next";

const Indicators = (props: {
  indicators: Array<Indicator>;
  control: Control<FieldValues>;
}) => {
  const { t } = useTranslation();
  return (
    <Controller
      name="indicator"
      control={props.control}
      rules={{ required: t("dashboard.sidebarselectindicator") }}
      shouldUnregister={true}
      render={({
        fieldState: { isTouched, invalid, error },
        field: { name, onChange, onBlur, value },
      }) => {
        return (
          <Grid item>
            <FormGroup>
              <Col>
                <label
                  htmlFor="indicator"
                  className="label"
                  style={{ display: "block" }}
                >
                  {t("dashboard.sidebarindicator")}
                </label>
                <select
                  className="form-select"
                  name={name}
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  style={{ display: "block", marginLeft: "0.75em" }}
                >
                  <option value="">Select Indicator</option>
                  {props.indicators?.map((indicator, index) => {
                    return (
                      <option value={indicator.id} key={index}>
                        {indicator.name}
                      </option>
                    );
                  })}
                </select>

                {invalid && isTouched && (
                  <div className={styles.inputFeedback}>{error?.message}</div>
                )}
              </Col>
            </FormGroup>
          </Grid>
        );
      }}
    />
  );
};

export default Indicators;
