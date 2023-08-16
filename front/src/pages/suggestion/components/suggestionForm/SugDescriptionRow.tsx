import { Control, Controller, FieldError } from "react-hook-form";
import { Input, Row, Col, FormGroup, Alert } from "reactstrap";
import { SuggestionFormValues } from "./SuggestionForm";
import CharactersCounter from "../../../ficheSecurite/creation/components/charactersCounter";

interface SugDescriptionRowProps {
  control: Control<SuggestionFormValues, any>;
  errors: {
    id?: FieldError | undefined;
    sugCategoryId?: FieldError | undefined;
    sugClassificationId?: FieldError | undefined;
    senderFirstname?: FieldError | undefined;
    senderLastname?: FieldError | undefined;
    description?: FieldError | undefined;
    serviceId?: FieldError | undefined;
    teamId?: FieldError | undefined;
    responsibleId?: FieldError | undefined;
  };
  watch?: Function;
}

export const SugDescriptionRow = ({
  control,
  errors,
  watch,
}: SugDescriptionRowProps) => {
  return (
    <>
      <Row>
        <Col>
          <FormGroup>
            <label
              className="label"
              htmlFor="description"
              style={{ display: "block" }}
            >
              <h3 style={{ paddingTop: "8px" }}>Description</h3>
            </label>
            <CharactersCounter
              actualValue={watch ? watch("description") : ""}
              inputRender={(max: number) => {
                return (
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <Input
                        autoComplete="off"
                        rows={4}
                        type="textarea"
                        maxLength={max}
                        id="description"
                        {...field}
                      />
                    )}
                  />
                );
              }}
            />
            {errors.description && (
              <Alert color="danger" style={{ padding: "0.5rem" }}>
                {errors.description.message}
              </Alert>
            )}
          </FormGroup>
        </Col>
      </Row>
    </>
  );
};
