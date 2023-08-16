import { FormGroup } from "reactstrap";
import { Control, Controller, FieldValues } from "react-hook-form";
import React from "react";
import {
  UseFormResetField,
  UseFormTrigger,
} from "react-hook-form/dist/types/form";
import { Branch } from "../../../models/Top5/branch";
import { Category } from "../../../models/Top5/category";
import { GetCategoriesByBranch } from "../../../services/Top5/category";
import styles from "../dashboard.module.scss";
import { useTranslation } from "react-i18next";

interface IBranches {
  branches: Array<Branch>;
  setCategories: React.Dispatch<React.SetStateAction<Array<Category>>>;
  control: Control<FieldValues>;
  formValue: FieldValues;
  trigger: UseFormTrigger<FieldValues>;
  resetField: UseFormResetField<FieldValues>;
}

const Branches = ({
  branches,
  setCategories,
  control,
  formValue,
  trigger,
  resetField,
}: IBranches) => {
  const getCategories = async (brancheId: number) => {
    const categories = await GetCategoriesByBranch(brancheId);
    setCategories(categories);
  };
  const { t } = useTranslation();
  return (
    <Controller
      name="branche"
      control={control}
      rules={{ required: t("dashboard.sidebarselectbranch") }}
      shouldUnregister={true}
      render={({
        fieldState: { isTouched, invalid, error },
        field: { name, onChange, onBlur, value },
      }) => {
        return (
          <FormGroup>
            <p className={styles.dashboard_label}> Branche :</p>
            <select
              className="form-select"
              id="branche"
              name={name}
              value={value}
              onChange={(e) => {
                if (formValue.type === "indicateur") {
                  const categoryId = parseInt(e.target.value);
                  if (categoryId) {
                    getCategories(categoryId);
                  }
                }
                onChange(e);
                trigger("category");
                resetField("category", { defaultValue: "" });
                trigger("size");
                resetField("size", { defaultValue: "" });
              }}
              onBlur={onBlur}
              style={{ display: "block", marginLeft: "1.5em" }}
            >
              <option value="">Select branche</option>
              {branches?.map((branch, index) => {
                return (
                  <option value={branch.id} key={index}>
                    {branch.name}
                  </option>
                );
              })}
            </select>
            {invalid && isTouched && (
              <div className={styles.inputFeedback}>{error?.message}</div>
            )}
          </FormGroup>
        );
      }}
    />
  );
};

export default Branches;
