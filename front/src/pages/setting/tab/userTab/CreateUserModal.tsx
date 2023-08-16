import { yupResolver } from "@hookform/resolvers/yup";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  Col,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  InputGroup,
  InputGroupText,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import * as Yup from "yup";
import type { UserData, Language } from "../../../../models/user";
import { Service } from "../../../../models/service";

interface Props {
  onSave(_userData: UserData): void;
  onClose(): void;
  languages: Language[];
  services: Service[];
}

const CreateUserModal: React.FC<Props> = ({
  onSave,
  onClose,
  languages,
  services,
}) => {
  const formSchema = Yup.object().shape({
    firstname: Yup.string().required("Entrer le Nom"),
    lastname: Yup.string().required("Entrer le Prénom"),
    email: Yup.string()
      .required("Entrer l'adresse mail")
      .email("Adresse mail invalide"),
    password: Yup.string().required("Entrer le mot de passe"),
    function: Yup.string().required("Entrer la fonction"),
    username: Yup.string().required("Entrer le nom d'utilisateur "),
    roles: Yup.string().required("Entrer le role"),
    language: Yup.string().required("Entrer la langue"),
  });

  const validationOpt = { resolver: yupResolver(formSchema) };

  const { handleSubmit, formState, control } = useForm<UserData>(validationOpt);

  const { errors } = formState;

  return (
    <>
      <ModalHeader
        close={
          <button className="close" onClick={onClose}>
            ×
          </button>
        }
        toggle={onClose}
      >
        Création d'un utilisateur
      </ModalHeader>
      <ModalBody>
        <Form>
          <Row>
            <Col md={6}>
              <FormGroup>
                <InputGroup size="lg">
                  <InputGroupText>Nom</InputGroupText>
                  <Controller
                    control={control}
                    name="firstname"
                    render={({ field }) => (
                      <>
                        <Input
                          {...field}
                          invalid={errors[field.name]?.message ? true : false}
                          bsSize="lg"
                        />
                        <FormFeedback>
                          {errors[field.name]?.message}
                        </FormFeedback>
                      </>
                    )}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup size="lg">
                  <InputGroupText>Prénom</InputGroupText>
                  <Controller
                    control={control}
                    name="lastname"
                    render={({ field }) => (
                      <>
                        <Input
                          {...field}
                          invalid={errors[field.name]?.message ? true : false}
                          bsSize="lg"
                        />
                        <FormFeedback>
                          {errors[field.name]?.message}
                        </FormFeedback>
                      </>
                    )}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup size="lg">
                  <InputGroupText>Email</InputGroupText>
                  <Controller
                    control={control}
                    name="email"
                    render={({ field }) => (
                      <>
                        <Input
                          {...field}
                          invalid={errors[field.name]?.message ? true : false}
                          bsSize="lg"
                        />
                        <FormFeedback>
                          {errors[field.name]?.message}
                        </FormFeedback>
                      </>
                    )}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup size="lg">
                  <InputGroupText>Mot de passe</InputGroupText>
                  <Controller
                    control={control}
                    name="password"
                    render={({ field }) => (
                      <>
                        <Input
                          {...field}
                          invalid={errors[field.name]?.message ? true : false}
                          bsSize="lg"
                        />
                        <FormFeedback>
                          {errors[field.name]?.message}
                        </FormFeedback>
                      </>
                    )}
                  />
                </InputGroup>
              </FormGroup>

              <FormGroup>
                <InputGroup size="lg">
                  <InputGroupText>Langue</InputGroupText>
                  <Controller
                    control={control}
                    name="language"
                    render={({ field }) => (
                      <>
                        <Input
                          type="select"
                          className="form-select"
                          bsSize="lg"
                          {...field}
                        >
                          <option key="french"></option>
                          {languages.map((option) => (
                            <option key={option.name}>{option.name}</option>
                          ))}
                        </Input>
                        <FormFeedback>
                          {errors[field.name]?.message}
                        </FormFeedback>
                      </>
                    )}
                  />
                </InputGroup>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <InputGroup size="lg">
                  <InputGroupText>Fonction</InputGroupText>
                  <Controller
                    control={control}
                    name="function"
                    render={({ field }) => (
                      <>
                        <Input
                          {...field}
                          invalid={errors[field.name]?.message ? true : false}
                          bsSize="lg"
                        />
                        <FormFeedback>
                          {errors[field.name]?.message}
                        </FormFeedback>
                      </>
                    )}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup size="lg">
                  <InputGroupText>Nom d'utilisateur</InputGroupText>
                  <Controller
                    control={control}
                    name="username"
                    render={({ field }) => (
                      <>
                        <Input
                          {...field}
                          bsSize="lg"
                          invalid={errors[field.name]?.message ? true : false}
                        />
                        <FormFeedback>
                          {errors[field.name]?.message}
                        </FormFeedback>
                      </>
                    )}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup size="lg">
                  <InputGroupText>Rôle</InputGroupText>
                  <Controller
                    control={control}
                    name="roles"
                    render={({ field }) => (
                      <>
                        <Input
                          type="select"
                          className="form-select"
                          {...field}
                          bsSize="lg"
                          invalid={errors[field.name]?.message ? true : false}
                        >
                          <option value=""></option>
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </Input>
                        <FormFeedback>
                          {errors[field.name]?.message}
                        </FormFeedback>
                      </>
                    )}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup size="lg">
                  <InputGroupText>Service</InputGroupText>
                  <Controller
                    control={control}
                    name="service.id"
                    render={({ field }) => (
                      <Input
                        type="select"
                        className="form-select"
                        {...field}
                        bsSize="lg"
                      >
                        <option></option>
                        {services.map((service) => (
                          <option key={service.id} value={service.id}>
                            {service.name}
                          </option>
                        ))}
                      </Input>
                    )}
                  />
                </InputGroup>
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </ModalBody>

      <ModalFooter>
        <Button color="primary" onClick={handleSubmit(onSave)}>
          Enregistrer
        </Button>
      </ModalFooter>
    </>
  );
};

export default CreateUserModal;
