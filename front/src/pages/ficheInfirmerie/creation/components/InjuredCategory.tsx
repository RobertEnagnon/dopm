import {Col, FormGroup, Input, InputGroup, Label, Row} from "reactstrap";
import {
  Controller,
  Control,
  DeepRequired,
  FieldErrorsImpl,
  UseFormWatch,
} from "react-hook-form";
import type { FicheInfAdd } from "../../../../models/ficheinf";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useCategory } from "../../../../hooks/FicheInfirmerie/fiCategory";
import { InjuredCategory } from "../../../../models/injuredCategory";

const InjuredCategoryBloc = (props: {
  watch: UseFormWatch<FicheInfAdd>;
  control: Control<FicheInfAdd, any>;
  errors: FieldErrorsImpl<DeepRequired<FicheInfAdd>>;
  submitted: boolean;
  values: FicheInfAdd;
  setValue: Function;
}) => {
  const { control, errors, submitted, values, watch, setValue } = props;

  useEffect(() => {
    setValue("injuredCategoryId", values.injuredCategoryId);
    setValue("injuredCategoryName", values?.injuredCategoryName);
  }, [values]);

  const { categories } = useCategory<InjuredCategory>({
    endpoint: "fi_injcategories",
  });
  const { t } = useTranslation();

  return (
    <FormGroup>
      <label
        htmlFor="injuredCategoryId"
        className="label"
        style={{ display: "block" }}
      >
        <h3>{t("ficheInfirmerieCreation.catTitle")} </h3>
      </label>
      <Row className="ml-1">
          <Col>
              <FormGroup>
                  <InputGroup>
                      {categories.map((ficategory) => {
                          return (
                              <Controller
                                  name="injuredCategoryId"
                                  control={control}
                                  defaultValue={values.injuredCategoryId}
                                  key={ficategory.id}
                                  render={({ field }) => (
                                      <Col
                                          className="radio-container"
                                          xs={4}
                                          md={3}
                                          key={ficategory.id}
                                      >
                                          <Input
                                              type="radio"
                                              {...field}
                                              checked={watch("injuredCategoryId") == ficategory.id}
                                              value={ficategory.id}
                                              id={`ficat${ficategory.name}`}
                                          />
                                          <Label for={`ficat${ficategory.name}`} checked>
                                              {ficategory.name}
                                          </Label>
                                      </Col>
                                  )}
                              />
                          );
                      })}
                  </InputGroup>
              </FormGroup>
          </Col>
      </Row>
      <Col md={3} style={{ marginLeft: "0.2em" }}>
          <Row className="mt-2">
              {categories.find((cat) => cat.id == watch("injuredCategoryId"))
                ?.isInjuredCategoryName && (
                <Controller
                  name="injuredCategoryName"
                  control={control}
                  defaultValue={values.injuredCategoryName}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text"
                      autoComplete="off"
                      placeholder="Complément d'info..."
                      className={
                        props.errors.injuredCategoryName && props.submitted
                          ? "text-input error"
                          : "text-input"
                      }
                    />
                  )}
                />
              )}
          </Row>
      </Col>

      {errors.injuredCategoryId && submitted && (
        <div className="input-feedback">{errors.injuredCategoryId.message}</div>
      )}
    </FormGroup>
  );
};

export default InjuredCategoryBloc;
