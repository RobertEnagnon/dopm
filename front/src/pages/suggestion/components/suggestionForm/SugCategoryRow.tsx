import {
  Control,
  Controller,
  FieldError,
  UseFormSetValue,
} from "react-hook-form";
import { Input, Row, Col, Alert } from "reactstrap";
import { useSugCategory } from "../../../../hooks/sugCategory";
import { SuggestionFormValues } from "./SuggestionForm";

interface SugCategoryRowProps {
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

export const SugCategoryRow = ({
  control,
  setValue,
  errors,
}: SugCategoryRowProps) => {
  const { sugCategories } = useSugCategory();
  return (
    <>
      <h3>Catégorie</h3>
      <Controller
        name="sugCategoryId"
        control={control}
        render={({ field }) => (
          <Row style={{ marginLeft: 10, marginBottom: 10 }}>
            {sugCategories &&
              sugCategories.map((sugCategory) => (
                <Col md={3}>
                  <Input
                    type="radio"
                    id={sugCategory.id!.toString()}
                    {...field}
                    checked={field.value === sugCategory.id}
                    onChange={() => setValue("sugCategoryId", sugCategory.id!)}
                  />
                  {sugCategory.name}
                </Col>
              ))}
            {errors.sugCategoryId && (
              <Alert color="danger" style={{ padding: "0.5rem" }}>
                {errors.sugCategoryId.message}
              </Alert>
            )}
          </Row>
        )}
      />
    </>
  );
};
