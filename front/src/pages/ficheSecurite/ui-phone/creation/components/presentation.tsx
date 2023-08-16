import {
  Col,
  FormFeedback,
  FormGroup,
  Input,
  InputGroup,
  Label,
  Row,
} from "reactstrap";
import { useTranslation } from "react-i18next";
import { useFSCategory } from "../../../../../hooks/FicheSecurite/fsCategory";
import {
  Control,
  Controller,
  DeepRequired,
  FieldErrorsImpl,
  UseFormWatch,
} from "react-hook-form";
import { FicheAdd } from "../../../../../models/fiche";
import { useTeam } from "../../../../../hooks/team";

const Presentation = (props: {
  watch: UseFormWatch<FicheAdd>;
  control: Control<FicheAdd, any>;
  errors: FieldErrorsImpl<DeepRequired<FicheAdd>>;
  submitted: boolean;
  values: FicheAdd;
  setValue: Function;
  onChangeField: Function;
}) => {
  const { control, errors, submitted, values, watch, onChangeField } = props;
  const { fscategories } = useFSCategory();
  const { teams } = useTeam();
  const { t } = useTranslation();

  return (
    <>
      {/*Catégorie*/}
      <Row>
        <Col>
          <FormGroup>
            <label
              htmlFor="fsCategoryId"
              className="label"
              style={{ display: "block" }}
            >
              {t("ficheSecuriteCreation.catTitle")}
            </label>
            <InputGroup>
              {fscategories.map((fscategory) => {
                return (
                  <Controller
                    name="fsCategoryId"
                    control={control}
                    defaultValue={values.fsCategoryId}
                    key={fscategory.id}
                    render={({ field }) => (
                      <Col
                        xs={6}
                        key={fscategory.id}
                        className="radio-container"
                      >
                        <Input
                          type="radio"
                          {...field}
                          checked={watch("fsCategoryId") == fscategory.id}
                          value={fscategory.id}
                          id={fscategory.name}
                          onChange={(e) => {
                            field.onChange(e);
                            onChangeField();
                          }}
                        />
                        <Label for={fscategory.name} checked>
                          {fscategory.name}
                        </Label>
                      </Col>
                    )}
                  />
                );
              })}
            </InputGroup>
            {errors.fsCategoryId && (
                <div className="input-feedback">{errors.fsCategoryId.message}</div>
            )}
          </FormGroup>
        </Col>
      </Row>

      {/*Prénom*/}
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
                  id="senderFirstname"
                  placeholder={t("ficheSecuriteCreation.senderFirstName")}
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
              {t("ficheSecuriteCreation.senderFirstName")}
            </Label>
            {errors.senderFirstname && (
              <FormFeedback tooltip>
                {errors.senderFirstname.message}
              </FormFeedback>
            )}
          </FormGroup>
        </Col>
      </Row>

      {/*Nom de famille*/}
      <Row className={errors.senderLastname && "mb-4"}>
        <Col>
          <FormGroup floating>
            <Controller
              name="senderLastname"
              control={control}
              defaultValue={values.senderLastname || ""}
              render={({ field }) => (
                <Input
                  autoComplete="off"
                  type="text"
                  id="senderLastname"
                  placeholder={t("ficheSecuriteCreation.senderName")}
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
                />
              )}
            />
            <Label htmlFor="senderLastname">
              {t("ficheSecuriteCreation.senderName")}
            </Label>
            {errors.senderLastname && (
              <FormFeedback tooltip>
                {errors.senderLastname.message}
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
              {t("ficheSecuriteCreation.senderTeam")}
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
  );
};

export default Presentation;
