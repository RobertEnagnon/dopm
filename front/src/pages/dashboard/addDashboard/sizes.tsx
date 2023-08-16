import { InputGroup, Button } from "reactstrap";
import {
  Control,
  Controller,
  FieldValues,
  UseFormSetValue,
} from "react-hook-form";
import styles from "../dashboard.module.scss";
import { useTranslation } from "react-i18next";

interface ISize {
  control: Control<FieldValues>;
  formValue: FieldValues;
  setValue: UseFormSetValue<FieldValues>;
}

const Sizes = ({ control, formValue, setValue }: ISize) => {
  const { t } = useTranslation();
  return (
    <Controller
      name="size"
      control={control}
      rules={{ required: "Selectionner une taille" }}
      shouldUnregister={false}
      render={({ fieldState: { isTouched, invalid, error } }) => {
        return (
          <>
            <p className={styles.dashboard_label}>
              {t("dashboard.sidebarsize")}
            </p>
            <InputGroup style={{ marginLeft: "12px" }}>
              {formValue.branche && formValue.type === "branche" && (
                <Button
                  className={styles.dashboard_button}
                  color="primary"
                  outline
                  onClick={() => setValue("size", "3")}
                  value="3"
                  active={formValue.size === "3"}
                >
                  1:4
                </Button>
              )}
              {((formValue.type === "tableau" && formValue.periode) ||
                (formValue.type === "indicateur" &&
                  formValue.format === "histogramme")) && (
                <Button
                  className={styles.dashboard_button}
                  color="primary"
                  outline
                  onClick={() => setValue("size", "4")}
                  value="4"
                  active={formValue.size === "4"}
                >
                  1:3
                </Button>
              )}
              {((formValue.type === "tableau" && formValue.periode) ||
                (formValue.type === "indicateur" &&
                  formValue.format === "histogramme")) && (
                <Button
                  className={styles.dashboard_button}
                  color="primary"
                  outline
                  onClick={() => setValue("size", "6")}
                  value="6"
                  active={formValue.size === "6"}
                >
                  1:2
                </Button>
              )}
              <Button
                className={styles.dashboard_button}
                color="primary"
                outline
                onClick={() => setValue("size", "12")}
                value="12"
                active={formValue.size === "12"}
              >
                1:1
              </Button>
            </InputGroup>
            {invalid && isTouched && (
              <div className={styles.inputFeedback}>{error?.message}</div>
            )}
          </>
        );
      }}
    />
  );
};

export default Sizes;
