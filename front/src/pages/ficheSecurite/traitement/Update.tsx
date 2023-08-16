import { ChangeEvent, useEffect, useMemo, useState } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
} from "reactstrap";
import { Grid } from "@material-ui/core";
import { CameraDialog } from "../../../components/common";
import { FicheAdd } from "../../../models/fiche";
import Categories from "../creation/components/categories";
import Sender from "../creation/components/sender";
import Services from "../creation/components/services";
import Zones from "../creation/components/zones";
import Description from "../creation/components/description";
import SafetyApplied from "../creation/components/safetyApplied";
import SafetyProposal from "../creation/components/safetyProposal";
import Status from "./components/status";
import Classification from "./components/classification";
import { useResponsible } from "../../../hooks/responsible";
import Images from "../creation/components/images";
import { UploadFile } from "../../../services/FicheSecurite/ficheSecurity";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from "yup";
import { CompressFile } from "../../../components/common/drop-zone/DropZone";

type FormEditType = { onSubmit: SubmitHandler<FicheAdd>, initialValues: FicheAdd, imageChange: Function }

const api = process.env.REACT_APP_PUBLIC_URL

export default function FormEdit(props: FormEditType) {
  const {
    onSubmit,
    initialValues,
    imageChange
  } = props;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const validationSchema = Yup.object({
    fsCategoryId: Yup.string().required("Le champs Catégorie est obligatoire"),
    senderFirstname: Yup.string().required(
      "Le champs Prénom est obligatoire"
    ),
    senderLastname: Yup.string().required(
      "Le champs Nom est obligatoire"
    ),
    serviceId: Yup.string().required("Le champs Service est obligatoire!"),
    teamId: Yup.string().required("Le champs Equipe est obligatoire!"),
    zoneId: Yup.string().required("Le champs Zone est obligatoire!"),
    subzoneId: Yup.string().required("Le champs sous-zones est obligatoire!!"),
    description: Yup.string().required(
      "Le champs Description est obligatoire!"
    ),
    mesureSecurisation: Yup.string().required("Action is required!"),
    responsibleSecuriteId: Yup.string().required("Responsible is required!"),

    classificationId: Yup.string().required("Le champs classification est obligatoire!"),
    status: Yup.string().required("Le champs status est obligatoire!"),

    responsibleConservatoireId: Yup.string().required(
      "Le champs responsable est obligatoire"
    ),
    mesureConservatoire: Yup.string().required(
      "Le champs mesure proposé est obligatoire!"
    ),
    deadLineConservatoire: Yup.date().required(
        "La date limite est obligatoire!"
    )/*.min(
      today,
      "La date limite ne doit pas être dans le passé!"
    )*/,
    image1: Yup.string().nullable(),
    image2: Yup.string().nullable(),
    image3: Yup.string().nullable(),
    commentaireStatus: Yup.string().nullable(),
  });

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    watch,
    resetField,
  } = useForm<FicheAdd>({
    resolver: yupResolver(validationSchema)
  });

  const [submitted, setSubmitted] = useState<boolean>(false);
  const { responsibles, addResponsible } = useResponsible();
  const [imageToChange, setImageToChange] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const switchImage = (index: number, url: string) => {
    switch (index) {
      case 1:
        setValue("image1", url);
        break;
      case 2:
        setValue("image2", url);
        break;
      case 3:
        setValue("image3", url);
        break;
    }
  }
  const initialImgTab = useMemo(() => {
    return [
      initialValues.image1? api + initialValues.image1: '',
      initialValues.image2? api + initialValues.image2: '',
      initialValues.image3? api + initialValues.image3: ''
    ]
  }, [initialValues])
  /**
   * Ce tableau contient les liens de preview pour les images
   */
  const [previewImg, setPreviewImg] = useState<string[]>(initialImgTab)
  useEffect(() => {
    /**
     * Ici on initialise les liens pour les preview des images
     * Sans oublier d'ajouter le chemin du backend avant
     */
    setPreviewImg(() => {
      return previewImg.map((el, k) => {
        if(k === 0) return initialValues.image1? (api + initialValues.image1): ''
        else if (k === 1) return initialValues.image2? (api + initialValues.image2): ''
        else return initialValues.image3? (api + initialValues.image3): ''
      })
    })
  }, [initialImgTab])


  const handleCameraClose = async (image: File, index: number) => {
    /**
     * Les images de ficheSecurite sont dans
     * le sous dossier fichesecurite du back
     */
    const response = await UploadFile(image, 'fichesecurite')
    imageChange(response.url, index);
    switchImage(index, response?.url)
    setPreviewImg(() => {
      return previewImg.map((el: string, k: number) => {
        /**
         * On genere un lien pour la preview de l'image
         */
        if(k === index - 1) return URL.createObjectURL(image)
        else return el
      })
    })
  }
  const handleFileUpload = async (event: ChangeEvent, index: number) => {
    const element = event.target as HTMLInputElement;
    if (element?.files && element.files[0]) {
      const file = element.files[0]
      const compImg = await CompressFile({file: file, maxSizeOutput: 0.5})
      if(!(compImg instanceof Error)){
        /**
         * Les images de ficheSecurite sont dans
         * le sous dossier fichesecurite du back
         */
        const response = await UploadFile(compImg.file, 'fichesecurite')
        imageChange(response?.url, index)
        switchImage(index, response?.url)
        setPreviewImg(() => {
          return previewImg.map((el: string, k: number) => {
            /**
             * On genere un lien pour la preview de l'image
             */
            if(k === index - 1) return URL.createObjectURL(compImg.file)
            else return el
          })
        })
      }else{
        const response = await UploadFile(file)
        imageChange(response?.url, index)
        switchImage(index, response?.url)
      }
    }
  }

  return (
    <>
      <CameraDialog
        open={isDialogOpen}
        handleClose={(image: File) => {
          if (image instanceof File) {
            handleCameraClose(image, imageToChange);
          }
          setIsDialogOpen(false);
        }}
      />
      <Row>
        <Col md={{ size: 12, offset: 0 }}>
          <Card>
            <CardBody>
              <form
                onSubmit={handleSubmit((data) => {
                  onSubmit(data);
                }, () => {
                  setSubmitted(true);
                })}
              >
                <Row>
                  <Col md={6} className="border-right ">
                    <Categories watch={watch} control={control} errors={errors} submitted={submitted} values={initialValues} setValue={setValue} />
                    <Sender control={control} errors={errors} submitted={submitted} values={initialValues} edit={true} setValue={setValue} />
                    <Services control={control} errors={errors} submitted={submitted} values={initialValues} setValue={setValue} />
                    <Zones watch={watch} control={control} errors={errors} submitted={submitted} values={initialValues} setValue={setValue} />
                    <Description control={control} errors={errors} submitted={submitted} values={initialValues} setValue={setValue} watch={watch} />
                  </Col>

                  <Col md="6">
                    <Grid container direction="row" justifyContent="center" alignItems="center" spacing={1}>
                      <Grid item xs={12} md={12} lg={6}>
                        <SafetyApplied responsibleSecurites={responsibles} addResponsible={addResponsible} control={control} errors={errors} submitted={submitted} values={initialValues} setValue={setValue} />
                      </Grid>
                      <Grid item xs={12} md={12} lg={6}>
                        <SafetyProposal responsibleConservatoires={responsibles} resetField={resetField} control={control} errors={errors} submitted={submitted} values={initialValues} setValue={setValue} />
                      </Grid>
                    </Grid>

                    <h3 style={{ paddingTop: "8px" }}>Traitement :</h3>
                    <Grid container direction="column" justifyContent="center" alignItems="flex-start" spacing={1}>
                      <Status watch={watch} control={control} errors={errors} submitted={submitted} values={initialValues} setValue={setValue} />
                      <Grid
                        item
                        container
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="center"
                        xs={12}
                      >
                        <Grid item xs={12}>
                          <Classification control={control} errors={errors} submitted={submitted} values={initialValues} setValue={setValue} />
                        </Grid>
                      </Grid>
                    </Grid>

                    <Images previewImg={previewImg} watch={watch} values={initialValues} control={control} setImageToChange={setImageToChange} handleFileUpload={handleFileUpload} setIsDialogOpen={setIsDialogOpen} setValue={setValue} />

                    <Grid
                      container
                      direction="row"
                      justifyContent="flex-end"
                      alignItems="flex-end"
                    >
                      <Grid item>
                        <button
                          type="submit"
                          className="btn btn-primary"
                        // disabled={!isValid}
                        >
                          Enregistrer
                        </button>
                      </Grid>
                    </Grid>
                  </Col>
                </Row>
              </form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
}
