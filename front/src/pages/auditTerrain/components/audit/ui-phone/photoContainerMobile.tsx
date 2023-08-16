import { Grid, IconButton, Typography } from "@material-ui/core";
import { Controller } from "react-hook-form";
import { Button, FormGroup, Input, Label } from "reactstrap";
import { PhotoCamera } from "@material-ui/icons";
import React, { ChangeEvent, useRef } from "react";
import { UploadFile } from "../../../../../services/FicheSecurite/ficheSecurity";
import { Modal } from "react-bootstrap";
import { CompressFile } from "../../../../../components/common/drop-zone/DropZone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { Color } from "../../../../../utils/dopm.utils";
import CharactersCounter from "../../../../ficheSecurite/creation/components/charactersCounter";

interface PhotoContainerProps {
    watch: any;
    control: any;
    setValue: any;
    selectedLine: number;
    setIsDialogOpen: Function;
    imgPreview: Array<string>;
    setImgPreview: Function;
    setPictureModal: Function;
}

const PhotoContainerMobile = ({
    watch,
    control,
    setValue,
    selectedLine,
    setIsDialogOpen,
    imgPreview,
    setImgPreview,
    setPictureModal,
}: PhotoContainerProps) => {
    const PUBLIC_API = process.env.REACT_APP_PUBLIC_URL;
    const img = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (event: ChangeEvent) => {
        const element = event.target as HTMLInputElement;
        if (element?.files && element.files[0]) {
            const file = element.files[0];
            const compImg = await CompressFile({ file: file, maxSizeOutput: 0.5 });
            if (!(compImg instanceof Error)) {
                const response = await UploadFile(compImg.file, "audit");
                setValue(`evaluations.${selectedLine}.image`, response?.url);
                if (response) {
                    setImgPreview(() => {
                        return imgPreview.map((el: string, k: number) => {
                            if (k === selectedLine) return URL.createObjectURL(compImg.file);
                            else return el;
                        });
                    });
                }
            } else {
                const response = await UploadFile(file, "audit");
                setValue(`evaluations.${selectedLine}.image`, response?.url);
                setImgPreview(() => {
                    return imgPreview.map((el: string, k: number) => {
                        if (k === selectedLine) return PUBLIC_API + response?.url;
                        else return el;
                    });
                });
            }
        }
    };

    return (
        <>
            <Modal.Header>
                <Modal.Title>Prise de photo - Audit</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Grid
                    container
                    direction="column"
                    justifyContent="space-evenly"
                    spacing={1}
                >
                    {/* MODELE DU CHECKPOINT */}
                    <Grid
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                        spacing={1}
                    >
                        <Grid item className="my-2">Standard</Grid>
                        <Grid
                            item
                            container
                            direction="column"
                            justifyContent="center"
                            alignItems="center"
                            style={{
                                height: "300px",
                                width: "300px",
                                border: `1px solid ${Color.green}`,
                                borderRadius: "12px",
                                boxShadow: `${Color.green} 0px 2px 6px`,
                                margin: "auto"
                            }}
                        >
                            <img
                                style={{
                                    maxHeight: "100%",
                                    maxWidth: "100%",
                                }}
                                src={`${PUBLIC_API}${watch(
                                    `evaluations.${selectedLine}.checkpoint.image`
                                )}`}
                                alt="reference"
                            />
                        </Grid>
                    </Grid>

                    {/* PHOTO PRISE PAR L'UTILISATEUR */}
                    <Grid
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                        spacing={1}
                    >
                        <Grid item className="my-2">Réel</Grid>
                        <Grid
                            item
                            container
                            direction="column"
                            justifyContent="center"
                            alignItems="center"
                            style={{
                                height: "300px",
                                width: "300px",
                                border: `1px solid ${Color.red}`,
                                borderRadius: "12px",
                                boxShadow: `${Color.red} 0px 2px 6px`,
                                margin: "auto"
                            }}
                        >
                            {!watch(`evaluations.${selectedLine}.image`) && (
                                <Typography variant="subtitle2">
                                    Aucune image inserée
                                </Typography>
                            )}
                            {watch(`evaluations.${selectedLine}.image`) && (
                                <img
                                    style={{
                                        maxHeight: "100%",
                                        maxWidth: "100%",
                                    }}
                                    src={`${imgPreview[selectedLine]}`}
                                    alt="photo1"
                                />
                            )}
                        </Grid>
                        <Controller
                            name="image"
                            control={control}
                            defaultValue={""}
                            render={({ field }) => (
                                <input style={{ display: "none" }} {...field} />
                            )}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            id="img-up"
                            ref={img}
                            onChange={(event) => {
                                handleFileUpload(event);
                            }}
                        />
                        <Grid
                            item
                            container
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                            style={{ marginTop: "12px" }}
                        >
                            <Grid item>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {
                                        img?.current?.click();
                                    }}
                                >
                                    {!watch(`evaluations.${selectedLine}.image`)
                                        ? "Ajouter"
                                        : "Modifier"}
                                </Button>
                            </Grid>
                            <Grid item>
                                <IconButton
                                    color="primary"
                                    aria-label="upload picture"
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsDialogOpen(true);
                                    }}
                                >
                                    <PhotoCamera />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Commentaire */}
                <Grid
                    container
                    direction="column"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={1}
                >
                    <FormGroup style={{ width: "75%" }}>
                        <Label htmlFor="evalComment" style={{ display: "block" }}>
                            Commentaire
                        </Label>

                        <CharactersCounter
                            maxCharacter={120}
                            actualValue={
                                watch ? watch(`evaluations.${selectedLine}.comment`) : ""
                            }
                            inputRender={(max: number) => {
                                return (
                                    <Controller
                                        name={`evaluations.${selectedLine}.comment`}
                                        control={control}
                                        defaultValue={watch(`evaluations.${selectedLine}.comment`)}
                                        render={({ field }) => (
                                            <Input
                                                autoComplete="off"
                                                type="text"
                                                id="evalComment"
                                                maxLength={max}
                                                {...field}
                                            />
                                        )}
                                    />
                                );
                            }}
                        />
                    </FormGroup>
                </Grid>
            </Modal.Body>
            <Modal.Footer>
                <Grid
                    container
                    direction="column"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={1}
                >
                    <Button
                        color="success"
                        onClick={() => setPictureModal(false)}
                        style={{ padding: "12px 48px", fontSize: "16px" }}
                    >
                        Valider
                        <FontAwesomeIcon
                            icon={faCheck}
                            style={{
                                marginLeft: "10px",
                                fontWeight: "bold",
                                fontSize: "16px",
                            }}
                        />
                    </Button>
                </Grid>
            </Modal.Footer>
        </>
    );
};

export default PhotoContainerMobile;
