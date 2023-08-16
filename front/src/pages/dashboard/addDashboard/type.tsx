import { Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTable,
  faCodeBranch,
  faChartColumn,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { Control, Controller, FieldValues } from "react-hook-form";
import React from "react";
import {
  UseFormResetField,
  UseFormTrigger,
  UseFormSetValue,
} from "react-hook-form/dist/types/form";
import { Branch } from "../../../models/Top5/branch";
import { useBranch } from "../../../hooks/Top5/branch";
import { useTranslation } from "react-i18next";
import styles from "../dashboard.module.scss";

interface IType {
  setBranches: React.Dispatch<React.SetStateAction<Array<Branch>>>;
  control: Control<FieldValues>;
  formValue: FieldValues;
  trigger: UseFormTrigger<FieldValues>;
  resetField: UseFormResetField<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
}

const Type = ({
  setBranches,
  control,
  trigger,
  resetField,
  setValue,
  formValue,
}: IType) => {
  const { FetchBranches } = useBranch();

  const getBranches = async () => {
    const fetchedBranches = await FetchBranches();
    setBranches(fetchedBranches);
  };

  const { t } = useTranslation();

  const types: string[] =
    formValue.tool == "Top5"
      ? ["branche", "indicateur"]
      : ["tableau", "indicateur"];

  const typesIcon: IconDefinition[] =
    formValue.tool == "Top5"
      ? [faCodeBranch, faChartColumn]
      : [faTable, faChartColumn];

  return (
    <>
      <p className={styles.dashboard_label}>{t("dashboard.sidebartype")}</p>
      <div className={styles.dashboard_buttonContainer}>
        {types.map((type: string, i: number) => {
          return (
            <Controller
              key={type}
              name="type"
              control={control}
              rules={{ required: t("dashboard.sidebarselectbranch") }}
              render={({ field }) => (
                <Button
                  className={styles.dashboard_button}
                  color="primary"
                  outline
                  onClick={() => {
                    getBranches();
                    setValue("type", type);
                    trigger("periode");
                    resetField("periode", { defaultValue: "" });
                  }}
                  active={formValue.type == type}
                  {...field}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                  <FontAwesomeIcon
                    title={type}
                    size="1x"
                    icon={typesIcon[i]}
                    style={{ marginLeft: "0.25em" }}
                  />
                </Button>
              )}
            />
          );
        })}
      </div>
    </>
  );
};

export default Type;
