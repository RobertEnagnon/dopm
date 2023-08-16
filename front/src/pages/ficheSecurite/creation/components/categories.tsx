import { Col, FormGroup, Input, InputGroup, Label } from "reactstrap";
import { useFSCategory } from "../../../../hooks/FicheSecurite/fsCategory";
import { Controller, Control, DeepRequired, FieldErrorsImpl, UseFormWatch } from "react-hook-form";
import type { FicheAdd } from "../../../../models/fiche";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const Categories = (props: { watch: UseFormWatch<FicheAdd>, control: Control<FicheAdd, any>, errors: FieldErrorsImpl<DeepRequired<FicheAdd>>, submitted: boolean, values: FicheAdd, setValue: Function }) => {

  const {
    control,
    errors,
    submitted,
    values,
    watch,
    setValue
  } = props;

  useEffect(() => {
    setValue("fsCategoryId", values.fsCategoryId);
  }, [values])

  const { fscategories } = useFSCategory();
  const { t } = useTranslation();

  return (
    < FormGroup >
      <label
        htmlFor="fsCategoryId"
        className="label"
        style={{ display: "block" }}
      >
        <h3>{t("ficheSecuriteCreation.catTitle")} </h3>
      </label>
      <InputGroup style={{ marginLeft: "12px" }}>
        {fscategories.map((fscategory) => {
          return (
            <Controller
              name="fsCategoryId"
              control={control}
              defaultValue={values.fsCategoryId}
              key={fscategory.id}
              render={({ field }) => <Col xs={4} md={3} key={fscategory.id}>
                <Label checked>
                  <Input
                    type="radio"
                    {...field}
                    checked={watch("fsCategoryId") == fscategory.id}
                    value={fscategory.id}
                  />
                  {" "}
                  {fscategory.name}
                </Label>
              </Col>} />
          );
        })}
      </InputGroup>

      {
        errors.fsCategoryId && submitted && (
          <div className="input-feedback">{errors.fsCategoryId.message}</div>
        )
      }
    </FormGroup >
  );
}

export default Categories;