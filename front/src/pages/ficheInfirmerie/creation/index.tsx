import { useEffect, useState } from "react";
import { Form } from "./Creation";
import { FicheInfAdd } from "../../../models/ficheinf";
import { notify, NotifyActions } from "../../../utils/dopm.utils";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { Language } from "../../../services/enums/Language";
import {permissionsList} from "../../../models/Right/permission";
import {useUser} from "../../../components/context/user.context";
import { AddFicheInf } from "../../../services/FicheInfirmerie/ficheInfirmerie";
import {useFicheInfirmerie} from "../../../hooks/FicheInfirmerie/ficheInfirmerie";
import {useDopm} from "../../../components/context/dopm.context";
import {FormMobile} from "../ui-phone/creation/Creation";

const defaultDate = () => new Date()

const today = new Date();
today.setHours(0, 0, 0, 0);

const AddFicheSecurityForm = () => {
  const { t, i18n } = useTranslation();
  const { fiches } = useFicheInfirmerie();
  const [lang, setLang] = useState<Language>(i18n.language as Language);
  const userContext = useUser();
  const dopmContext = useDopm();
  const currentPermissions = {
    ajoutFicheInf: userContext.checkAccess(permissionsList.ajoutFicheInf)
  }
  const [initialValues, setInitialValues] = useState<FicheInfAdd>({
    injuredCategoryId: -1,
    injuredCategoryName: "",
    senderFirstname: "",
    senderLastname: "",
    post: "",
    responsibleSecuriteId: -1,
    serviceId: -1,
    teamId: -1,
    dateAccident: defaultDate().toLocaleDateString().split('/').reverse().join('-'),
    hourAccident: `${defaultDate().getHours()}:${defaultDate().getMinutes().toString().padStart(2, '0')}`,
    zoneId: -1,
    subzoneId: -1,
    circumstances: "",
    materialElementsId: -1,
    lesionDetailsId: -1,
    careProvidedId: -1,
    caregiver: "",
    careGived: "",
    image1: "",
    status: "",
    commentaireStatus: "",
    lesionImage: ""
  })

  useEffect(() => {
    //Langue par défaut
    const currentLang = localStorage.getItem("lang") || "french"
    i18n.changeLanguage(currentLang);
    setLang(i18n.language as Language)
  }, []);
  if (JSON.stringify(lang) === '{}') {
    i18n.changeLanguage(Language.FR)
  }

  const validationSchema = Yup.object({
    injuredCategoryId: Yup.string().required(t("ficheInfirmerieCreation.yup1")),
    injuredCategoryName: Yup.string(),
    senderFirstname: Yup.string().required(t("ficheInfirmerieCreation.yup2")),
    senderLastname: Yup.string().required(t("ficheInfirmerieCreation.yup3")),
    post: Yup.string().required(t("ficheInfirmerieCreation.yup4")),
    responsibleSecuriteId: Yup.string().required(t("ficheInfirmerieCreation.yup5")),
    serviceId: Yup.string().required(t("ficheInfirmerieCreation.yup6")),
    teamId: Yup.string().required(t("ficheInfirmerieCreation.yup7")),
    dateAccident: Yup.date().required(t("ficheInfirmerieCreation.yup17")),
    hourAccident: Yup.string(),
    zoneId: Yup.string().required(t("ficheInfirmerieCreation.yup9")),
    subzoneId: Yup.string().required(t("ficheInfirmerieCreation.yup10")),
    circumstances: Yup.string().required(t("ficheInfirmerieCreation.yup11")),
    materialElementsId: Yup.string().required(t("ficheInfirmerieCreation.yup12")),
    lesionDetailsId: Yup.string().required(t("ficheInfirmerieCreation.yup13")),
    careProvidedId: Yup.string().required(t("ficheInfirmerieCreation.yup14")),
    caregiver: Yup.string().required(t("ficheInfirmerieCreation.yup15")),
    careGived: Yup.string().required(t("ficheInfirmerieCreation.yup16")),
    image1: Yup.string(),
  })

  const [image1, setImage1] = useState<string>("");


  const handleImageChange = (url: string) => {
      setImage1(url);
  }

  // add fiche security function
  const handleAddFicheInfirmery = (fi: FicheInfAdd) => {
    const currentYear = new Date().getFullYear();

    let currentYearFiches = fiches.filter(fi => fi.createdAt?.getFullYear() === currentYear);
    currentYearFiches?.sort((a, b) => {
        return a.id - b.id;
    });

    const lastFicheNumber = currentYearFiches[currentYearFiches.length-1]?.id_fi?.slice(5);

    const id_fi = `${currentYear}-${lastFicheNumber ? parseInt(lastFicheNumber)+1 : 1}`

    AddFicheInf({ ...fi, id_fi, image1})
      .then((response) => {
        notify(
          t("ficheInfirmerieCreation.add1")+ " " +
            id_fi +
            " "+t("ficheInfirmerieCreation.add2"),
          NotifyActions.Successful
        )
        if (response.fi === undefined) {
          notify(response.message, NotifyActions.Error)
        }
        //reinitialisation de l'heure et de la date apres l'ajout de la fiche
        setInitialValues(i => {return {
          ...i,
          dateAccident: defaultDate().toLocaleDateString().split('/').reverse().join('-'),
          hourAccident: `${defaultDate().getHours()}:${defaultDate().getMinutes().toString().padStart(2, '0')}`,
        }})
      })
  }

  return (
      currentPermissions?.ajoutFicheInf
        ? (
            <>
              {dopmContext.isMobileDevice ? (
                 <FormMobile
                    imageChange={handleImageChange}
                    initialValues={initialValues}
                    onSubmit={handleAddFicheInfirmery}
                    validationSchema={validationSchema}
                 />
              ) : (
                  <Form
                      imageChange={handleImageChange}
                      initialValues={initialValues}
                      onSubmit={handleAddFicheInfirmery}
                      validationSchema={validationSchema}
                  />
              )}
            </>
            )
        : <p className="alert-panel">Permission insuffisante</p>

  );
}

export default AddFicheSecurityForm;
