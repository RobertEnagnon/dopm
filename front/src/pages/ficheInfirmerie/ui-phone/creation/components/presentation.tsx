import {Control, Controller, DeepRequired, FieldErrorsImpl, UseFormWatch} from "react-hook-form";
import {FicheInfAdd} from "../../../../../models/ficheinf";
import {Col, FormFeedback, FormGroup, Input, InputGroup, Label, Row} from "reactstrap";
import {useTranslation} from "react-i18next";
import {useCategory} from "../../../../../hooks/FicheInfirmerie/fiCategory";
import {InjuredCategory} from "../../../../../models/injuredCategory";
import {useTeam} from "../../../../../hooks/team";

const Presentation = (props: {
    watch: UseFormWatch<FicheInfAdd>;
    control: Control<FicheInfAdd, any>;
    errors: FieldErrorsImpl<DeepRequired<FicheInfAdd>>;
    submitted: boolean;
    values: FicheInfAdd;
    setValue: Function;
    onChangeField: Function;
}) => {
    const { control, errors, submitted, values, watch, onChangeField } = props;

    const { categories } = useCategory<InjuredCategory>({endpoint: 'fi_injcategories'})
    const { teams } = useTeam();
    const { t } = useTranslation();

    return (
        <>
            {/* IDENTIFICATION DU BLESSE */}
            <Row>
                <Col>
                    <FormGroup>
                        <label
                            htmlFor="injuredCategoryId"
                            className="label"
                            style={{ display: "block" }}
                        >
                            {t("ficheInfirmerieCreation.catTitle")}
                        </label>
                        <InputGroup>
                            {categories.map((category) => {
                                return (
                                    <Controller
                                        name="injuredCategoryId"
                                        control={control}
                                        defaultValue={values.injuredCategoryId}
                                        key={category.id}
                                        render={({ field }) => (
                                            <Col
                                                xs={6}
                                                key={category.id}
                                                className="radio-container"
                                            >
                                                <Input
                                                    type="radio"
                                                    {...field}
                                                    checked={watch("injuredCategoryId") == category.id}
                                                    value={category.id}
                                                    id={category.name}
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        onChangeField();
                                                    }}
                                                />
                                                <Label for={category.name} checked>
                                                    {category.name}
                                                </Label>
                                            </Col>
                                        )}
                                    />
                                );
                            })}
                        </InputGroup>
                        {errors.injuredCategoryId && (
                            <div className="input-feedback">{errors.injuredCategoryId.message}</div>
                        )}
                    </FormGroup>
                </Col>
            </Row>

            {/* Prénom */}
            <Row className={errors.senderFirstname && "mb-4"}>
                <Col>
                    <FormGroup floating>
                        <Controller
                            name="senderFirstname"
                            control={control}
                            defaultValue={values.senderFirstname || ""}
                            render={({ field }) => (
                                <Input
                                    autoComplete="off"
                                    type="text"
                                    id="sendFirstname"
                                    placeholder={t("ficheInfirmerieCreation.senderFirstName")}
                                    className={
                                        props.errors.senderFirstname && props.submitted
                                            ? "text-input error"
                                            : "text-input"
                                    }
                                    {...field}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        onChangeField();
                                    }}
                                    invalid={errors.senderFirstname != undefined}
                                />
                            )}
                        />
                        <Label htmlFor="senderFirstname">
                            {t("ficheInfirmerieCreation.senderFirstName")}
                        </Label>
                        {errors.senderFirstname && (
                            <FormFeedback tooltip>
                                {errors.senderFirstname.message}
                            </FormFeedback>
                        )}
                    </FormGroup>
                </Col>
            </Row>

            {/* Nom de famille */}
            <Row className={errors.senderLastname && "mb-4"}>
                <Col>
                    <FormGroup floating>
                        <Controller
                            name="senderLastname"
                            control={control}
                            defaultValue={values.senderLastname || ""}
                            render={({ field }) => <Input
                                autoComplete="off"
                                type="text"
                                id="senderLastname"
                                placeholder={t("ficheInfirmerieCreation.senderName")}
                                className={
                                    errors.senderLastname && submitted
                                        ? "text-input error"
                                        : "text-input"
                                }
                                {...field}
                                onChange={(e) => {
                                    field.onChange(e);
                                    onChangeField(field.name);
                                }}
                                invalid={errors.senderLastname != undefined}
                            />}
                        />
                        <Label htmlFor="senderLastname">
                            {t("ficheInfirmerieCreation.senderName")}
                        </Label>
                        {errors.senderLastname && (
                            <FormFeedback tooltip>
                                {errors.senderLastname.message}
                            </FormFeedback>
                        )}
                    </FormGroup>
                </Col>
            </Row>

            {/*Poste*/}
            <Row className={errors.post && "mb-4"}>
                <Col>
                    <FormGroup floating>
                        <Controller
                            name="post"
                            control={control}
                            defaultValue={values.post || ""}
                            render={({ field }) => <Input
                                autoComplete="off"
                                type="text"
                                id="post"
                                placeholder={t("ficheInfirmerieCreation.post")}
                                className={
                                    errors.post && submitted
                                        ? "text-input error"
                                        : "text-input"
                                }
                                {...field}
                                onChange={(e) => {
                                    field.onChange(e);
                                    onChangeField(field.name);
                                }}
                                invalid={errors.post != undefined}
                            />}
                        />
                        <Label htmlFor="post">
                            {t("ficheInfirmerieCreation.post")}
                        </Label>
                        {errors.post && (
                            <FormFeedback tooltip>
                                {errors.post.message}
                            </FormFeedback>
                        )}
                    </FormGroup>
                </Col>
            </Row>

            {/*Équipe*/}
            <Row>
                <Col>
                    <FormGroup>
                        <label
                            htmlFor="teamId"
                            className="label"
                            style={{ display: "block" }}
                        >
                            {t("ficheInfirmerieCreation.senderTeam")}
                        </label>
                        <InputGroup>
                            {teams.map((team) => {
                                return (
                                    <Controller
                                        name="teamId"
                                        control={control}
                                        defaultValue={values.teamId}
                                        key={team.name}
                                        render={({ field }) => {
                                            return (
                                                <Col xs={6} key={team.id} className="radio-container">
                                                    <Input
                                                        type="radio"
                                                        {...field}
                                                        onChange={(e) => {
                                                            field.onChange(e);
                                                            onChangeField(field.name);
                                                        }}
                                                        checked={watch("teamId") == team.id}
                                                        value={team.id}
                                                        id={team.name}
                                                    />
                                                    <Label for={team.name} checked>
                                                        {team.name}
                                                    </Label>
                                                </Col>
                                            );
                                        }}
                                    />
                                );
                            })}
                            {errors.teamId && (
                                <div className="input-feedback">{errors.teamId.message}</div>
                            )}
                        </InputGroup>
                    </FormGroup>
                </Col>
            </Row>
        </>
    )
}

export default Presentation;