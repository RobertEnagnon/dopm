import { Col, FormGroup, Input, InputGroup, Label, Row } from "reactstrap";
import { Controller, Control, DeepRequired, FieldErrorsImpl } from "react-hook-form";
import type { FicheInfAdd } from "../../../../models/ficheinf";
import { useTranslation } from "react-i18next";
import { LesionDetails } from "../../../../models/lesionDetails";
import { useCategory } from "../../../../hooks/FicheInfirmerie/fiCategory";
import { useEffect } from "react";

const LesionDetailsBloc = (props: { control: Control<FicheInfAdd, any>, errors: FieldErrorsImpl<DeepRequired<FicheInfAdd>>, submitted: boolean, values: FicheInfAdd, setValue: Function, watch: Function }) => {

  const {
    control,
    errors,
    submitted,
    values,
    setValue,
    watch
  } = props;

  const { t } = useTranslation();
  const { categories } = useCategory<LesionDetails>({endpoint: 'fi_lesionDetails'})

  useEffect(() => {
    setValue("lesionDetailsId", values.lesionDetailsId)
  }, [values])

  return (
      <>
        <label
            className="label"
            htmlFor="lesionDetailsId"
            style={{ display: "block" }}
        >
          <h3 style={{ paddingTop: "8px" }}>{t("ficheInfirmerieCreation.lesionDetailsId")} </h3>
        </label>
        <Row className="ml-1">
          <Col>
            <FormGroup>
              <InputGroup>
                {categories.map((material) => {
                  return (
                      <Controller
                          name="lesionDetailsId"
                          control={control}
                          defaultValue={values.lesionDetailsId}
                          render={({ field }) => <Col className="radio-container" xs="auto" md={4} key={material.id}>
                            <Input
                                type="radio"
                                {...field}
                                checked={watch("lesionDetailsId") == material.id}
                                value={material.id}
                                id={`les${material.name}`}
                            />
                            <Label for={`les${material.name}`} checked>
                              {material.name}
                            </Label>
                          </Col>}
                      />
                  )
                })}
              </InputGroup>

              {errors.lesionDetailsId && submitted && (
                  <div className="input-feedback">
                    {errors.lesionDetailsId.message}
                  </div>
              )}
            </FormGroup>
          </Col>
        </Row>
      </>
  );
}

export default LesionDetailsBloc;
