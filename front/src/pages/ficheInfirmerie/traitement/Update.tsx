import { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
} from "reactstrap";
import { Grid } from "@material-ui/core";
import { CameraDialog } from "../../../components/common";
import Status from "./components/status";
import Assignation from "./components/assignation";
import Classification from "./components/classification";
import { useResponsible } from "../../../hooks/responsible";
import { UploadFile } from "../../../services/FicheSecurite/ficheSecurity";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from "yup";
import { CompressFile } from "../../../components/common/drop-zone/DropZone";
import { useTranslation } from "react-i18next";
import InjuredCategoryBloc from "../creation/components/InjuredCategory";
import Sender from "../creation/components/Sender";
import Zones from "../creation/components/Zones";
import AccidentDetails from "../creation/components/AccidentDetails";
import LesionDetailsBloc from "../creation/components/LesionDetails";
import Care from "../creation/components/Care";
import Image from "../creation/components/Image";
import { FicheInfAdd } from "../../../models/ficheinf";
import DrawLesion from "../creation/components/drawLesion";

type FormEditType = { onSubmit: SubmitHandler<FicheInfAdd>, initialValues: FicheInfAdd, imageChange: Function }

const api = process.env.REACT_APP_PUBLIC_URL

export default function FormEdit(props: FormEditType) {
  const {
    onSubmit,
    initialValues,
    imageChange
  } = props
  
  const { t } = useTranslation()
  const today = new Date()
  today.setHours(0, 0, 0, 0) 

  const validationSchema = Yup.object({
    injuredCategoryId: Yup.string().required(t("ficheInfirmerieCreation.yup1")),
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
    assignationId: Yup.number().nullable().required("Le champs Assignation est Obligatoire!"),
    classificationId: Yup.number().nullable().required("Le champs classification est obligatoire!"),
    commentaireStatus: Yup.string().nullable(),
  })

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    watch,
    resetField,
  } = useForm<FicheInfAdd>({
    resolver: yupResolver(validationSchema)
  });

  const [submitted, setSubmitted] = useState<boolean>(false)
  const { responsibles } = useResponsible()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const canvas = useRef<HTMLCanvasElement>(null)

  /**
   * Ceci contient le lien de preview pour l'image
   */
  const [previewImg, setPreviewImg] = useState<string>('')
  useEffect(() => {
    /**
     * Ici on initialise le lien pour la preview de l'image
     * Sans oublier d'ajouter le chemin du backend avant
     */
    setPreviewImg(initialValues.image1? (api + initialValues.image1): '')
  }, [initialValues.image1])


  const handleCameraClose = async (image: File) => {
    /**
     * Les images de ficheInfirmerie sont dans
     * le sous dossier ficheInfirmerie du back
     */
     const response = await UploadFile(image, 'ficheinfirmerie')
     imageChange(response.url)
     setValue("image1", response?.url)
     setPreviewImg(URL.createObjectURL(image))
  }
  const handleFileUpload = async (event: ChangeEvent) => {
    const element = event.target as HTMLInputElement;
    if (element?.files && element.files[0]) {
      const file = element.files[0]
      const compImg = await CompressFile({file: file, maxSizeOutput: 0.5})
      if(!(compImg instanceof Error)){
        /**
         * Les images de ficheInfirmerie sont dans
         * le sous dossier ficheInfirmerie du back
         */
        const response = await UploadFile(compImg.file, 'ficheinfirmerie')
        imageChange(response?.url)
        setValue("image1", response?.url);
        setPreviewImg(URL.createObjectURL(compImg.file))
      }else{
        const response = await UploadFile(file)
        imageChange(response?.url)
        setValue("image1", response?.url)
        setPreviewImg(URL.createObjectURL(file))
      }
    }
  }
  const convertCanvasAndSubmit = (data: FicheInfAdd) => {
    canvas?.current?.toBlob(async (blob) => {
        let convertBlob: any = blob
        convertBlob.name = 'lesions.png'
        convertBlob.lastModified = new Date()

      const file = new File([convertBlob], 'image.png', {
        type: convertBlob.type
      })
      const response = await UploadFile(file, 'ficheinfirmerie')
      setValue("lesionImage", response?.url)
      onSubmit({...data, lesionImage: response?.url})
    })
  }

  return (
    <>
      <CameraDialog
        open={isDialogOpen}
        handleClose={(image: File) => {
          if (image instanceof File) {
            handleCameraClose(image);
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
                  convertCanvasAndSubmit(data)
                }, () => {
                  setSubmitted(true);
                })}
              >
                <Row>

                  <Col md={6} className="border-right">
                    <InjuredCategoryBloc watch={watch} control={control} errors={errors} submitted={submitted} values={initialValues} setValue={setValue} />
                    <Sender control={control} errors={errors} submitted={submitted} values={initialValues} setValue={setValue} responsibleConservatoires={responsibles} resetField={resetField} />
                    <Zones watch={watch} control={control} errors={errors} submitted={submitted} values={initialValues} setValue={setValue} resetField={resetField}/>
                    <AccidentDetails control={control} errors={errors} submitted={submitted} values={initialValues} setValue={setValue} watch={watch}/>
                  </Col>

                  <Col md="6" style={{ paddingLeft: "15px" }}>
                    <Row>
                        <Col md={6}>
                            <LesionDetailsBloc control={control} errors={errors} submitted={submitted} values={initialValues} setValue={setValue} watch={watch}/>
                        </Col>
                        <Col md={6}>
                          {initialValues.createdAt && <DrawLesion imgModel={require('../../../assets/img/dopm/human.png')} ref={canvas} defaultImage={initialValues.lesionImage}/>}
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Care watch={watch} control={control} errors={errors} submitted={submitted} values={initialValues} setValue={setValue} />
                        </Col>
                        <Col md={6} className="d-flex align-items-center">
                            <Image watch={watch} values={initialValues} control={control} handleFileUpload={handleFileUpload} setValue={setValue} previewImg={previewImg} setIsDialogOpen={setIsDialogOpen}/>
                        </Col>
                    </Row>

                    <h3 style={{ paddingTop: "8px" }}>Traitement :</h3>
                    <Grid container direction="column" justifyContent="center" alignItems="flex-start" spacing={1}>
                      <Status watch={watch} control={control} errors={errors} submitted={submitted} values={initialValues} setValue={setValue} />
                      <Grid item xs={12} md={4}>
                        <Assignation responsibles={responsibles} control={control} errors={errors} submitted={submitted} values={initialValues} setValue={setValue} />
                      </Grid>
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

                    <Row>
                        <Grid container direction="row" justifyContent="flex-end" alignItems="flex-end" style={{ marginTop: "20px" }}>
                            <Grid item>
                                <button type="submit" className="btn btn-primary">
                                    {t("ficheInfirmerieCreation.save")}
                                </button>
                            </Grid>
                        </Grid>
                    </Row>

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
