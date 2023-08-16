import { Card, CardBody, CardFooter, CardHeader } from "reactstrap";
import { ChangeEvent, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { ProgressBar } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";
import { FicheAdd } from "../../../../models/fiche";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import Presentation from "./components/presentation";
import Description from "./components/description";
import SafetyApplied from "./components/safetyApplied";
import { useResponsible } from "../../../../hooks/responsible";
import SafetyProposal from "./components/safetyProposal";
import Service from "./components/service";
import { useTranslation } from "react-i18next";
import Images from "../../creation/components/images";
import { CompressFile } from "../../../../components/common/drop-zone/DropZone";
import { UploadFile } from "../../../../services/FicheSecurite/ficheSecurity";
import { CameraDialog } from "../../../../components/common";

export const FormMobile = (props: {
  onSubmit: SubmitHandler<FicheAdd>;
  initialValues: FicheAdd;
  imageChange: Function;
  validationSchema: any;
}) => {
  const { onSubmit, initialValues, imageChange } = props;
  const { responsibles, addResponsible } = useResponsible();
  const { t } = useTranslation();

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    resetField,
    formState: { errors },
    setError,
  } = useForm<FicheAdd>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: initialValues,
    resolver: yupResolver(props.validationSchema),
  });

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);

  const onChangeField = () => {
    let canNext = true;
    STEPS[currentStep]?.fields?.forEach(
      (field: { name: string; errorMessage: string }) => {
        // @ts-ignore
        if (watch(field.name) == initialValues[field.name]) {
          canNext = false;
          return;
        }
      }
    );
    setCanNextStep(canNext);
  };

  const displayErrors = () => {
    STEPS[currentStep]?.fields?.forEach(
      (field: { name: string; errorMessage: string }) => {
        // @ts-ignore
        if (watch(field.name) == initialValues[field.name]) {
          // @ts-ignore
          setError(field.name, {
            message: field.errorMessage,
          });
        }
      }
    );
  };

  /**
   * Ce tableau contient les liens de preview pour les images
   */
  const [previewImg, setPreviewImg] = useState<string[]>(["", "", ""]);
  const [imageToChange, setImageToChange] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

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
  };

  const handleFileUpload = async (event: ChangeEvent, index: number) => {
    const element = event.target as HTMLInputElement;
    if (element?.files && element.files[0]) {
      const file = element.files[0];
      const compImg = await CompressFile({ file: file, maxSizeOutput: 0.5 });
      if (!(compImg instanceof Error)) {
        /**
         * Les images de ficheSecurite sont dans
         * le sous dossier fichesecurite du back
         */
        const response = await UploadFile(compImg.file, "fichesecurite");
        imageChange(response?.url, index);
        switchImage(index, response?.url);
        setPreviewImg(() => {
          return previewImg.map((el: string, k: number) => {
            /**
             * On genere un lien pour la preview de l'image
             */
            if (k === index - 1) return URL.createObjectURL(compImg.file);
            else return el;
          });
        });
      } else {
        const response = await UploadFile(file);
        imageChange(response?.url, index);
        switchImage(index, response?.url);
      }
    }
  };

  const handleCameraClose = async (image: File, index: number) => {
    /**
     * Les images de ficheSecurite sont dans
     * le sous dossier fichesecurite du back
     */
    const response = await UploadFile(image, "fichesecurite");
    imageChange(response.url, index);
    switchImage(index, response?.url);
    setPreviewImg(() => {
      return previewImg.map((el: string, k: number) => {
        /**
         * On genere un lien pour la preview de l'image
         */
        if (k === index - 1) return URL.createObjectURL(image);
        else return el;
      });
    });
  };

  const STEPS = [
    {
      name: "Présentation",
      component: (
        <Presentation
          watch={watch}
          control={control}
          errors={errors}
          submitted={submitted}
          values={initialValues}
          setValue={setValue}
          onChangeField={onChangeField}
        />
      ),
      fields: [
        { name: "fsCategoryId", errorMessage: t("ficheSecuriteCreation.yup1") },
        {
          name: "senderFirstname",
          errorMessage: t("ficheSecuriteCreation.yup2"),
        },
        {
          name: "senderLastname",
          errorMessage: t("ficheSecuriteCreation.yup3"),
        },
        { name: "teamId", errorMessage: t("ficheSecuriteCreation.yup5") },
      ],
    },
    {
      name: "Service",
      component: (
        <Service
          watch={watch}
          control={control}
          errors={errors}
          submitted={submitted}
          values={initialValues}
          setValue={setValue}
          onChangeField={onChangeField}
        />
      ),
      fields: [
        { name: "serviceId", errorMessage: t("ficheSecuriteCreation.yup4") },
      ],
    },
    {
      name: "Description",
      component: (
        <Description
          watch={watch}
          control={control}
          errors={errors}
          submitted={submitted}
          values={initialValues}
          setValue={setValue}
          onChangeField={onChangeField}
        />
      ),
      fields: [
        { name: "zoneId", errorMessage: t("ficheSecuriteCreation.yup6") },
        { name: "subzoneId", errorMessage: t("ficheSecuriteCreation.yup7") },
        { name: "description", errorMessage: t("ficheSecuriteCreation.yup9") },
      ],
    },
    {
      name: "Actions Immédiates",
      component: (
        <SafetyApplied
          responsibleSecurites={responsibles}
          addResponsible={addResponsible}
          control={control}
          errors={errors}
          submitted={submitted}
          values={initialValues}
          setValue={setValue}
          watch={watch}
          onChangeField={onChangeField}
        />
      ),
      fields: [
        {
          name: "mesureSecurisation",
          errorMessage: t("ficheSecuriteCreation.yup10"),
        },
        {
          name: "responsibleSecuriteId",
          errorMessage: t("ficheSecuriteCreation.yup8"),
        },
      ],
    },
    {
      name: "Actions sur Long Terme",
      component: (
        <SafetyProposal
          responsibleConservatoires={responsibles}
          resetField={resetField}
          control={control}
          errors={errors}
          submitted={submitted}
          values={initialValues}
          setValue={setValue}
        />
      ),
    },
    {
      name: "Photos",
      component: (
        <Images
          previewImg={previewImg}
          watch={watch}
          values={initialValues}
          control={control}
          setImageToChange={setImageToChange}
          handleFileUpload={handleFileUpload}
          setIsDialogOpen={setIsDialogOpen}
          setValue={setValue}
        />
      ),
    },
  ];

  const [percentage, setPercentage] = useState<number>(0);
  const [canNextStep, setCanNextStep] = useState<boolean>(false);

  useEffect(() => {
    const newPercentage = Math.round(((currentStep + 1) / STEPS.length) * 100);
    setPercentage(newPercentage);
    onChangeField();
  }, [currentStep]);

  return (
    <Card>
      <CameraDialog
        open={isDialogOpen}
        handleClose={async (image: File) => {
          if (image instanceof File) {
            /**
             * Ici on compresse l'image
             * En utilisant la fonction de compression independante
             * qui est livrée avec le module DropZone
             */
            const compImg = await CompressFile({
              file: image,
              maxSizeOutput: 0.5,
            });
            if (!(compImg instanceof Error)) {
              handleCameraClose(compImg.file, imageToChange);
            }
          }
          setIsDialogOpen(false);
        }}
      />
      <CardHeader>
        &Eacute;tape {currentStep + 1} : {STEPS[currentStep].name}
      </CardHeader>
      <form
        onSubmit={handleSubmit(
          (data) => {
            onSubmit(data);
            reset();
            setCurrentStep(0);
          },
          () => {
            setSubmitted(true);
          }
        )}
      >
        <CardBody>{STEPS[currentStep].component}</CardBody>
        <CardFooter>
          <div className={"action-container"}>
            <button
              type="button"
              className={
                currentStep == 0 ? "mobile-button-disable" : "mobile-button"
              }
              onClick={
                currentStep == 0
                  ? () => {}
                  : () => setCurrentStep(currentStep - 1)
              }
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>

            <div className={"progressbar-container"} id="progressBar">
              <ProgressBar
                now={percentage}
                label={`${currentStep + 1}/${STEPS.length}`}
                variant={"custom"}
              />
            </div>
            {currentStep + 1 < STEPS.length && (
              <button
                type="button"
                className={
                  canNextStep ? "mobile-button" : "mobile-button-disable"
                }
                onClick={
                  canNextStep
                    ? () => setCurrentStep(currentStep + 1)
                    : () => displayErrors()
                }
              >
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            )}
            {currentStep + 1 == STEPS.length && (
              <button type="submit" className={"mobile-button"}>
                <FontAwesomeIcon icon={faCheck} />
              </button>
            )}
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default FormMobile;
