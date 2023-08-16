import { ChangeEvent, useState } from "react";
import { Card, CardBody, Col, Row } from "reactstrap";
import "./index.css";
import { Grid } from "@material-ui/core";
import { CameraDialog } from "../../../components/common";
import { UploadFile } from "../../../services/FicheSecurite/ficheSecurity";
import Categories from "./components/categories";
import Sender from "./components/sender";
import Services from "./components/services";
import Zones from "./components/zones";
import Description from "./components/description";
import SafetyApplied from "./components/safetyApplied";
import SafetyProposal from "./components/safetyProposal";
import Images from "./components/images";
import { useResponsible } from "../../../hooks/responsible";
import { FicheAdd } from "../../../models/fiche";
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, SubmitHandler } from "react-hook-form";

import { useTranslation } from "react-i18next";
import { CompressFile } from "../../../components/common/drop-zone/DropZone";

export const Form = (props: { onSubmit: SubmitHandler<FicheAdd>, initialValues: FicheAdd, imageChange: Function, validationSchema: any }) => {
  const { responsibles, addResponsible } = useResponsible();

  const [imageToChange, setImageToChange] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const { t } = useTranslation();

  const {
    onSubmit,
    initialValues,
    imageChange
  } = props;

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    resetField,
    formState: { errors }
  } = useForm<FicheAdd>({
    resolver: yupResolver(props.validationSchema)
  });

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
  /**
   * Ce tableau contient les liens de preview pour les images
   */
  const [previewImg, setPreviewImg] = useState<string[]>(['', '', ''])

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
  };


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
        handleClose={async (image: File) => {
          if (image instanceof File) {
            /**
             * Ici on compresse l'image
             * En utilisant la fonction de compression independante
             * qui est livrée avec le module DropZone
             */
             const compImg = await CompressFile({file: image, maxSizeOutput: 0.5})
             if(!(compImg instanceof Error)){
               handleCameraClose(compImg.file, imageToChange)
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
                  onSubmit(data);
                  reset();
                }, () => {
                  setSubmitted(true);
                })}
              >
                <Row className="">

                  <Col md={6} className="border-right">
                    <Categories watch={watch} control={control} errors={errors} submitted={submitted} values={initialValues} setValue={setValue} />
                    <Sender control={control} errors={errors} submitted={submitted} values={initialValues} setValue={setValue} />
                    <Services control={control} errors={errors} submitted={submitted} values={initialValues} setValue={setValue} />
                    <Zones watch={watch} control={control} errors={errors} submitted={submitted} values={initialValues} setValue={setValue} />
                    <Description control={control} errors={errors} submitted={submitted} values={initialValues} setValue={setValue} watch={watch}/>
                  </Col>

                  <Col md="6" style={{ paddingLeft: "15px" }}>
                    <SafetyApplied responsibleSecurites={responsibles} addResponsible={addResponsible} control={control} errors={errors} submitted={submitted} values={initialValues} setValue={setValue} watch={watch} />
                    <SafetyProposal responsibleConservatoires={responsibles} resetField={resetField} control={control} errors={errors} submitted={submitted} values={initialValues} setValue={setValue} watch={watch} />
                    <Row>
                      <Images previewImg={previewImg} watch={watch} values={initialValues} control={control} setImageToChange={setImageToChange} handleFileUpload={handleFileUpload} setIsDialogOpen={setIsDialogOpen} setValue={setValue} />
                      <Grid container direction="row" justifyContent="flex-end" alignItems="flex-end">
                        <Grid item>
                          <button type="submit" className="btn btn-primary" style={{ marginRight: "50px" }}>
                            {t("ficheSecuriteCreation.save")}
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
