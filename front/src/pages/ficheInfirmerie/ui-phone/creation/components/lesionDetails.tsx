import {Control, Controller, DeepRequired, FieldErrorsImpl, UseFormWatch} from "react-hook-form";
import {FicheInfAdd} from "../../../../../models/ficheinf";
import {Col, FormGroup, Input, InputGroup, Label, Row} from "reactstrap";
import {useTranslation} from "react-i18next";
import {useCategory} from "../../../../../hooks/FicheInfirmerie/fiCategory";
import { LesionDetails as LesionDetailsType } from "../../../../../models/lesionDetails";

const LesionDetails = (props: {
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
            {/*Détails des Lésions*/}
            <Row>
                <Col>
                    <FormGroup>
                        <label
                            htmlFor="lesionDetailsId"
                            className="label"
                            style={{ display: "block" }}
                        >
                            {t("ficheInfirmerieCreation.lesionDetailsId")}
                        </label>
                        <InputGroup>
                            {categories.map((material) => {
                                return (
                                    <Controller
                                        name="lesionDetailsId"
                                        control={control}
                                        defaultValue={values.lesionDetailsId}
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
                                                        checked={watch("lesionDetailsId") == material.id}
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
                        {errors.lesionDetailsId && (
                            <div className="input-feedback">{errors.lesionDetailsId.message}</div>
                        )}
                    </FormGroup>
                </Col>
            </Row>
        </>
    )
}

export default LesionDetails;