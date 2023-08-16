import { Control, Controller, FieldError } from "react-hook-form";
import { Input, Row, Col, FormGroup, Alert } from "reactstrap";
import { SuggestionFormValues } from "./SuggestionForm";

interface SugSenderRowProps {
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
}

export const SugSenderRow = ({ control, errors }: SugSenderRowProps) => {
  return (
    <>
      <Row className="ml-1">
        <Col md={4} className="pl-0">
          <FormGroup>
            <label htmlFor="senderFirstname" className="label">
              Prénom
            </label>
            <Controller
              name="senderFirstname"
              control={control}
              render={({ field }) => (
                <Input type="text" id="senderFirstname" {...field} />
              )}
            />
            {errors.senderFirstname && (
              <Alert color="danger" style={{ padding: "0.5rem" }}>
                {errors.senderFirstname.message}
              </Alert>
            )}
          </FormGroup>
        </Col>

        <Col md={4} className="pl-0">
          <FormGroup>
            <label htmlFor="senderLastname" className="label">
              Nom
            </label>
            <Controller
              name="senderLastname"
              control={control}
              render={({ field }) => (
                <Input type="text" id="senderLastname" {...field} />
              )}
            />
            {errors.senderLastname && (
              <Alert color="danger" style={{ padding: "0.5rem" }}>
                {errors.senderLastname.message}
              </Alert>
            )}
          </FormGroup>
        </Col>
      </Row>
    </>
  );
};
