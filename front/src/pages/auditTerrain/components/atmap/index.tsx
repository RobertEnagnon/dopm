import { Controller, useForm } from "react-hook-form";
import { Button, Card, CardBody, Col, Row } from "reactstrap";
import { Grid, Typography } from "@material-ui/core";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { UploadFile } from "../../../../services/FicheSecurite/ficheSecurity";
import { useAudit } from "../../../../hooks/AuditTerrain/audit";
import { notify, NotifyActions } from "../../../../utils/dopm.utils";
import { CompressFile } from "../../../../components/common/drop-zone/DropZone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";

type MapAddType = {
  id: number;
  image: string;
};

const Atmap = () => {
  const PUBLIC_API = process.env.REACT_APP_PUBLIC_URL;
  const img = useRef<HTMLInputElement>(null);
  const [imgPreview, setImgPreview] = useState<string>("");

  const { auditMap, addMap, updateMap } = useAudit(undefined, undefined);

  const validationSchema = Yup.object({
    id: Yup.number(),
    image: Yup.string(),
  });
  const initialValues = {
    id: 0,
    image: "",
  };

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MapAddType>({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (auditMap) {
      setValue("id", auditMap.id);
      setValue("image", auditMap.image);

      setImgPreview(PUBLIC_API + auditMap.image);
    }
  }, [auditMap]);

  const handleFileUpload = async (event: ChangeEvent) => {
    const element = event.target as HTMLInputElement;
    if (element?.files && element.files[0]) {
      const file = element.files[0];
      const compImg = await CompressFile({ file: file, maxSizeOutput: 0.5 });
      if (!(compImg instanceof Error)) {
        const response = await UploadFile(compImg.file, "audit-map");
        setValue(`image`, response?.url);
        if (response) {
          setImgPreview(() => {
            return URL.createObjectURL(compImg.file);
          });
        }
      } else {
        const response = await UploadFile(file, "audit-map");
        setValue(`image`, response?.url);
        setImgPreview(() => {
          return PUBLIC_API + response?.url;
        });
      }
    }
  };

  const onSubmit = async (map: MapAddType) => {
    console.log(map);
    if (!map.id) {
      try {
        const newMap = await addMap(map);
        setValue("id", newMap.id);
        setValue("image", newMap.image);
        notify(`La carte a été ajoutée`, NotifyActions.Successful);
      } catch (e) {
        notify("Ajout impossible", NotifyActions.Error);
      }
    } else {
      const newMap = await updateMap(map.id, map);
      setValue("id", newMap.id);
      setValue("image", newMap.image);
      if (newMap) {
        notify("Modification effectuée", NotifyActions.Successful);
      } else {
        notify("Modification impossible", NotifyActions.Error);
      }
    }
  };

  return (
    <>
      <Row className="mb-4 align-items-end">
        <Col>
          <h6 className="card-subtitle text-muted">
            Gestion de la <code>carte</code>.
          </h6>
        </Col>
        <Col>
          <Row>
            <Col md={{ size: 1, offset: 11 }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!!errors.image}
              >
                <FontAwesomeIcon
                  icon={faFloppyDisk}
                  style={{ cursor: "pointer" }}
                  fixedWidth
                  className="align-middle btn-icon"
                />
              </button>
            </Col>
          </Row>
        </Col>
      </Row>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Col
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
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
                  <Grid item>Image</Grid>
                  <Grid
                    item
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    style={{ height: "400px", width: "400px" }}
                  >
                    {!watch("image") && (
                      <Typography variant="subtitle2">
                        Aucune image inserée
                      </Typography>
                    )}
                    {watch("image") && (
                      <img
                        style={{
                          maxHeight: "100%",
                          maxWidth: "100%",
                        }}
                        // src={`${PUBLIC_API}/${watch("image")}`}
                        src={`${imgPreview}`}
                        alt="photo1"
                      />
                    )}
                  </Grid>
                  <Controller
                    name="image"
                    control={control}
                    defaultValue={initialValues.image || ""}
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
                  >
                    <Grid item>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          img?.current?.click();
                        }}
                      >
                        {!watch("image") ? "Ajouter" : "Modifier"}
                      </Button>
                    </Grid>

                  </Grid>
                </Grid>
              </CardBody>
            </Card>
          </Grid>
        </Col>
      </form>
    </>
  );
};

export default Atmap;
