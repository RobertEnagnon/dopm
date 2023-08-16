import {Control, Controller, DeepRequired, FieldErrorsImpl, UseFormWatch} from "react-hook-form";
import {FicheInfAdd} from "../../../../../models/ficheinf";
import {Col, FormFeedback, FormGroup, Input, InputGroup, Label, Row} from "reactstrap";
import {useTranslation} from "react-i18next";
import CharactersCounter from "../../../../ficheSecurite/creation/components/charactersCounter";
import {useCategory} from "../../../../../hooks/FicheInfirmerie/fiCategory";
import {MaterialElements} from "../../../../../models/materialElements";

const Details = (props: {
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
    const { categories } = useCategory<MaterialElements>({endpoint: 'fi_materialElements'})

    return (
        <>
            {/* DATE DE L'ACCIDENT */}
            <Row>
                <Col>
                    <FormGroup floating>
                        <Controller
                            name="dateAccident"
                            control={control}
                            defaultValue={values.dateAccident}
                            render={({ field }) => (
                                <Input
                                    autoComplete="off"
                                    type="date"
                                    id="dateAccident"
                                    className={
                                        props.errors.dateAccident && props.submitted
                                            ? "text-input error"
                                            : "text-input"
                                    }
                                    {...field}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        onChangeField();
                                    }}
                                    invalid={errors.dateAccident != undefined}
                                />
                            )}
                        />
                        <Label htmlFor="dateAccident">
                            {t("ficheInfirmerieCreation.dateAccident")}
                        </Label>
                        {errors.dateAccident && (
                            <FormFeedback tooltip>
                                {errors.dateAccident.message}
                            </FormFeedback>
                        )}
                    </FormGroup>
                </Col>
            </Row>

            {/* HEURE ACCIDENT */}
            <Row>
                <Col>
                    <FormGroup floating>
                        <Controller
                            name="hourAccident"
                            control={control}
                            defaultValue={values.hourAccident}
                            render={({ field }) => (
                                <Input
                                    autoComplete="off"
                                    type="time"
                                    id="hourAccident"
                                    className={
                                        props.errors.hourAccident && props.submitted
                                            ? "text-input error"
                                            : "text-input"
                                    }
                                    {...field}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        onChangeField();
                                    }}
                                    invalid={errors.hourAccident != undefined}
                                />
                            )}
                        />
                        <Label htmlFor="hourAccident">
                            {t("ficheInfirmerieCreation.hourAccident")}
                        </Label>
                        {errors.hourAccident && (
                            <FormFeedback tooltip>
                                {errors.hourAccident.message}
                            </FormFeedback>
                        )}
                    </FormGroup>
                </Col>
            </Row>

            {/* CIRCONSTANCES ACCIDENT */}
            <Row>
                <Col>
                    <FormGroup floating>
                        <CharactersCounter
                            actualValue={watch("circumstances") || ""}
                            inputRender={(max: number) => {
                                return <Controller
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
                                                props.errors.circumstances && props.submitted
                                                    ? "text-input error"
                                                    : "text-input"
                                            }
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                onChangeField();
                                            }}
                                            invalid={errors.circumstances != undefined}
                                        />
                                    )}
                                />
                            }}
                        />
                        <Label htmlFor="circumstances">
                            {t("ficheInfirmerieCreation.circumstances")}
                        </Label>
                        {errors.circumstances && (
                            <FormFeedback tooltip>
                                {errors.circumstances.message}
                            </FormFeedback>
                        )}
                    </FormGroup>
                </Col>
            </Row>

            {/*Elements Materiels*/}
            <Row>
                <Col>
                    <FormGroup>
                        <label
                            htmlFor="zoneId"
                            className="label"
                            style={{ display: "block" }}
                        >
                            {t("ficheInfirmerieCreation.materialElementsId")}
                        </label>

                        <InputGroup>
                            {categories.map((material) => {
                                return (
                                    <Controller
                                        name="materialElementsId"
                                        control={control}
                                        defaultValue={values.materialElementsId}
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
                                                        checked={watch("materialElementsId") == material.id}
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
                        {errors.materialElementsId && (
                            <div className="input-feedback">{errors.materialElementsId.message}</div>
                        )}
                    </FormGroup>
                </Col>
            </Row>
        </>
    )
}

export default Details;