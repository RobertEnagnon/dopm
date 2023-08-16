import { Grid, IconButton, Typography } from "@material-ui/core"
import { PhotoCamera } from "@material-ui/icons";
import { useEffect, useRef } from "react";
import { Control, Controller, UseFormWatch } from "react-hook-form";
import { Button } from "reactstrap";
import { FicheInfAdd } from "../../../../models/ficheinf";

export default function Image (props: {watch: UseFormWatch<FicheInfAdd>, control: Control<FicheInfAdd, any>, values: FicheInfAdd, handleFileUpload: Function, previewImg: string, setIsDialogOpen: Function, setValue?: Function}) {

    const {
        watch,
        control,
        values,
        handleFileUpload,
        previewImg,
        setIsDialogOpen,
        setValue
      } = props

    const img = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if(setValue) setValue("image1", values.image1)
    }, [values])

    return <Grid
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
            style={{ height: "125px" }}
        >
            {!watch('image1') && (
                <Typography variant="subtitle2">
                    Aucune image inserée
                </Typography>
            )}
            {watch('image1') && (
                <img
                    style={{
                        maxHeight: "100%",
                        maxWidth: "100%",
                    }}
                    src={previewImg}
                    alt="photo1"
                />
            )}
        </Grid>
        <Controller
            name="image1"
            control={control}
            defaultValue={values.image1 || ""}
            render={({ field }) => <input
                style={{ display: "none" }}
                {...field}
            />} 
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
                    {!watch('image1') ? "Ajouter" : "Modifier"}
                </Button>
            </Grid>
            <Grid item>
                <IconButton
                color="primary"
                aria-label="upload picture"
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    setIsDialogOpen(true)
                }}
                >
                    <PhotoCamera />
                </IconButton>
            </Grid>
        </Grid>
    </Grid>
}