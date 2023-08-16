import {
  Col,
  FormGroup,
  Input,
  InputGroup,
  Label,
  Row,
} from "reactstrap";
import {
  Controller,
  Control,
  DeepRequired,
  FieldErrorsImpl,
} from "react-hook-form";
import type { FicheInfAdd } from "../../../../models/ficheinf";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import CharactersCounter from "../../../ficheSecurite/creation/components/charactersCounter";
import { MaterialElements } from "../../../../models/materialElements";
import { useCategory } from "../../../../hooks/FicheInfirmerie/fiCategory";

const AccidentDetails = (props: {
  control: Control<FicheInfAdd, any>;
  errors: FieldErrorsImpl<DeepRequired<FicheInfAdd>>;
  submitted: boolean;
  values: FicheInfAdd;
  setValue: Function;
  watch: Function;
}) => {
  const { control, errors, submitted, values, setValue, watch } = props;

  useEffect(() => {
    setValue("circumstances", values.circumstances);
    setValue("materialElementsId", values.materialElementsId);
  }, [values]);

  const { t } = useTranslation();
  const { categories } = useCategory<MaterialElements>({
    endpoint: "fi_materialElements",
  });

  return (
    <>
      <h3 style={{ paddingTop: "8px" }}>
        {t("ficheInfirmerieCreation.circumstances")}{" "}
      </h3>
      <Row className="ml-1">
        <Col style={{ paddingLeft: "15px" }}>
          <FormGroup>
            <CharactersCounter
              actualValue={watch ? watch("circumstances") : ""}
              inputRender={(max: number) => {
                return (
                  <Controller
                    name="circumstances"
                    control={control}
                    defaultValue={values.circumstances}
                    render={({ field }) => (
                      <Input
                        autoComplete="off"
                        rows={4}
                        type="textarea"
                        maxLength={max}
                        id="circumstances"
                        className={
                          errors.circumstances && submitted
                            ? "text-input error"
                            : "text-input"
                        }
                        {...field}
                      />
                    )}
                  />
                );
              }}
            />

            {errors.circumstances && submitted && (
              <div className="input-feedback">{errors.circumstances.message}</div>
            )}
          </FormGroup>
        </Col>
      </Row>
      <h3 style={{ paddingTop: "8px" }}>
        {t("ficheInfirmerieCreation.materialElementsId")}{" "}
      </h3>
      <Row className="ml-1">
          <Col>
            <FormGroup>
              <InputGroup>
                {categories.map((material) => {
                  return (
                      <Controller
                        name="materialElementsId"
                        control={control}
                        defaultValue={values.materialElementsId}
                        key={material.id}
                        render={({ field }) => (
                          <Col
                            className="radio-container"
                            xs={4}
                            md={3}
                            key={material.id}
                          >
                            <Input
                              type="radio"
                              {...field}
                              checked={watch("materialElementsId") == material.id}
                              value={material.id}
                              id={`mat${material.name}`}
                            />
                            <Label for={`mat${material.name}`} checked>{material.name}</Label>
                          </Col>
                        )}
                      />
                  );
                })}
              </InputGroup>

              {errors.materialElementsId && submitted && (
                <div className="input-feedback">
                  {errors.materialElementsId.message}
                </div>
              )}
            </FormGroup>
        </Col>
      </Row>
    </>
  );
};

export default AccidentDetails;
