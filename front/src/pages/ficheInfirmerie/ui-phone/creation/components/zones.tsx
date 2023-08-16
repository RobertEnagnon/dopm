import {Control, Controller, DeepRequired, FieldErrorsImpl, UseFormWatch} from "react-hook-form";
import {FicheInfAdd} from "../../../../../models/ficheinf";
import {useTranslation} from "react-i18next";
import {Col, FormGroup, Input, InputGroup, Label, Row} from "reactstrap";
import {useZone} from "../../../../../hooks/zone";
import {useEffect} from "react";

const Zones = (props: {
    watch: UseFormWatch<FicheInfAdd>;
    control: Control<FicheInfAdd, any>;
    errors: FieldErrorsImpl<DeepRequired<FicheInfAdd>>;
    submitted: boolean;
    values: FicheInfAdd;
    setValue: Function;
    onChangeField: Function;
}) => {
    const { control, errors, values, watch, onChangeField, setValue } = props;

    const { t } = useTranslation();
    const { zones, subzones, fetchSubzones } = useZone();

    useEffect(() => {
        if(!watch("zoneId") && !watch("subzoneId")) {
            if (values.zoneId != -1) fetchSubzones(values.zoneId || 0);

            setValue("zoneId", values.zoneId);
            setValue("subzoneId", values.subzoneId);
        }
    }, [values, watch]);

    useEffect(() => {
        if (watch("zoneId")) {
            fetchSubzones(watch("zoneId") || 0);
        }
    }, [watch("zoneId")]);

    return (
        <>
            {/*Zone*/}
            <Row>
                <Col>
                    <FormGroup>
                        <label
                            htmlFor="zoneId"
                            className="label"
                            style={{ display: "block" }}
                        >
                            {t("ficheInfirmerieCreation.location1")}
                        </label>

                        <InputGroup>
                            {zones.map((zone) => {
                                return (
                                    <Controller
                                        name="zoneId"
                                        control={control}
                                        defaultValue={values.zoneId}
                                        key={zone.name}
                                        render={({ field }) => {
                                            return (
                                                <Col xs={6} key={zone.id} className="radio-container">
                                                    <Input
                                                        type="radio"
                                                        {...field}
                                                        onChange={(e) => {
                                                            field.onChange(e);
                                                            onChangeField()
                                                        }}
                                                        checked={watch("zoneId") == zone.id}
                                                        value={zone.id}
                                                        id={zone.name}
                                                    />
                                                    <Label for={zone.name} checked>
                                                        {zone.name}
                                                    </Label>
                                                </Col>
                                            );
                                        }}
                                    />
                                );
                            })}
                        </InputGroup>
                        {errors.zoneId && (
                            <div className="input-feedback">{errors.zoneId.message}</div>
                        )}
                    </FormGroup>
                </Col>
            </Row>

            {/*Sous-Zone*/}
            {subzones.length > 0 && (
                <Row>
                    <Col>
                        <FormGroup>
                            <label
                                htmlFor="subzoneId"
                                className="label"
                                style={{ display: "block" }}
                            >
                                {t("ficheInfirmerieCreation.location2")}
                            </label>
                            <InputGroup>
                                {subzones.map((subzone) => {
                                    return (
                                        <Controller
                                            name="subzoneId"
                                            control={control}
                                            defaultValue={values.subzoneId}
                                            key={subzone.name}
                                            render={({ field }) => {
                                                return (
                                                    <Col
                                                        xs={6}
                                                        key={subzone.id}
                                                        className="radio-container"
                                                    >
                                                        <Input
                                                            type="radio"
                                                            {...field}
                                                            onChange={(e) => {
                                                                field.onChange(e);
                                                                onChangeField()
                                                            }}
                                                            checked={watch("subzoneId") == subzone.id}
                                                            value={subzone.id}
                                                            id={subzone.name}
                                                        />
                                                        <Label for={subzone.name} checked>
                                                            {subzone.name}
                                                        </Label>
                                                    </Col>
                                                );
                                            }}
                                        />
                                    );
                                })}
                            </InputGroup>
                            {errors.subzoneId && (
                                <div className="input-feedback">{errors.subzoneId.message}</div>
                            )}
                        </FormGroup>
                    </Col>
                </Row>
            )}
        </>
    )
}

export default Zones;