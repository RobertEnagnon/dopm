/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Button, Col, FormGroup, Input, Row } from "reactstrap";

import { SugClassification } from "../../../../models/sugClassification";

export interface ClassificationFormValues {
  id: number;
  name: string;
}

interface ClassificationFormValuesProps {
  handleAddSugClassification?: (data: SugClassification) => Promise<void>;
  handleEditSugClassification?: (data: SugClassification) => Promise<void>;
  selectedSugClassification?: SugClassification | undefined;
}

export const ClassificationForm = ({
  handleAddSugClassification,
  handleEditSugClassification,
  selectedSugClassification,
}: ClassificationFormValuesProps) => {
  const {
    control,
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<ClassificationFormValues>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      id: 0,
      name: "",
    },
  });

  const onSubmit = async (data: any) => {
    if (!selectedSugClassification && handleAddSugClassification) {
      await handleAddSugClassification(data);
    }
    if (selectedSugClassification && handleEditSugClassification) {
      await handleEditSugClassification(data);
    }
  };

  useEffect(() => {
    register("name", {
      validate: (value) => value !== "" || "Vous devez saisir un nom.",
    });
  }, [register]);

  useEffect(() => {
    if (selectedSugClassification) {
      setValue("id", selectedSugClassification.id ?? 0);
      setValue("name", selectedSugClassification.name);
    }
  }, [selectedSugClassification]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <FormGroup>
          <Col>
            <label htmlFor="name" className="label">
              Nom
            </label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => <Input type="text" id="name" {...field} />}
            />
            {errors.name && (
              <Alert color="danger" style={{ padding: "0.5rem" }}>
                {errors.name.message}
              </Alert>
            )}
          </Col>
        </FormGroup>
      </Row>
      <Button color="primary" style={{ padding: 5 }}>
        Enregistrer
      </Button>
    </form>
  );
};
