import {Control, Controller, DeepRequired, FieldErrorsImpl, UseFormWatch} from "react-hook-form";
import {FicheInfAdd} from "../../../../../models/ficheinf";
import {Col, FormGroup, Input, InputGroup, Label, Row} from "reactstrap";
import {useTranslation} from "react-i18next";
import { Responsible } from "../../../../../models/responsible";

const Responsibles = (props: {
    responsibleConservatoires: Array<Responsible>;
    watch: UseFormWatch<FicheInfAdd>;
    control: Control<FicheInfAdd, any>;
    errors: FieldErrorsImpl<DeepRequired<FicheInfAdd>>;
    submitted: boolean;
    values: FicheInfAdd;
    setValue: Function;
    onChangeField: Function;
}) => {
    const {
        control,
        errors,
        watch,
        onChangeField,
        responsibleConservatoires
    } = props;

    const { t } = useTranslation();

    const sortResponsible = (responsibles: Array<Responsible>) => {
        return responsibles.sort((a, b) => {
            if (a.lastname < b?.lastname) {
                return -1;
            }
            if (a.lastname > b.lastname) {
                return 1;
            }
            if (a.firstname < b.firstname) {
                return -1;
            }
            if (a.firstname > b.firstname) {
                return 1;
            }
            return 0;
        });
    };

    return (
        <Row>
            <Col>
                <FormGroup>
                    <label
                        htmlFor="responsibleSecuriteId"
                        className="label"
                        style={{ display: "block" }}
                    >
                        {t("ficheInfirmerieCreation.SafetyAppliedResponsible")}
                    </label>
                    <InputGroup>
                        {sortResponsible(responsibleConservatoires).map((responsible) => {
                            return (
                                <Controller
                                    name="responsibleSecuriteId"
                                    control={control}
                                    key={responsible.lastname}
                                    render={({ field }) => {
                                        return (
                                            <Col xs={12} className="radio-container">
                                                <Input
                                                    type="radio"
                                                    {...field}
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        onChangeField();
                                                    }}
                                                    checked={
                                                        watch &&
                                                        watch("responsibleSecuriteId") == responsible.id
                                                    }
                                                    value={responsible.id}
                                                    id={responsible.lastname}
                                                />
                                                <Label for={responsible.lastname} checked>
                                                    {responsible.lastname}
                                                </Label>
                                            </Col>
                                        );
                                    }}
                                />
                            );
                        })}
                    </InputGroup>
                    {errors.responsibleSecuriteId && (
                        <div className="input-feedback">{errors.responsibleSecuriteId.message}</div>
                    )}
                </FormGroup>
            </Col>
        </Row>
    )
}

export default Responsibles;
