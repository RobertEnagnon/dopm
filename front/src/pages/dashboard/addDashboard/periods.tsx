import { InputGroup, Button } from "reactstrap";
import { Control, Controller, FieldValues } from "react-hook-form";
import {
  UseFormResetField,
  UseFormTrigger,
  UseFormSetValue,
} from "react-hook-form/dist/types/form";
import styles from "../dashboard.module.scss";
import { useTranslation } from "react-i18next";

interface IPeriods {
  control: Control<FieldValues>;
  formValue: FieldValues;
  trigger: UseFormTrigger<FieldValues>;
  resetField: UseFormResetField<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
}

const Periods = ({
  control,
  formValue,
  trigger,
  resetField,
  setValue,
}: IPeriods) => {
  const { t } = useTranslation();
  return (
    <Controller
      name="periode"
      control={control}
      rules={{ required: "Selectionner une periode" }}
      shouldUnregister={true}
      render={({
        fieldState: { isTouched, invalid, error },
        field: { onBlur },
      }) => {
        return (
          <>
            <p className={styles.dashboard_label}>
              {t("dashboard.sidebarperiod")}
            </p>
            <InputGroup className={styles.dashboard_buttonContainer}>
              {formValue.type === "tableau" && (
                <Button
                  className={styles.dashboard_button}
                  color="primary"
                  outline
                  onClick={() => {
                    setValue("periode", "journalier");
                    trigger("format");
                    resetField("format", { defaultValue: "" });
                    resetField("size", { defaultValue: "" });
                  }}
                  onBlur={onBlur}
                  active={formValue.periode === "journalier"}
                >
                  {t("dashboard.sidebarperiodjournalier")}
                </Button>
              )}

              <Button
                className={styles.dashboard_button}
                color="primary"
                outline
                onClick={() => {
                  setValue("periode", "mensuel");
                  trigger("format");
                  resetField("format", { defaultValue: "" });
                  resetField("size", { defaultValue: "" });
                }}
                onBlur={onBlur}
                value="mensuel"
                active={formValue.periode === "mensuel"}
              >
                {t("dashboard.sidebarperiodmensuel")}
              </Button>

              {(formValue.type === "tableau" ||
                (formValue.tool === "FicheSecurite" &&
                  formValue.type === "indicateur")) && (
                <Button
                  className={styles.dashboard_button}
                  color="primary"
                  outline
                  onClick={() => {
                    setValue("periode", "annuel");
                    trigger("format");
                    resetField("format", { defaultValue: "" });
                    resetField("size", { defaultValue: "" });
                  }}
                  onBlur={onBlur}
                  active={formValue.periode === "annuel"}
                >
                  {t("dashboard.sidebarperiodannuel")}
                </Button>
              )}

              {formValue.branche &&
                formValue.category &&
                formValue.indicator &&
                formValue.type === "indicateur" && (
                  <Button
                    className={styles.dashboard_button}
                    color="primary"
                    outline
                    onClick={() => {
                      setValue("periode", "historique");
                      trigger("format");
                      resetField("format", {
                        defaultValue: "",
                      });
                    }}
                    onBlur={onBlur}
                    value="historique"
                    active={formValue.periode === "historique"}
                  >
                    {t("dashboard.sidebarperiodhistorique")}
                  </Button>
                )}
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

export default Periods;
