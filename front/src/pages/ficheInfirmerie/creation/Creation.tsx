import { ChangeEvent, useRef, useState } from "react";
import { Card, CardBody, Col, Row } from "reactstrap";
import "./index.css";
import { Grid } from "@material-ui/core";
import { CameraDialog } from "../../../components/common";
import { UploadFile } from "../../../services/FicheInfirmerie/ficheInfirmerie";
import InjuredCategoryBloc from "./components/InjuredCategory";
import Sender from "./components/Sender";
import Zones from "./components/Zones";
import AccidentDetails from "./components/AccidentDetails";
import LesionDetailsBloc from "./components/LesionDetails";
// import SafetyProposal from "./components/safetyProposal";
// import Images from "./components/images";
import { useResponsible } from "../../../hooks/responsible";
import { FicheInfAdd } from "../../../models/ficheinf";
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, SubmitHandler } from "react-hook-form";

import { useTranslation } from "react-i18next";
import { CompressFile } from "../../../components/common/drop-zone/DropZone";
import Care from "./components/Care";
import Image from "./components/Image";
import DrawLesion from "./components/drawLesion";

export const Form = (props: { onSubmit: SubmitHandler<FicheInfAdd>, initialValues: FicheInfAdd, imageChange: Function, validationSchema: any }) => {
  const { responsibles } = useResponsible()

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [submitted, setSubmitted] = useState<boolean>(false)
  const { t } = useTranslation()
  const canvas = useRef<HTMLCanvasElement>(null)

  const {
    onSubmit,
    initialValues,
    imageChange
  } = props

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    resetField,
    formState: { errors }
  } = useForm<FicheInfAdd>({
    resolver: yupResolver(props.validationSchema)
  });

  /**
   * Ce tableau contient les liens de preview pour les images
   */
  const [previewImg, setPreviewImg] = useState<string>('')

  const handleCameraClose = async (image: File) => {
    /**
     * Les images de ficheInfirmerie sont dans
     * le sous dossier ficheInfirmerie du back
     */
    const response = await UploadFile(image, 'ficheinfirmerie')
    imageChange(response.url)
    setValue("image1", response?.url)
    setPreviewImg(URL.createObjectURL(image))
  };

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
      onSubmit({...data, lesionImage: response?.url})
      const ctx = canvas?.current?.getContext("2d")
      ctx?.clearRect(0, 0, canvas?.current?.width || 0, canvas?.current?.height || 0)
    })
  }

  return (
    <>
      <CameraDialog
        open={isDialogOpen}
        handleClose={async (image: File) => {
          if (image instanceof File) {
            /**
             * Ici on compresse l'image
             * En utilisant la fonction de compression independante
             * qui est livrée avec le module DropZone
             */
             const compImg = await CompressFile({file: image, maxSizeOutput: 0.5})
             if(!(compImg instanceof Error)){
               handleCameraClose(compImg.file)
             }
          }
          setIsDialogOpen(false);
        }}
      />
      <Row>
        <Col md={{ size: 12, offset: 0 }}>
          <Card>
            <CardBody>
              <form
                style={{ paddingTop: "10px" }}
                onSubmit={handleSubmit((data) => {
                  convertCanvasAndSubmit(data)
                  reset();
                }, () => {
                  setSubmitted(true);
                })}
              >
                <Row className="">

                  <Col md={6} className="border-right">
                    <InjuredCategoryBloc watch={watch} control={control} errors={errors} submitted={submitted} values={initialValues} setValue={setValue} />
                    <Sender control={control} errors={errors} submitted={submitted} values={initialValues} setValue={setValue} responsibleConservatoires={responsibles} resetField={resetField} />
                    <Zones watch={watch} control={control} errors={errors} submitted={submitted} values={initialValues} setValue={setValue} resetField={resetField}/>
                    <AccidentDetails control={control} errors={errors} submitted={submitted} values={initialValues} setValue={setValue} watch={watch}/>
                  </Col>

                  <Col md={6} style={{ paddingLeft: "15px" }}>
                    <Row>
                        <Col md={6}>
                            <LesionDetailsBloc control={control} errors={errors} submitted={submitted} values={initialValues} setValue={setValue} watch={watch}/>
                        </Col>
                        <Col md={6}>
                          <DrawLesion imgModel={require('../../../assets/img/dopm/human.png')} ref={canvas}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Care watch={watch} control={control} errors={errors} submitted={submitted} values={initialValues} setValue={setValue} />
                        </Col>
                        <Col md={6} className="d-flex align-items-center">
                            <Image watch={watch} values={initialValues} control={control} handleFileUpload={handleFileUpload} previewImg={previewImg} setIsDialogOpen={setIsDialogOpen}/>
                        </Col>
                    </Row>
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
};
