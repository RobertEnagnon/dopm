import { ChangeEvent, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Col, Row } from "reactstrap";
import { SugCategoryRow } from "./SugCategoryRow";
import { SugSenderRow } from "./SugSenderRow";
import { SugDescriptionRow } from "./SugDescriptionRow";
import { SugServicesRow } from "./SugServicesRow";
import { useSuggestion } from "../../../../hooks/suggestion";
import { SugImage } from "./SugImage";
import { CameraDialog } from "../../../../components/common";
import { SugStatusMessageRow } from "./SugStatusMessageRow";
import { SugClassificationRow } from "./SugClassificationRow";
import { CompressFile } from "../../../../components/common/drop-zone/DropZone";

interface SuggestionFormProps {
  suggestionID?: string | undefined;
}

export interface SuggestionFormValues {
  id: number;
  sugCategoryId: number;
  sugClassificationId: number;
  senderFirstname: string;
  senderLastname: string;
  description: string;
  serviceId: number;
  teamId: number;
  responsibleId: number;
}

export const SuggestionForm = ({ suggestionID }: SuggestionFormProps) => {
  const { OnAddSuggestion, OnUpdateSuggestion, suggestions } = useSuggestion();
  const {
    control,
    setValue,
    handleSubmit,
    register,
    formState: { errors },
    resetField,
    watch,
  } = useForm<SuggestionFormValues>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      id: 0,
      sugCategoryId: 0,
      sugClassificationId: 0,
      senderFirstname: "",
      senderLastname: "",
      description: "",
      serviceId: 0,
      teamId: 0,
      responsibleId: 0,
    },
  });

  const chosenSuggestion = suggestions.find(
    (suggestion) =>
      suggestion.id === parseInt(suggestionID ? suggestionID : "0")
  );

  const [image1, setImage1] = useState<File>();
  const [image2, setImage2] = useState<File>();
  const [image3, setImage3] = useState<File>();

  const [imageUrl1, setImageUrl1] = useState<string | undefined>();
  const [imageUrl2, setImageUrl2] = useState<string | undefined>();
  const [imageUrl3, setImageUrl3] = useState<string | undefined>();

  const [initialImgUrl, setInitialImgUrl] = useState<{
    imageNameOne: string | undefined;
    imageNameTwo: string | undefined;
    imageNameThree: string | undefined;
  }>({
    imageNameOne: undefined,
    imageNameTwo: undefined,
    imageNameThree: undefined,
  });

  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [imageNumber, setImageNumber] = useState<number>(0);

  const [statusValidatedResponsible, setStatusValidatedResponsible] = useState<
    boolean | undefined
  >(undefined);
  const [commentResponsible, setCommentResponsible] = useState<
    string | undefined
  >(undefined);

  const [statusValidatedComity, setStatusValidatedComity] = useState<
    boolean | undefined
  >(undefined);
  const [commentComity, setCommentComity] = useState<string | undefined>(
    undefined
  );

  const setImgByNumber = (image: File, imageNumber: number) => {
    if (imageNumber === 1) {
      setImage1(image);
      setImageUrl1(undefined);
    }
    if (imageNumber === 2) {
      setImage2(image);
      setImageUrl2(undefined);
    }
    if (imageNumber === 3) {
      setImage3(image);
      setImageUrl3(undefined);
    }
  };

  const saveImage = async (event: ChangeEvent, imageId: number) => {
    const element = event.target as HTMLInputElement;

    if (element?.files && element.files[0]) {
      const compImg = await CompressFile({
        file: element.files[0],
        maxSizeOutput: 0.5,
      });
      if (!(compImg instanceof Error)) {
        setImgByNumber(compImg.file, imageId);
      } else {
        setImgByNumber(element.files[0], imageId);
      }
    }
  };

  const handleCameraOpen = (index: number) => {
    setIsCameraOpen(true);
    setImageNumber(index);
  };

  const handleCameraClose = async (image: File | undefined) => {
    if (image?.name) {
      const compImg = await CompressFile({ file: image, maxSizeOutput: 0.5 });
      if (!(compImg instanceof Error)) {
        setImgByNumber(compImg.file, imageNumber);
      } else {
        setImgByNumber(image, imageNumber);
      }
    }
    setIsCameraOpen(false);
  };

  const onSubmit = async (data: any) => {
    if (chosenSuggestion) {
      await OnUpdateSuggestion({
        ...data,
        image1,
        image2,
        image3,
        imageUrl1,
        imageUrl2,
        imageUrl3,
        statusValidatedResponsible,
        statusValidatedComity,
        commentResponsible,
        commentComity,
        initialImgUrl,
      });
    } else {
      const currentYear = new Date().getFullYear();

      let currentYearSug = suggestions.filter(sug => sug.createdAt?.getFullYear() === currentYear);
      currentYearSug?.sort((a, b) => {
        return a.id - b.id;
      });

      const lastFicheNumber = currentYearSug[currentYearSug.length-1]?.id_sug?.slice(5);
      const id_sug = `${currentYear}-${lastFicheNumber ? parseInt(lastFicheNumber)+1 : 1}`

      await OnAddSuggestion({ ...data, id_sug, image1, image2, image3 });
      resetField("sugCategoryId", { keepError: true });
      resetField("senderFirstname", { keepError: true });
      resetField("senderLastname", { keepError: true });
      resetField("description", { keepError: true });
      resetField("serviceId", { keepError: true });
      resetField("teamId", { keepError: true });
      resetField("responsibleId", { keepError: true });

      setImage1(undefined);
      setImage2(undefined);
      setImage3(undefined);
    }
  };

  const chosenSuggestionId = chosenSuggestion?.id;

  useEffect(() => {
    if (chosenSuggestionId) {
      setValue("id", chosenSuggestion.id);
      chosenSuggestion.sugCategory &&
        setValue("sugCategoryId", chosenSuggestion.sugCategory.id ?? 0);
      chosenSuggestion.sugClassification
        ? setValue(
            "sugClassificationId",
            chosenSuggestion.sugClassification.id ?? 0
          )
        : setValue("sugClassificationId", 0);
      setValue("senderFirstname", chosenSuggestion.senderFirstname ?? "");
      setValue("senderLastname", chosenSuggestion.senderLastname ?? "");
      setValue("description", chosenSuggestion.description ?? "");
      chosenSuggestion.service &&
        setValue("serviceId", chosenSuggestion.service.id ?? 0);
      chosenSuggestion.team &&
        setValue("teamId", chosenSuggestion.team.id ?? 0);
      chosenSuggestion.responsible &&
        setValue("responsibleId", chosenSuggestion.responsible.id ?? 0);
    }
  }, [chosenSuggestionId, setValue]);

  useEffect(() => {
    if (chosenSuggestionId) {
      setImageUrl1(chosenSuggestion.imageNameOne);
      setImageUrl2(chosenSuggestion.imageNameTwo);
      setImageUrl3(chosenSuggestion.imageNameThree);
      setStatusValidatedResponsible(
        chosenSuggestion.statusWorkflow?.firstValidated
      );
      setStatusValidatedComity(
        chosenSuggestion.statusWorkflow?.secondValidated
      );
      setCommentResponsible(chosenSuggestion.statusWorkflow?.firstComment);
      setCommentComity(chosenSuggestion.statusWorkflow?.secondComment);

      setImage1(undefined);
      setImage2(undefined);
      setImage3(undefined);

      setInitialImgUrl((img) => {
        return {
          ...img,
          imageNameOne: chosenSuggestion.imageNameOne,
          imageNameTwo: chosenSuggestion.imageNameTwo,
          imageNameThree: chosenSuggestion.imageNameThree,
        };
      });

      register("sugClassificationId", {
        validate: (value) =>
          value !== 0 || "Vous devez choisir une classification.",
      });
    }
  }, [chosenSuggestionId]);

  useEffect(() => {
    register("sugCategoryId", {
      validate: (value) => value !== 0 || "Vous devez choisir une catégorie.",
    });

    register("senderFirstname", {
      validate: (value) => value !== "" || "Vous devez saisir un prénom.",
    });

    register("senderLastname", {
      validate: (value) =>
        value !== "" || "Vous devez saisir un npm de famille.",
    });

    register("description", {
      validate: (value) =>
        value?.trim()?.length == 0
          ? "Vous devez saisir la description."
          : value?.trim()?.length >= 15 ||
            "La description doit contenir au moins 15 caractères.",
    });

    register("serviceId", {
      validate: (value) => value != 0 || "Vous devez choisir un service.",
    });

    register("teamId", {
      validate: (value) => value != 0 || "Vous devez choisir une équipe.",
    });

    register("responsibleId", {
      validate: (value) => value != 0 || "Vous devez choisir un reponsable.",
    });
  }, [register]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CameraDialog open={isCameraOpen} handleClose={handleCameraClose} />
      <div style={{ padding: 10 }}>
        <Row>
          <Col md={6}>
            <SugCategoryRow
              control={control}
              setValue={setValue}
              errors={errors}
            />
            <label>
              <h3>Emetteur</h3>
            </label>
            <SugSenderRow control={control} errors={errors} />
            <SugServicesRow control={control} errors={errors} />
            <SugDescriptionRow
              control={control}
              errors={errors}
              watch={watch}
            />
          </Col>
          <Col
            md={6}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Row style={{ marginTop: 20 }}>
              <Col md={4}>
                <SugImage
                  id={1}
                  title="Image 1"
                  image={image1}
                  imageUrl={imageUrl1}
                  saveImage={saveImage}
                  handleCameraOpen={handleCameraOpen}
                  imageNumber={1}
                />
              </Col>
              <Col md={4}>
                <SugImage
                  id={2}
                  title="Image 2"
                  image={image2}
                  imageUrl={imageUrl2}
                  saveImage={saveImage}
                  handleCameraOpen={handleCameraOpen}
                  imageNumber={2}
                />
              </Col>
              <Col md={4}>
                <SugImage
                  id={3}
                  title="Image 3"
                  image={image3}
                  imageUrl={imageUrl3}
                  saveImage={saveImage}
                  handleCameraOpen={handleCameraOpen}
                  imageNumber={3}
                />
              </Col>
            </Row>
            {chosenSuggestion && (
              <SugStatusMessageRow
                chosenSuggestion={chosenSuggestion}
                setStatusValidatedResponsible={setStatusValidatedResponsible}
                setStatusValidatedComity={setStatusValidatedComity}
                setCommentResponsible={setCommentResponsible}
                setCommentComity={setCommentComity}
                commentResponsible={commentResponsible || ""}
                commentComity={commentComity || ""}
                statusResponsible={statusValidatedResponsible}
                statusComity={statusValidatedComity}
              />
            )}
            {chosenSuggestion && (
              <SugClassificationRow
                control={control}
                setValue={setValue}
                errors={errors}
              />
            )}
            <Row style={{ alignSelf: "flex-end" }}>
              <Button color="primary" style={{ padding: 5 }} type="submit">
                Enregistrer
              </Button>
            </Row>
          </Col>
        </Row>
      </div>
    </form>
  );
};
