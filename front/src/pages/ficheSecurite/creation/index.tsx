import { useEffect, useState } from "react";
import { Form } from "./Creation";
import { FicheAdd } from "../../../models/fiche";
import { notify, NotifyActions } from "../../../utils/dopm.utils";
import { AddFiche } from "../../../services/FicheSecurite/ficheSecurity";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { Language } from "../../../services/enums/Language";
import { permissionsList } from "../../../models/Right/permission";
import { useUser } from "../../../components/context/user.context";
import { useDopm } from "../../../components/context/dopm.context";
import FormMobile from "../ui-phone/creation/Creation";
import {useFicheSecurity} from "../../../hooks/FicheSecurite/ficheSecurity";

const initialValues: FicheAdd = {
  id_fs: "",
  serviceId: -1,
  teamId: -1,
  zoneId: -1,
  subzoneId: -1,
  responsibleSecuriteId: -1,
  assignationId: -1,
  description: "",
  classificationId: -1,
  fsCategoryId: -1,
  senderFirstname: "",
  senderLastname: "",
  mesureSecurisation: "",
  mesureConservatoire: "",
  status: "",
  image1: "",
  image2: "",
  image3: "",
  commentaireStatus: "",
};

const today = new Date();
today.setHours(0, 0, 0, 0);

const AddFicheSecurityForm = () => {
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState<Language>(i18n.language as Language);
  const userContext = useUser();
  const dopmContext = useDopm();
  const fichesSecurity = useFicheSecurity();
  const currentPermissions = {
    ajoutFicheSecurite: userContext.checkAccess(
      permissionsList.ajoutFicheSecurite
    ),
  };

  useEffect(() => {
    //Langue par défaut
    const currentLang = localStorage.getItem("lang") || "french";
    i18n.changeLanguage(currentLang);
    setLang(i18n.language as Language);
  }, []);
  if (JSON.stringify(lang) === "{}") {
    i18n.changeLanguage(Language.FR);
  }

  const validationSchema = Yup.object({
    fsCategoryId: Yup.number().min(1, t("ficheSecuriteCreation.yup1")),
    senderFirstname: Yup.string().required(t("ficheSecuriteCreation.yup2")),
    senderLastname: Yup.string().required(t("ficheSecuriteCreation.yup3")),
    serviceId: Yup.number().min(1, t("ficheSecuriteCreation.yup4")),
    teamId: Yup.number().min(1, t("ficheSecuriteCreation.yup5")),
    zoneId: Yup.number().min(1, t("ficheSecuriteCreation.yup6")),
    subzoneId: Yup.number().min(1, t("ficheSecuriteCreation.yup7")),
    responsibleSecuriteId: Yup.number().min(
      1, t("ficheSecuriteCreation.yup8")
    ),
    description: Yup.string().required(t("ficheSecuriteCreation.yup9")),
    mesureSecurisation: Yup.string().required(t("ficheSecuriteCreation.yup10")),
    responsibleConservatoireId: Yup.number(),
    mesureConservatoire: Yup.string(),
    image1: Yup.string(),
    image2: Yup.string(),
    image3: Yup.string(),

    deadLineConservatoire: Yup.date()/*.min(
      today,
      t("ficheSecuriteCreation.yup11")
    )*/,
  });

  const [image1, setImage1] = useState<string>("");
  const [image2, setImage2] = useState<string>("");
  const [image3, setImage3] = useState<string>("");

  const handleImageChange = (url: string, id: number) => {
    if (id === 1) {
      setImage1(url);
    }
    if (id === 2) {
      setImage2(url);
    }
    if (id === 3) {
      setImage3(url);
    }
  };

  // add fiche security function
  const handleAddFicheSecurity = (fs: FicheAdd) => {
    console.log("fs", fs);

    // console.log(fichesSecurity.fiches[0].createdAt?.getFullYear());
    const currentYear = new Date().getFullYear();

    let currentYearFiches = fichesSecurity.fiches?.filter(fs => fs.createdAt?.getFullYear() === currentYear);
    currentYearFiches?.sort((a, b) => {
      return a.id - b.id;
    });

    const lastFicheNumber = currentYearFiches[currentYearFiches.length-1]?.id_fs?.slice(5);
    const id_fs = `${currentYear}-${lastFicheNumber ? parseInt(lastFicheNumber)+1 : 1}`

    AddFiche({ ...fs, id_fs, image1, image2, image3 }).then((response) => {
      notify(
        t("ficheSecuriteCreation.add1") +
          " " + id_fs + " " +
          t("ficheSecuriteCreation.add2"),
        NotifyActions.Successful
      );
      if (response.fs === undefined) {
        notify(response.message, NotifyActions.Error);
      }
    });
  };

  return currentPermissions?.ajoutFicheSecurite ? (
    <>
      {dopmContext.isMobileDevice ? (
        <FormMobile
          imageChange={handleImageChange}
          initialValues={initialValues}
          onSubmit={handleAddFicheSecurity}
          validationSchema={validationSchema}
        />
      ) : (
        <Form
          imageChange={handleImageChange}
          initialValues={initialValues}
          onSubmit={handleAddFicheSecurity}
          validationSchema={validationSchema}
        />
      )}
    </>
  ) : (
    <p className="alert-panel">Permission insuffisante</p>
  );
};

export default AddFicheSecurityForm;
