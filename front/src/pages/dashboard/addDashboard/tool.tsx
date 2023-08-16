import { Control, Controller, FieldValues } from "react-hook-form";
import { Col, FormGroup } from "reactstrap";
import {
  UseFormResetField,
  UseFormSetValue,
  UseFormTrigger,
  UseFormWatch,
} from "react-hook-form/dist/types/form";
import { useTranslation } from "react-i18next";
import styles from "../dashboard.module.scss";
import { Grid } from "@material-ui/core";
import React from "react";

interface ITool {
  control: Control<FieldValues>;
  trigger: UseFormTrigger<FieldValues>;
  resetField: UseFormResetField<FieldValues>;
  watch: UseFormWatch<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
}

const Tool = ({ control, trigger, resetField }: ITool) => {
  const { t } = useTranslation();
  return (
    <Controller
      name="tool"
      rules={{ required: t("dashboard.sidebarselecttools") }}
      control={control}
      render={({
        fieldState: { isTouched, invalid, error },
        field: { name, onChange, onBlur },
      }) => {
        return (
          <Grid item>
            <FormGroup>
              <Col>
                <label
                  htmlFor="tool"
                  className="label"
                  style={{ display: "block" }}
                >
                  {t("dashboard.sidebartools")}{" "}
                </label>
                <select
                  className="form-select"
                  name={name}
                  onChange={(e) => {
                    onChange(e);
                    trigger("type");
                    resetField("type", { defaultValue: "" });
                  }}
                  onBlur={onBlur}
                  id="tool"
                  style={{ display: "block" }}
                >
                  <option value="" key="-1">
                    Select tool
                  </option>
                  {["Top5", "FicheSecurite"].map((v, i) => {
                    return (
                      <option value={v} key={i}>
                        {t("dashboard." + v)}
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

export default Tool;
