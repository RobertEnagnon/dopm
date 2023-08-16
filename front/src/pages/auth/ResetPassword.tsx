import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  FormGroup,
  FormText,
  Input,
  InputGroup,
  Label,
  Row,
  Spinner,
} from "reactstrap";
import { forgetPassword } from "../../services/auth";
import { Link } from "react-router-dom";

type SC = {
  email: string;
};
const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [state, setSate] = useState({
    email: "",
    send: false,
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<SC>();
  const handleLogin: SubmitHandler<SC> = async ({ email }) => {
    setLoading(true);
    forgetPassword(email)
      .then((res: any) => {
        setLoading(false);
        if (res.data.message) {
          toast.success(res.data.message);
          setSate((s) => {
            return {
              ...s,
              send: true,
              email: email,
            };
          });
        } else {
          toast.error(res.data.error);
        }
        reset({ email: "" });
      })
      .catch(() => {
        setLoading(false);
        toast.error("Une erreur est survenue !");
      });
  };

  return (
    <Container fluid style={{ paddingTop: "4%" }}>
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
      <div className="text-center mt-4">
        <h2>Réinitialiser votre mot de passe</h2>
        <p className="lead">
          {state.send
            ? "Un email vous a été envoyé"
            : "Entrer votre adresse mail"}
        </p>
      </div>
      <Row className="justify-content-md-center h-100">
        <Col md={5}>
          <Card>
            {!state.send ? (
              <>
                <CardBody>
                  <form
                    className="m-sm-4 "
                    method="post"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <FormGroup
                      className="w-75"
                      style={{ paddingTop: "5%", margin: "auto" }}
                    >
                      <Label for="email">Entrer votre email</Label>
                      <InputGroup>
                        <Controller
                          control={control}
                          name="email"
                          rules={{ required: "Specifiez votre email" }}
                          render={({ field }) => (
                            <>
                              <Input
                                {...field}
                                type="email"
                                invalid={
                                  errors[field.name]?.message ? true : false
                                }
                                id="email"
                              />
                            </>
                          )}
                        />
                      </InputGroup>
                      {errors.email && (
                        <FormText color="danger">
                          {errors.email.message}
                        </FormText>
                      )}
                    </FormGroup>
                    <FormGroup>
                      <Button
                        type="submit"
                        color="primary"
                        size="lg"
                        disabled={loading}
                        onClick={handleSubmit(handleLogin)}
                        className="d-flex align-items-center m-auto"
                      >
                        Réinitialiser
                        {loading && (
                          <Spinner
                            color="light"
                            size="sm"
                            children=""
                            className="ml-2"
                          />
                        )}
                      </Button>
                    </FormGroup>
                    <div className="mt-3 mb-1 d-flex justify-content-center">
                      <Link to="/">Se connecter</Link>
                    </div>
                  </form>
                </CardBody>
              </>
            ) : (
              <>
                <CardBody>
                  <div className="d-flex flex-column align-items-center pt-4">
                    <FontAwesomeIcon
                      icon={faCircleCheck}
                      fixedWidth
                      size="7x"
                      className="align-middle"
                      color="#07bc0c"
                    />
                    <p className="mt-4">
                      Veuillez vérifier votre boîte de réception
                    </p>
                    <p className="font-weight-bold">{state.email}</p>
                  </div>
                </CardBody>
              </>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ResetPassword;
