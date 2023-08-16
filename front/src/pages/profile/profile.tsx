import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../layout";

import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import moment from "moment";
import { Controller, useForm } from "react-hook-form";
import { useUser } from "../../components/context/user.context";
import Header from "../../components/layout/header";
import HeaderTitle from "../../components/layout/headerTitle";
import type { User } from "../../models/user";
import { UpdateProfilePicture, UpdateUser } from "../../services/user";
import ChangePass from "./ChangePass";
import { ToastContainer } from "react-toastify";
import { notify, NotifyActions } from "../../utils/dopm.utils";
import DropZone from "../../components/common/drop-zone/DropZone";
import defaultImgPreview from "../../assets/img/avatars/avatar.webp";

const Profile = () => {
  const PUBLIC_URL = process.env.REACT_APP_PUBLIC_URL;
  const userContext = useUser();
  // const navigate = useNavigate();
  let currentUser: User = userContext.currentUser;

  const [file, setFile] = useState<any>();
  const [preview, setPreview] = useState<string>(
    `${PUBLIC_URL}${currentUser.url}` || defaultImgPreview
  );
  const [loading, setLoading] = useState(false);

  const {
    id,
    username,
    createdAt,
    firstname,
    lastname,
    email,
    function: fonction,
    roles,
    language
  } = currentUser;

  const formSchema = Yup.object().shape({
    email: Yup.string()
      .required("Entrer l'adresse mail")
      .email("Adresse mail invalide"),
    function: Yup.string().required("Entrer la fonction"),
    username: Yup.string().required("Entrer le nom d'utilisateur "),
  });

  // modifyPassword() {
  //   console.log("modifyPassword")
  //   return <Link to="/auth/reset-password"/>
  // }

  const validationOpt = { resolver: yupResolver(formSchema) };
  const { handleSubmit, control, formState } = useForm(validationOpt);
  const { errors } = formState;

  const handleProfile = async (data: any) => {
    setLoading(true);
    try {
      let url = currentUser.url;
      if (file) {
        const response = await UpdateProfilePicture(id, file);
        url = response?.data?.user?.url;
      }
      const response = await UpdateUser({ ...data, id, roles, language });
      if (response?.status === 201) {
        const newUser = { ...currentUser, ...data, url };
        setLoading(false);
        notify(
          'Profil mis à jour.',
          NotifyActions.Successful
        );
        userContext.setCurrentUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));
      }
    } catch (e) {
      setLoading(false);
      notify(
        'Erreur lors de la mise à jour.',
        NotifyActions.Error
      );
    }
  };

  const uploadSingleFile = async (file: File) => {
    setFile(file);
  };

  useEffect(() => {
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  }, [file]);

  return (
    <>
      <Layout>
        <ToastContainer
          position="top-right"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Container fluid>
          <Header>
            <HeaderTitle>Profil</HeaderTitle>
            <Breadcrumb>
              <BreadcrumbItem>
                <Link to="/">NavBar</Link>
              </BreadcrumbItem>
              <BreadcrumbItem active>Profil</BreadcrumbItem>
            </Breadcrumb>
          </Header>
          <Card>
            <CardBody>
              <div className="m-sm-4">
                <div className="container">
                  <h3 style={{ fontWeight: "bold" }}>
                    Profil de {" "}
                    {firstname &&
                      firstname[0].toUpperCase() + firstname?.slice(1)}{" "}
                    {lastname?.toUpperCase()} ({username})
                  </h3>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label
                          size={"lg"}
                          style={{
                            marginTop: "0.7rem",
                            marginBottom: 0,
                            paddingBottom: 0,
                            fontWeight: "bold",
                          }}
                        >
                          Créé le :{" "}
                        </Label>
                        <Input
                          bsSize="lg"
                          type="text"
                          name="created_at"
                          className="w-50"
                          placeholder=""
                          defaultValue={moment(createdAt).format("DD/MM/YYYY")}
                          disabled
                        />
                        <Label
                          size={"lg"}
                          style={{
                            marginTop: "0.7rem",
                            marginBottom: 0,
                            paddingBottom: 0,
                            fontWeight: "bold",
                          }}
                        >
                          Rôle :{" "}
                        </Label>
                        <Input
                          bsSize="lg"
                          type="text"
                          name="roles"
                          className="w-50"
                          placeholder=""
                          defaultValue={currentUser.roles}
                          disabled
                        />
                        <Input
                          type="hidden"
                          bsSize="lg"
                          name="language"
                          className="w-50"
                          placeholder=""
                          defaultValue={currentUser.language}
                          disabled
                        />
                        <Label
                          size={"lg"}
                          style={{
                            marginTop: "0.7rem",
                            marginBottom: 0,
                            paddingBottom: 0,
                            fontWeight: "bold",
                          }}
                        >
                          Prénom :{" "}
                        </Label>
                        <Input
                          bsSize="lg"
                          type="text"
                          name="firstname"
                          className="w-75"
                          placeholder=""
                          defaultValue={firstname}
                          disabled
                        />
                        <Label
                          size={"lg"}
                          style={{
                            marginTop: "0.7rem",
                            marginBottom: 0,
                            paddingBottom: 0,
                            fontWeight: "bold",
                          }}
                        >
                          Nom :{" "}
                        </Label>
                        <Input
                          bsSize="lg"
                          type="text"
                          name="lastname"
                          className="w-75"
                          placeholder=""
                          defaultValue={lastname}
                          disabled
                        />
                        <Label
                          size={"lg"}
                          style={{
                            marginTop: "0.7rem",
                            marginBottom: 0,
                            paddingBottom: 0,
                            fontWeight: "bold",
                          }}
                        >
                          Fonction :{" "}
                        </Label>
                        <Controller
                          control={control}
                          name="function"
                          defaultValue={fonction}
                          render={({ field }) => (
                            <>
                              <Input
                                {...field}
                                invalid={
                                  errors[field.name]?.message ? true : false
                                }
                              />
                              <FormFeedback>
                                {errors[field.name]?.message}
                              </FormFeedback>
                            </>
                          )}
                        />
                        <Label
                          size={"lg"}
                          style={{
                            marginTop: "0.7rem",
                            marginBottom: 0,
                            paddingBottom: 0,
                            fontWeight: "bold",
                          }}
                        >
                          Login :{" "}
                        </Label>
                        <Controller
                          control={control}
                          name="username"
                          defaultValue={username}
                          render={({ field }) => (
                            <>
                              <Input
                                {...field}
                                invalid={
                                  errors[field.name]?.message ? true : false
                                }
                              />
                              <FormFeedback>
                                {errors[field.name]?.message}
                              </FormFeedback>
                            </>
                          )}
                        />
                        <Label
                          size={"lg"}
                          style={{
                            marginTop: "0.7rem",
                            marginBottom: 0,
                            paddingBottom: 0,
                            fontWeight: "bold",
                          }}
                        >
                          Email :{" "}
                        </Label>
                        <Controller
                          control={control}
                          name="email"
                          defaultValue={email}
                          render={({ field }) => (
                            <>
                              <Input
                                {...field}
                                invalid={
                                  errors[field.name]?.message ? true : false
                                }
                              />
                              <FormFeedback>
                                {errors[field.name]?.message}
                              </FormFeedback>
                            </>
                          )}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={{ size: 5, offset: 1 }}>
                      <FormGroup>
                        <Label
                          for="file-input"
                          size={"lg"}
                          style={{ marginTop: "0.7rem", fontWeight: "bold" }}
                        >
                          Photo de profil :
                          <img
                            src={preview}
                            className="img-fluid rounded-circle mx-auto"
                            style={{
                              width: "25rem",
                              height: "25rem",
                              marginTop: "1rem",
                            }}
                            alt="Avatar"
                            onError={(event: any) => event.target.src = defaultImgPreview}
                          />
                        </Label>
                        <DropZone
                          fileType={["JPG", "PNG", "JPEG", "WEPB"]}
                          maxSize={4}
                          onHandleFile={uploadSingleFile}
                          maxSizeOutput={0.5}
                          colorPrimary="#3b7ddd"
                          colorError="crimson"
                          colorText="#3e4676"
                        >
                          Selectionner un fichier
                        </DropZone>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Form onSubmit={handleSubmit(handleProfile)}>
                    <div className="text-center mt-5 mb-1">
                      <Button color="primary" size="lg" disabled={loading}>
                        {loading && (
                          <span className="spinner-border spinner-border-sm"></span>
                        )}
                        Mettre à jour
                      </Button>
                    </div>
                  </Form>
                </div>

                {/* TODO: Update password */}

                <div className="text-center mt-4 mb-1">
                  <ChangePass />
                </div>
              </div>
            </CardBody>
          </Card>
        </Container>
      </Layout>
    </>
  );
};

export default Profile;
