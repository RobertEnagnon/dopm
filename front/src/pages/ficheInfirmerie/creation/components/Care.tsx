import {Col, FormGroup, Input, InputGroup, Label, Row} from "reactstrap";
import { Controller, Control, DeepRequired, FieldErrorsImpl, UseFormWatch } from "react-hook-form";
import type { FicheInfAdd } from "../../../../models/ficheinf";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CareProvided } from "../../../../models/careProvided";
import { useCategory } from "../../../../hooks/FicheInfirmerie/fiCategory";

const Care = (props: { watch: UseFormWatch<FicheInfAdd>, control: Control<FicheInfAdd, any>, errors: FieldErrorsImpl<DeepRequired<FicheInfAdd>>, submitted: boolean, values: FicheInfAdd, setValue: Function }) => {

  const {
    control,
    errors,
    submitted,
    values,
    watch,
    setValue
  } = props;

  useEffect(() => {
    setValue("careProvidedId", values.careProvidedId)
    setValue("caregiver", values.caregiver)
    setValue("careGived", values.careGived)
  }, [values])

  const { categories } = useCategory<CareProvided>({endpoint: 'fi_careProvided'})
  const { t } = useTranslation();

  return <>
        <label
            htmlFor="careProvidedId"
            className="label"
            style={{ display: "block" }}
        >
            <h3>{t("ficheInfirmerieCreation.careTitle")} </h3>
        </label>
        <Row className="ml-1">
            <Col>
                <FormGroup>
                    <InputGroup>
                        {categories.map((ficategory) => {
                            return (
                                <Controller
                                    name="careProvidedId"
                                    control={control}
                                    defaultValue={values.careProvidedId}
                                    key={ficategory.id}
                                    render={({ field }) => <Col className="radio-container" xs="auto" md={4} key={ficategory.id}>
                                        <Input
                                            type="radio"
                                            {...field}
                                            checked={watch("careProvidedId") == ficategory.id}
                                            value={ficategory.id}
                                            id={`care${ficategory.id}`}
                                        />
                                        <Label for={`care${ficategory.id}`} checked>
                                            {ficategory.name}
                                        </Label>
                                    </Col>}
                                />
                            )
                        })}
                    </InputGroup>

                    {
                        errors.careProvidedId && submitted && (
                            <div className="input-feedback">{errors.careProvidedId.message}</div>
                        )
                    }
                </FormGroup>
            </Col>
        </Row>


        <Row className="ml-1">
            <Col>
                <label
                    htmlFor="caregiver"
                    className="label"
                    style={{ display: "block" }}
                >
                    {t("ficheInfirmerieCreation.caregiver")}
                </label>

                <Controller
                    name="caregiver"
                    control={control}
                    defaultValue={values.caregiver || ""}
                    render={({ field }) => <Input
                    autoComplete="off"
                    type="text"
                    id="caregiver"
                    className={
                        props.errors.caregiver && props.submitted
                        ? "text-input error"
                        : "text-input"
                    }
                    {...field}
                    />}
                />

                {errors.caregiver && submitted && (
                    <div className="input-feedback">
                    {errors.caregiver.message}
                    </div>
                )}
            </Col>
        </Row>

        <label
          className="label"
          htmlFor="careGived"
          style={{ display: "block" }}
        >
          <h3 style={{ paddingTop: "8px" }}>{t("ficheInfirmerieCreation.careGived")} </h3>
        </label>
        <Row className="ml-1">
            <Col>
                <Controller
                    name="careGived"
                    control={control}
                    defaultValue={values.careGived}
                    render={({ field }) => <Input
                        autoComplete="off"
                        rows={4}
                        type="textarea"
                        id="careGived"
                        className={
                            errors.careGived && submitted
                                ? "text-input error"
                                : "text-input"
                        }
                        {...field}
                    />}
                />

                {errors.careGived && submitted && (
                    <div className="input-feedback">
                        {errors.careGived.message}
                    </div>
                )}
            </Col>
        </Row>
    </>
}

export default Care
