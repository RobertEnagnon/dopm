import {
  Control,
  Controller,
  FieldError,
  UseFormSetValue,
} from "react-hook-form";
import { Input, Row, Col, Alert } from "reactstrap";
import { useSugClassification } from "../../../../hooks/sugClassification";
import { SuggestionFormValues } from "./SuggestionForm";

interface SugClassificationRowProps {
  control: Control<SuggestionFormValues, any>;
  setValue: UseFormSetValue<SuggestionFormValues>;
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

export const SugClassificationRow = ({
  control,
  setValue,
  errors,
}: SugClassificationRowProps) => {
  const { sugClassifications } = useSugClassification();
  return (
    <>
      <h3 className="mt-2">Classification</h3>
      <Controller
        name="sugClassificationId"
        control={control}
        render={({ field }) => (
          <Row style={{ marginLeft: 10, marginBottom: 10 }}>
            {sugClassifications &&
              sugClassifications.map((sugClassification) => (
                <Col md={3}>
                  <Input
                    type="radio"
                    id={sugClassification.id!.toString()}
                    {...field}
                    checked={field.value === sugClassification.id}
                    onChange={() =>
                      setValue("sugClassificationId", sugClassification.id!)
                    }
                  />
                  {sugClassification.name}
                </Col>
              ))}
            {errors.sugClassificationId && (
              <Alert color="danger" style={{ padding: "0.5rem" }}>
                {errors.sugClassificationId.message}
              </Alert>
            )}
          </Row>
        )}
      />
    </>
  );
};
