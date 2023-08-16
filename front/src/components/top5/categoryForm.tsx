import { Modal } from "react-bootstrap";
import {
  Alert,
  Button,
  Col,
  Container,
  FormGroup,
  Input,
  InputGroup,
  InputGroupText,
  Row,
} from "reactstrap";
import { Category } from "../../models/Top5/category";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Top5ContextType } from "../context/top5.context";

type FormValues = {
  id: number;
  name: string;
};

interface CategoryFormProps {
  category: Category;
  top5Context: Top5ContextType;
  setCategoryOnCreation: Function;
}

const CategoryForm = ({
  category,
  top5Context,
  setCategoryOnCreation,
}: CategoryFormProps) => {
  const [currentCategory, setCurrentCategory] = useState<Category>();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormValues>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      id: 0,
      name: "",
    },
  });

  useEffect(() => {
    if (category) {
      setCurrentCategory(category);
    }
  }, []);

  useEffect(() => {
    if (currentCategory) {
      setValue("id", currentCategory.id);
      setValue("name", currentCategory.name);
    }
  }, [currentCategory, setValue]);

  useEffect(() => {
    register("name", {
      validate: (value) =>
        value?.trim()?.length == 0
          ? "Vous devez saisir un nom."
          : value?.trim()?.length >= 3 ||
            "Le nom doit contenir au moins 3 caractères.",
    });
  }, [register]);

  const onSubmit = async (data: any) => {
    if (currentCategory) {
      let categoryToSave: Category = { ...currentCategory, name: data.name };
      await top5Context.handleAddCategory(categoryToSave);
      setCategoryOnCreation(false);
    }
  };

  return (
    <>
      <Modal.Header>
        <h3>Ajout Catégorie</h3>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Row form={true}>
              <Col md={{ size: 6, offset: 3 }}>
                <FormGroup>
                  {errors.name ? (
                    <Alert color="danger" style={{ padding: "0.5rem" }}>
                      {errors.name.message}
                    </Alert>
                  ) : null}
                  <InputGroup size="sm">
                    <InputGroupText htmlFor="name">
                      Nom de la Catégorie :
                    </InputGroupText>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <Input
                          bsSize="sm"
                          type="text"
                          id="categoryName"
                          {...field}
                        />
                      )}
                    />
                  </InputGroup>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={{ size: 2, offset: 5 }}>
                <Button type="submit" color="primary" block>
                  Valider
                </Button>
              </Col>
            </Row>
          </form>
        </Container>
      </Modal.Body>
    </>
  );
};

export default CategoryForm;
