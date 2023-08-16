import {SubmitHandler, useForm} from "react-hook-form";
import {FicheInfAdd} from "../../../../models/ficheinf";
import {yupResolver} from "@hookform/resolvers/yup";
import React, {ChangeEvent, useEffect, useRef, useState} from "react";
import {CompressFile} from "../../../../components/common/drop-zone/DropZone";
import {UploadFile} from "../../../../services/FicheSecurite/ficheSecurity";
import {Card, CardBody, CardFooter, CardHeader, Col, Row} from "reactstrap";
import {CameraDialog} from "../../../../components/common";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faArrowRight, faCheck} from "@fortawesome/free-solid-svg-icons";
import {ProgressBar} from "react-bootstrap";
import Presentation from "./components/presentation";
import {useTranslation} from "react-i18next";
import Responsibles from "./components/responsible";
import {useResponsible} from "../../../../hooks/responsible";
import Service from "./components/service";
import Details from "./components/details";
import Zones from "./components/zones";
import LesionDetails from "./components/lesionDetails";
import Care from "./components/care";
import Image from "../../creation/components/Image";
import DrawLesion from "../../creation/components/drawLesion";

export const FormMobile = (props: {
    onSubmit: SubmitHandler<FicheInfAdd>;
    initialValues: FicheInfAdd;
    imageChange: Function;
    validationSchema: any;
}) => {
    const { onSubmit, initialValues, imageChange } = props;

    const { t } = useTranslation();
    const { responsibles } = useResponsible()
    const canvas = useRef<HTMLCanvasElement>(null)

    const {
        handleSubmit,
        control,
        setValue,
        watch,
        reset,
        formState: { errors },
        setError
    } = useForm<FicheInfAdd>({
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: initialValues,
        resolver: yupResolver(props.validationSchema)
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
    }

    const displayErrors = () => {
        STEPS[currentStep]?.fields?.forEach(
            (field: { name: string; errorMessage: string }) => {
                // @ts-ignore
                if (watch(field.name) == initialValues[field.name]) {
                    // @ts-ignore
                    setError(field.name, {
                        message: field.errorMessage
                    });
                }
            }
        )
    }

    /**
     * Ce tableau contient les liens de preview pour les images
     */
    const [previewImg, setPreviewImg] = useState<string>("");
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

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

    const convertCanvasAndSubmit = (canvasElt: HTMLCanvasElement | null | undefined, data: FicheInfAdd) => {
        canvasElt?.toBlob(async (blob) => {
            let convertBlob: any = blob
            convertBlob.name = 'lesions.png'
            convertBlob.lastModified = new Date()

            const file = new File([convertBlob], 'image.png', {
                type: convertBlob.type
            })
            const response = await UploadFile(file, 'ficheinfirmerie')
            onSubmit({...data, lesionImage: response?.url})
            const ctx = canvasElt.getContext("2d")
            ctx?.clearRect(0, 0, canvasElt.width, canvasElt.height)
            setCurrentStep(0);
        })
    }

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
                { name: "injuredCategoryId", errorMessage: t("ficheInfirmerieCreation.yup1") },
                { name: "senderFirstname", errorMessage: t("ficheInfirmerieCreation.yup2") },
                { name: "senderLastname", errorMessage: t("ficheInfirmerieCreation.yup3") },
                { name: "post", errorMessage: t("ficheInfirmerieCreation.yup4") },
                { name: "teamId", errorMessage: t("ficheInfirmerieCreation.yup7") }
            ]
        },
        {
            name: "Responsable",
            component: (
                <Responsibles
                    responsibleConservatoires={responsibles}
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
                { name: "responsibleSecuriteId", errorMessage: t("ficheInfirmerieCreation.yup5") }
            ]
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
                { name: "serviceId", errorMessage: t("ficheInfirmerieCreation.yup6") },
            ]
        },
        {
            name: "Zone de l'accident",
            component: (
                <Zones
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
                { name: "zoneId", errorMessage: t("ficheInfirmerieCreation.yup9")  },
                { name: "subzoneId", errorMessage:  t("ficheInfirmerieCreation.yup10") }
            ]
        },
        {
            name: "Détails de l'accident",
            component: (
                <Details
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
                { name: "circumstances", errorMessage: t("ficheInfirmerieCreation.yup11") },
                { name: "materialElementsId", errorMessage: t("ficheInfirmerieCreation.yup12") },
            ]
        },
        {
            name: "Détails des lésions",
            component: (
                <LesionDetails
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
                { name: "lesionDetailsId", errorMessage: t("ficheInfirmerieCreation.yup13") }
            ]
        },
        {
            name: "Dessin des lésions"
        },
        {
            name: "Soins donnés",
            component: (
                <Care
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
                { name: "careProvidedId", errorMessage: t("ficheInfirmerieCreation.yup14") },
                { name: "caregiver", errorMessage: t("ficheInfirmerieCreation.yup15") },
                { name: "careGived", errorMessage: t("ficheInfirmerieCreation.yup16") }
            ]
        },
        {
            name: "Image",
            component: (
                <Image
                    watch={watch}
                    values={initialValues}
                    control={control}
                    handleFileUpload={handleFileUpload}
                    previewImg={previewImg}
                    setIsDialogOpen={setIsDialogOpen}
                />
            )
        }
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
                        const compImg = await CompressFile({file: image, maxSizeOutput: 0.5})
                        if(!(compImg instanceof Error)){
                            handleCameraClose(compImg.file)
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
                        convertCanvasAndSubmit(canvas?.current, data)
                        reset();
                    },
                    () => {
                        setSubmitted(true);
                    }
                )}
            >
                <CardBody>
                    {STEPS[currentStep].component}
                    <Row className={`${STEPS[currentStep].component && 'd-none'}`}>
                        <Col>
                            <DrawLesion
                                imgModel={require('../../../../assets/img/dopm/human.png')}
                                ref={canvas}
                            />
                        </Col>
                    </Row>
                </CardBody>
                <CardFooter style={STEPS[currentStep].component ? {} : { position: "relative", zIndex: 1000 }}>
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

                        <div className={"progressbar-container"} id="progressbar">
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
    )
}
