import {Control, Controller, DeepRequired, FieldErrorsImpl, UseFormWatch} from "react-hook-form";
import {FicheInfAdd} from "../../../../../models/ficheinf";
import {Col, FormFeedback, FormGroup, Input, InputGroup, Label, Row} from "reactstrap";
import {useTranslation} from "react-i18next";
import {useCategory} from "../../../../../hooks/FicheInfirmerie/fiCategory";
import { LesionDetails as LesionDetailsType } from "../../../../../models/lesionDetails";

const Care = (props: {
    watch: UseFormWatch<FicheInfAdd>;
    control: Control<FicheInfAdd, any>;
    errors: FieldErrorsImpl<DeepRequired<FicheInfAdd>>;
    submitted: boolean;
    values: FicheInfAdd;
    setValue: Function;
    onChangeField: Function;
}) => {
    const { control, errors, values, watch, onChangeField } = props;
    const { t } = useTranslation();
    const { categories } = useCategory<LesionDetailsType>({endpoint: 'fi_lesionDetails'})

    return (
        <>
            {/*Soins donnés*/}
            <Row>
                <Col>
                    <FormGroup>
                        <label
                            htmlFor="careProvidedId"
                            className="label"
                            style={{ display: "block" }}
                        >
                            {t("ficheInfirmerieCreation.careTitle")}
                        </label>
                        <InputGroup>
                            {categories.map((material) => {
                                return (
                                    <Controller
                                        name="careProvidedId"
                                        control={control}
                                        defaultValue={values.careProvidedId}
                                        key={material.name}
                                        render={({ field }) => {
                                            return (
                                                <Col xs={6} key={material.id} className="radio-container">
                                                    <Input
                                                        type="radio"
                                                        {...field}
                                                        onChange={(e) => {
                                                            field.onChange(e);
                                                            onChangeField()
                                                        }}
                                                        checked={watch("careProvidedId") == material.id}
                                                        value={material.id}
                                                        id={material.name}
                                                    />
                                                    <Label for={material.name} checked>
                                                        {material.name}
                                                    </Label>
                                                </Col>
                                            );
                                        }}
                                    />
                                );
                            })}
                        </InputGroup>
                        {errors.careProvidedId && (
                            <div className="input-feedback">{errors.careProvidedId.message}</div>
                        )}
                    </FormGroup>
                </Col>
            </Row>

            {/* Donneur de soin */}
            <Row className={errors.caregiver && "mb-4"}>
                <Col>
                    <FormGroup floating>
                        <Controller
                            name="caregiver"
                            control={control}
                            defaultValue={values.caregiver || ""}
                            render={({ field }) => <Input
                                autoComplete="off"
                                type="text"
                                id="caregiver"
                                placeholder={t("ficheInfirmerieCreation.caregiver")}
                                className={
                                    errors.caregiver && props.submitted
                                        ? "text-input error"
                                        : "text-input"
                                }
                                {...field}
                                onChange={(e) => {
                                    field.onChange(e);
                                    onChangeField(field.name);
                                }}
                                invalid={errors.caregiver != undefined}
                            />}
                        />
                        <Label htmlFor="caregiver">
                            {t("ficheInfirmerieCreation.caregiver")}
                        </Label>
                        {errors.caregiver && (
                            <FormFeedback tooltip>
                                {errors.caregiver.message}
                            </FormFeedback>
                        )}
                    </FormGroup>
                </Col>
            </Row>

            {/* Soins donnés */}
            <Row className={errors.careGived && "mb-4"}>
                <Col>
                    <FormGroup floating>
                        <Controller
                            name="careGived"
                            control={control}
                            defaultValue={values.careGived || ""}
                            render={({ field }) => <Input
                                autoComplete="off"
                                type="textarea"
                                id="careGived"
                                placeholder={t("ficheInfirmerieCreation.careGived")}
                                className={
                                    errors.careGived && props.submitted
                                        ? "text-input error"
                                        : "text-input"
                                }
                                {...field}
                                onChange={(e) => {
                                    field.onChange(e);
                                    onChangeField(field.name);
                                }}
                                invalid={errors.careGived != undefined}
                            />}
                        />
                        <Label htmlFor="careGived">
                            {t("ficheInfirmerieCreation.careGived")}
                        </Label>
                        {errors.careGived && (
                            <FormFeedback tooltip>
                                {errors.careGived.message}
                            </FormFeedback>
                        )}
                    </FormGroup>
                </Col>
            </Row>
        </>
    )
}

export default Care;