import { Grid } from "@material-ui/core";
import { Col, FormGroup } from "reactstrap";
import { Control, Controller, FieldValues } from "react-hook-form";
import React from "react";
import {
  UseFormResetField,
  UseFormTrigger,
} from "react-hook-form/dist/types/form";
import { Category } from "../../../models/Top5/category";
import { Indicator } from "../../../models/Top5/indicator";
import { GetIndicatorsByCategory } from "../../../services/Top5/indicator";
import styles from "../dashboard.module.scss";
import { useTranslation } from "react-i18next";

const Categories = (props: {
  categories: Array<Category>;
  setIndicators: React.Dispatch<React.SetStateAction<Array<Indicator>>>;
  control: Control<FieldValues>;
  trigger: UseFormTrigger<FieldValues>;
  resetField: UseFormResetField<FieldValues>;
}) => {
  const getIndicators = async (categoryId: number) => {
    const indicators = await GetIndicatorsByCategory(categoryId);
    props.setIndicators(indicators);
  };
  const { t } = useTranslation();
  return (
    <Controller
      name="category"
      control={props.control}
      rules={{ required: t("dashboard.sidebarselectcategory") }}
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
                  htmlFor="category"
                  className="label"
                  style={{ display: "block" }}
                >
                  {t("dashboard.sidebarcategory")}
                </label>
                <select
                  className="form-select"
                  id="category"
                  name={name}
                  value={value}
                  onChange={(e) => {
                    onChange(e);
                    props.resetField("indicator", { defaultValue: "" });
                    const categoryId = parseInt(e.target.value);
                    if (categoryId) getIndicators(categoryId);
                  }}
                  onBlur={onBlur}
                  style={{ display: "block", marginLeft: "0.75em" }}
                >
                  <option value="" key="-1">
                    Select Categorie
                  </option>
                  {props.categories?.map((category, index) => {
                    return (
                      <option value={category.id} key={index}>
                        {category.name}
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

export default Categories;
