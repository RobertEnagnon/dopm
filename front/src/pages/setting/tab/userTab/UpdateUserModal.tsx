import * as React from "react";
// import { useEffect } from "react";

import {
  Button,
  ModalHeader,
  ModalFooter,
  ModalBody,
  InputGroup,
  InputGroupText,
  Input,
  Form,
  FormGroup,
  Row,
  Col,
} from "reactstrap";
import { useForm, Controller } from "react-hook-form";
import { UserData, Language } from "../../../../models/user";

// eslint-disable-next-line no-unused-vars
import { Service } from "../../../../models/service";
// import { useEffect } from "react";

interface Props {
  currentUserData: UserData;
  onSave(_userData: UserData): void;
  onClose(): void;
  languages: Language[];
  services: Service[];
}

const UpdateUserModal: React.FC<Props> = ({
  currentUserData,
  onSave,
  onClose,
  languages,
  services,
}) => {
  const {
    firstname,
    lastname,
    email,
    username,
    function: fonction,
    roles,
    language,
    service,
  } = currentUserData;
  const getUserLanguage = (language: string) => {
    const ln = Object(language.valueOf());
    const curLanguage = ln.languageId;
    let userSelectLanguage;
    for (let index = 0; index < languages.length; index++) {
      const element = languages[index];
      if (element.id == curLanguage) {
        userSelectLanguage = element.name;
      }
    }
    return userSelectLanguage;
  };

  const { handleSubmit, control } = useForm<UserData>();
  // let curlan= "";
  // let lang = false;
  // if(localStorage.getItem("lang") === "sp") {
  //   curlan = "spanish";
  //   lang = true;
  // }
  // if(localStorage.getItem("lang") === "en") {
  //   curlan = "english";
  //   lang = true;
  // }
  // if(localStorage.getItem("lang") === "fr") {
  //   curlan = "french";
  //   lang = true;
  // }
  // console.log(lang)

  return (
    <>
      <ModalHeader
        close={
          <button className="close" onClick={onClose}>
            x
          </button>
        }
        toggle={onClose}
      >
        Modification Utilisateur
      </ModalHeader>
      <ModalBody>
        <Form>
          <Row>
            <Col md={6}>
              <FormGroup>
                <InputGroup size="lg">
                  <InputGroupText>Prénom</InputGroupText>
                  <Controller
                    control={control}
                    name="lastname"
                    defaultValue={lastname}
                    render={({ field }) => <Input {...field} bsSize="lg" />}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup size="lg">
                  <InputGroupText>Nom</InputGroupText>
                  <Controller
                    control={control}
                    name="firstname"
                    defaultValue={firstname}
                    render={({ field }) => <Input {...field} bsSize="lg" />}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup size="lg">
                  <InputGroupText>Email</InputGroupText>
                  <Controller
                    control={control}
                    name="email"
                    defaultValue={email}
                    render={({ field }) => <Input {...field} bsSize="lg" />}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup size="lg">
                  <InputGroupText>Fonction</InputGroupText>
                  <Controller
                    control={control}
                    name="function"
                    defaultValue={fonction}
                    render={({ field }) => <Input {...field} bsSize="lg" />}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup size="lg">
                  <InputGroupText>Service</InputGroupText>
                  <Controller
                    control={control}
                    name="service.id"
                    defaultValue={service?.id}
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
            <Col md={6}>
              <FormGroup>
                <InputGroup size="lg">
                  <InputGroupText>Nom d'utilisateur</InputGroupText>
                  <Controller
                    control={control}
                    name="username"
                    defaultValue={username}
                    render={({ field }) => <Input {...field} bsSize="lg" />}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup size="lg">
                  <InputGroupText>Rôle</InputGroupText>
                  <Controller
                    control={control}
                    name="roles"
                    defaultValue={roles}
                    render={({ field }) => (
                      <Input
                        type="select"
                        className="form-select"
                        {...field}
                        bsSize="lg"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </Input>
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
                    defaultValue={getUserLanguage(language)}
                    render={({ field }) => (
                      <Input
                        type="select"
                        className="form-select"
                        {...field}
                        bsSize="lg"
                      >
                        {languages.map((option) => (
                          <option key={option.name}>{option.name}</option>
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
export default UpdateUserModal;
