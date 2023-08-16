import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Input,
  Label,
  Container,
  Col,
  Row,
  Spinner,
  InputGroup,
  InputGroupText,
  FormText,
} from "reactstrap";
import { Auth } from "../../services/auth";
import { User } from "../../models/user";
import { useUser } from "../../components/context/user.context";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { Language } from "../../services/enums/Language";
import defaultAvatar from "../../assets/img/avatars/avatar.webp";
import "./signin.scss";
import { useDashboard } from "../../hooks/dashboard";
import { getEnableConnection } from "../../services/ad";
import { permissionsList } from "../../models/Right/permission";

type SC = {
  username: string;
  password: string;
};

const SignIn = () => {
  const URL_LOGIN_SSO = process.env.REACT_APP_API + "/auth/login/sso";
  let { dashboards, FetchDashboards, isDashboardsFetched } = useDashboard();
  const PUBLIC_URL = process.env.REACT_APP_PUBLIC_URL;
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState<Language>(i18n.language as Language);
  const userContext = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [mask, setMask] = useState(true);

  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<SC>();

  useEffect(() => {
    //Langue par défaut de Signin
    const currentLang = localStorage.getItem("lang") || "french";
    console.log(currentLang);
    i18n.changeLanguage(currentLang);

    getCurrentConnection();
  }, []);

  useEffect(() => {
    userContext.checkToken().then((isAllowed: boolean) => {
      if (isAllowed && isDashboardsFetched) {
        const allowedDashboards = dashboards.filter(dashboard =>
          userContext.checkAccess(permissionsList.parametrageDashboard, undefined, undefined, dashboard.id)
          || userContext.checkAccess(permissionsList.lectureDashboard, undefined, undefined, dashboard.id))
        navigate(`/dashboard/${allowedDashboards.length === 0 ? 'undefined' : allowedDashboards[0].id}`);
      }
    });
  }, [dashboards, isDashboardsFetched]);

  if (JSON.stringify(lang) === "{}") {
    i18n.changeLanguage(Language.FR);
  }

  const getCurrentConnection = async () => {
    // check si une connexion AD existe
    const connection = await getEnableConnection();
    if (connection) {
      if (!localStorage.getItem("authToken"))
        window.location.replace(URL_LOGIN_SSO); // connexion automatique à l'AD
    }
  };

  const setToken = async (ok: boolean, response: string, user?: User) => {
    localStorage.setItem("authToken", response);
    if (ok) {
      //Set token
      localStorage.setItem("authToken", response);
      if (user) {
        console.log(user.language);
        if (user.language == "2") {
          localStorage.setItem("lang", Language.EN);
          localStorage.setItem("languageName", "english");
          setLang(Language.EN);
          i18n.changeLanguage(Language.EN);
        } else if (user.language == "3") {
          localStorage.setItem("lang", Language.SP);
          localStorage.setItem("languageName", "spanish");
          setLang(Language.SP);
          i18n.changeLanguage(Language.SP);
        } else {
          localStorage.setItem("lang", Language.FR);
          localStorage.setItem("languageName", "french");
          setLang(Language.FR);
          i18n.changeLanguage(Language.FR);
        }
      }

      if (user && user.id) {
        await setUserInContext(user);
        toast.success("Connexion réussie");
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("lastuserprofileimg", JSON.stringify(user.url));
        if (!dashboards.length) {
          dashboards = await FetchDashboards();
        }
        const allowedDashboards = dashboards.filter(dashboard =>
          userContext.checkAccess(permissionsList.parametrageDashboard, undefined, undefined, dashboard.id)
          || userContext.checkAccess(permissionsList.lectureDashboard, undefined, undefined, dashboard.id))
        navigate(`/dashboard/${allowedDashboards.length === 0 ? 'undefined' : allowedDashboards[0].id}`);
      } else if (user) {
        console.log("Utilisateur non confirmé");
        toast.error("Votre compte n'est pas confirmé");
      }
    } else if (!ok) {
      toast.error(response);
    }
  };

  const setUserInContext = async (user: any) => {
    userContext.setCurrentUser(user);
    userContext.setIsConnected(true);
  }

  const handleLogin: SubmitHandler<SC> = ({ username, password }) => {
    setLoading(true);
    Auth(username, password).then(
      async (
        data: { ok: boolean; response: string; user?: User } | undefined
      ) => {
        reset({ password: "", username: "" });
        console.log(data);
        setToken(
          data?.ok || false,
          data?.response || "Erreur de connexion",
          data?.user
        );
        setLoading(false);
      }
    );
  };

  const english = () => {
    setLang(Language.EN);
    i18n.changeLanguage("english");
  };
  const french = () => {
    setLang(Language.FR);
    i18n.changeLanguage("french");
  };
  const spain = () => {
    setLang(Language.SP);
    i18n.changeLanguage("spanish");
  };

  const lastImageUsed = localStorage.getItem("lastuserprofileimg");
  const imgAdress =
    PUBLIC_URL! + lastImageUsed?.substring(1, lastImageUsed.length - 1);

  return (
    <Container fluid className="" style={{ paddingTop: "2%" }}>
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
      <div className="text-center mt-4 mb-2">
        <h1 style={{
          letterSpacing: "5px",
          marginBottom: "0",
          fontSize: "2.3rem"
        }}>{t("signIn.appName")}</h1>
        <p className="text-muted">{t("signIn.appDescription")}</p>
      </div>
      <Row className="flex justify-content-center mb-3">
        <img
          onClick={() => french()}
          src={"/img/France.webp"}
          alt="Français"
          className="drapeaux mx-2"
        />
        <img
          onClick={() => english()}
          src={"/img/Angleterre.webp"}
          alt="Français"
          className="drapeaux mx-2"
        />
        <img
          onClick={() => spain()}
          src={"/img/Spain.webp"}
          alt="Français"
          className="drapeaux mx-2"
        />
      </Row>
      <Row className="justify-content-md-center h-100">
        <Col md={5}>
          <Card>
            <CardBody>
              {/*<div className="text-center mt-2 mb-2">*/}
              {/*  <p>{t("signIn.connect")}</p>*/}
              {/*</div>*/}

              <form className="m-sm-4 " onSubmit={(e) => e.preventDefault()}>
                <div className="text-center">
                  <img
                    src={imgAdress}
                    alt="profileImage"
                    className="img-fluid rounded-circle"
                    style={{
                      height: "8rem",
                      width: "8rem",
                    }}
                    onError={(e: any) => (e.target.src = defaultAvatar)}
                  />
                </div>
                <FormGroup
                  className="mx-auto w-50"
                  style={{ paddingTop: "5%" }}
                >
                  <Label for="user">{t("signIn.username")}</Label>
                  <InputGroup>
                    <Controller
                      control={control}
                      name="username"
                      rules={{ required: t("signIn.specifierUser") }}
                      render={({ field }) => (
                        <>
                          <Input
                            {...field}
                            type="text"
                            invalid={errors[field.name]?.message ? true : false}
                            id="user"
                          />
                        </>
                      )}
                    />
                  </InputGroup>
                  {errors.username && (
                    <FormText color="danger">
                      {errors.username.message}
                    </FormText>
                  )}
                </FormGroup>
                <FormGroup className="mx-auto w-50">
                  <Label for="pass">{t("signIn.password")}</Label>
                  <InputGroup>
                    <Controller
                      control={control}
                      name="password"
                      rules={{ required: t("signIn.specifierMdp") }}
                      render={({ field }) => (
                        <>
                          <Input
                            {...field}
                            type={mask ? "password" : "text"}
                            invalid={errors[field.name]?.message ? true : false}
                            id="pass"
                          />
                        </>
                      )}
                    />
                    <InputGroupText onClick={() => setMask((m) => !m)}>
                      <FontAwesomeIcon
                        icon={mask ? faEye : faEyeSlash}
                        fixedWidth
                        style={{ cursor: "pointer" }}
                        className="align-middle"
                      />
                    </InputGroupText>
                  </InputGroup>
                  {errors.password && (
                    <FormText color="danger">
                      {errors.password.message}
                    </FormText>
                  )}
                </FormGroup>
                <div className="mt-3 mb-1 d-flex justify-content-center">
                  <Button
                    type="submit"
                    color="primary"
                    size="lg"
                    disabled={loading}
                    onClick={handleSubmit(handleLogin)}
                    className="d-flex align-items-center"
                  >
                    {t("signIn.login-button")}
                    {loading && (
                      <Spinner
                        color="light"
                        size="sm"
                        children=""
                        className="ml-2"
                      />
                    )}
                  </Button>
                </div>
                <div className="mt-3 mb-1 d-flex justify-content-center">
                  <Link to="/Auth/resetPassword">Mot de passe oublié?</Link>
                </div>
              </form>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <div
        style={{
          display: "flex",
          alignContent: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={require("../../assets/img/dopm/logo_sodigitale_full.png")}
          alt="logo"
          style={{
            width: "6rem",
            margin: "0.5rem 0",
          }}
        />
      </div>
      <Row className="text-muted">
        <Col xs={12} className="text-center">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} -{" "}
            <a href="https://dopm.fr/" className="text-muted">
              SoDigitale
            </a>
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default SignIn;
