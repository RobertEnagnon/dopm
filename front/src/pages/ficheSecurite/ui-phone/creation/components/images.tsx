import { Grid, IconButton, Typography } from "@material-ui/core";
import { Button, Card, CardBody } from "reactstrap";
import { PhotoCamera } from "@material-ui/icons";
import { useRef } from "react";
import { Controller, Control, UseFormWatch } from "react-hook-form";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FicheAdd } from "../../../../../models/fiche";

const Images = (props: {
  previewImg: string[];
  watch: UseFormWatch<FicheAdd>;
  control: Control<FicheAdd, any>;
  values: FicheAdd;
  handleFileUpload: Function;
  setImageToChange: Function;
  setIsDialogOpen: Function;
  setValue: Function;
}) => {
  //const PUBLIC_API = process.env.REACT_APP_PUBLIC_URL;
  const im1 = useRef<HTMLInputElement>(null);
  const im2 = useRef<HTMLInputElement>(null);
  const im3 = useRef<HTMLInputElement>(null);

  const {
    previewImg,
    control,
    values,
    watch,
    handleFileUpload,
    setImageToChange,
    setIsDialogOpen,
    setValue,
  } = props;

  useEffect(() => {
    if (
      watch("image1") === undefined &&
      watch("image2") === undefined &&
      watch("image3") === undefined
    ) {
      setValue("image1", values.image1);
      setValue("image2", values.image2);
      setValue("image3", values.image3);
    }
  }, [values]);

  const { t } = useTranslation();

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={2}
    >
      <Grid item xs={12} md={4}>
        <Card>
          <CardBody>
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={1}
            >
              <Grid item>{t("ficheSecuriteCreation.image")} 1</Grid>
              <Grid
                item
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
                style={{ height: "125px" }}
              >
                {!watch("image1") && (
                  <Typography variant="subtitle2">
                    {t("ficheSecuriteCreation.noimage")}
                  </Typography>
                )}
                {watch("image1") && (
                  <img
                    style={{
                      maxHeight: "100%",
                      maxWidth: "100%",
                    }}
                    src={previewImg[0]}
                    alt="photo1"
                  />
                )}
              </Grid>
              <Controller
                name="image1"
                control={control}
                defaultValue={values.image1 || ""}
                render={({ field }) => (
                  <input style={{ display: "none" }} {...field} />
                )}
              />
              <input
                type="file"
                accept="image/*"
                hidden
                id="im1-up"
                ref={im1}
                onChange={(event) => {
                  handleFileUpload(event, 1);
                }}
              />{" "}
              <Grid
                item
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      im1?.current?.click();
                    }}
                  >
                    {!watch("image1")
                      ? t("ficheSecuriteCreation.add")
                      : t("ficheSecuriteCreation.update")}
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
                      setImageToChange(1);
                    }}
                  >
                    <PhotoCamera />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          </CardBody>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardBody>
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={1}
            >
              <Grid item>{t("ficheSecuriteCreation.image")} 2</Grid>
              <Grid
                item
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
                style={{ height: "125px" }}
              >
                {!watch("image2") && (
                  <Typography variant="subtitle2">
                    {t("ficheSecuriteCreation.noimage")}
                  </Typography>
                )}
                {watch("image2") && (
                  <img
                    style={{
                      maxHeight: "100%",
                      maxWidth: "100%",
                    }}
                    src={previewImg[1]}
                    alt="photo2"
                  />
                )}
              </Grid>
              <Controller
                name="image2"
                control={control}
                defaultValue={values.image2 || ""}
                render={({ field }) => (
                  <input style={{ display: "none" }} {...field} />
                )}
              />
              <input
                type="file"
                accept="image/*"
                hidden
                id="im2-up"
                ref={im2}
                onChange={(event) => {
                  handleFileUpload(event, 2);
                }}
              />{" "}
              <Grid
                item
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      im2?.current?.click();
                    }}
                  >
                    {!watch("image2")
                      ? t("ficheSecuriteCreation.add")
                      : t("ficheSecuriteCreation.update")}
                  </Button>
                </Grid>
                <Grid item>
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="span"
                    onClick={() => {
                      setIsDialogOpen(true);
                      setImageToChange(2);
                    }}
                  >
                    <PhotoCamera />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          </CardBody>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardBody>
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={1}
            >
              <Grid item>{t("ficheSecuriteCreation.image")} 3</Grid>
              <Grid
                item
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
                style={{ height: "125px" }}
              >
                {!watch("image3") && (
                  <Typography variant="subtitle2">
                    {t("ficheSecuriteCreation.noimage")}
                  </Typography>
                )}
                {watch("image3") && (
                  <img
                    style={{
                      maxHeight: "100%",
                      maxWidth: "100%",
                    }}
                    src={previewImg[2]}
                    alt="photo3"
                  />
                )}
              </Grid>
              <Controller
                name="image3"
                control={control}
                defaultValue={values.image3 || ""}
                render={({ field }) => (
                  <input style={{ display: "none" }} {...field} />
                )}
              />
              <input
                type="file"
                accept="image/*"
                hidden
                id="im3-up"
                ref={im3}
                onChange={(event) => {
                  handleFileUpload(event, 3);
                }}
              />{" "}
              <Grid
                item
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      im3?.current?.click();
                    }}
                  >
                    {!watch("image3")
                      ? t("ficheSecuriteCreation.add")
                      : t("ficheSecuriteCreation.update")}
                  </Button>
                </Grid>
                <Grid item>
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="span"
                    onClick={() => {
                      setIsDialogOpen(true);
                      setImageToChange(3);
                    }}
                  >
                    <PhotoCamera />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          </CardBody>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Images;
