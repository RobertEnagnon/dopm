import { Button, FormGroup, InputGroup } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartColumn,
  faChartPie,
  faCircleNotch,
} from "@fortawesome/free-solid-svg-icons";
import { Control, Controller, FieldValues } from "react-hook-form";
import {
  UseFormResetField,
  UseFormSetValue,
} from "react-hook-form/dist/types/form";
import styles from "../dashboard.module.scss";
import { useTranslation } from "react-i18next";

interface IFormat {
  control: Control<FieldValues>;
  formValue: FieldValues;
  resetField: UseFormResetField<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
}

const Formats = ({ control, formValue, resetField, setValue }: IFormat) => {
  const { t } = useTranslation();
  return (
    <Controller
      name="format"
      control={control}
      rules={{ required: "Selectionner un format" }}
      shouldUnregister={true}
      render={({
        fieldState: { isTouched, invalid, error },
        field: { onBlur, value },
      }) => {
        return (
          <FormGroup>
            <p className={styles.dashboard_label}>
              {t("dashboard.sidebarformats")}{" "}
            </p>
            <InputGroup style={{ marginLeft: "12px" }}>
              <Button
                className={styles.dashboard_button}
                color="primary"
                outline
                active={value === "histogramme"}
                onClick={() => {
                  setValue("format", "histogramme");
                  resetField("size");
                }}
                onBlur={onBlur}
              >
                Histogramme
                <FontAwesomeIcon
                  title="histogramme"
                  size="1x"
                  icon={faChartColumn}
                  style={{ marginLeft: "0.25em" }}
                />
              </Button>
              <Button
                className={styles.dashboard_button}
                color="primary"
                outline
                active={value === "vignette"}
                onClick={() => {
                  setValue("format", "vignette");
                  setValue("size", "3", {
                    shouldValidate: true,
                  });
                }}
                onBlur={onBlur}
              >
                {t("dashboard.sidebarvignette")}
              </Button>
              {formValue.periode === "mensuel" && (
                <>
                  <Button
                    className={styles.dashboard_button}
                    color="primary"
                    outline
                    onClick={() => {
                      setValue("format", "circulaire");
                      setValue("size", "4", {
                        shouldValidate: true,
                      });
                    }}
                    onBlur={onBlur}
                  >
                    Circulaire
                    <FontAwesomeIcon
                      title="Circulaire"
                      size="1x"
                      icon={faChartPie}
                      style={{ marginLeft: "0.25em" }}
                    />
                  </Button>
                  <Button
                    className={styles.dashboard_button}
                    color="primary"
                    outline
                    active={value === "cercle"}
                    onClick={() => {
                      setValue("format", "cercle");
                      setValue("size", "4", {
                        shouldValidate: true,
                      });
                    }}
                    onBlur={onBlur}
                  >
                    Cercle
                    <FontAwesomeIcon
                      icon={faCircleNotch}
                      title="Cercle"
                      size="1x"
                      style={{ marginLeft: "0.25em" }}
                    />
                  </Button>
                </>
              )}
            </InputGroup>
            {invalid && isTouched && (
              <div className={styles.inputFeedback}>{error?.message}</div>
            )}
          </FormGroup>
        );
      }}
    />
  );
};

export default Formats;
