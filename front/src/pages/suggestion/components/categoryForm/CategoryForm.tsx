/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Button, Col, FormGroup, Input, Row } from "reactstrap";

import { SugCategory } from "../../../../models/sugCategory";

export interface CategoryFormValues {
  id: number;
  name: string;
}

interface CategoryFormValuesProps {
  handleAddSugCategory?: (data: SugCategory) => Promise<void>;
  handleEditSugCategory?: (data: SugCategory) => Promise<void>;
  selectedSugCategory?: SugCategory | undefined;
}

export const CategoryForm = ({
  handleAddSugCategory,
  handleEditSugCategory,
  selectedSugCategory,
}: CategoryFormValuesProps) => {
  const {
    control,
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      id: 0,
      name: "",
    },
  });

  const onSubmit = async (data: any) => {
    if (!selectedSugCategory && handleAddSugCategory) {
      await handleAddSugCategory(data);
    }
    if (selectedSugCategory && handleEditSugCategory) {
      await handleEditSugCategory(data);
    }
  };

  useEffect(() => {
    register("name", {
      validate: (value) => value !== "" || "Vous devez saisir un nom.",
    });
  }, [register]);

  useEffect(() => {
    if (selectedSugCategory) {
      setValue("id", selectedSugCategory.id ?? 0);
      setValue("name", selectedSugCategory.name);
    }
  }, [selectedSugCategory]);

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
