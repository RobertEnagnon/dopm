import { useForm, Controller, SubmitHandler, useWatch } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { SchemaOf } from "yup";
import { Button, Card, CardBody, Col, FormGroup, Input, Row } from "reactstrap";
import { useService } from "../../../../hooks/service";
import { useATCategory } from "../../../../hooks/AuditTerrain/atcategory";
import { useZone } from "../../../../hooks/zone";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Grid, IconButton, Typography } from "@material-ui/core";
import { PhotoCamera } from "@material-ui/icons";
import { UploadFile } from "../../../../services/FicheSecurite/ficheSecurity";
import { CameraDialog } from "../../../../components/common/CameraDialog/CameraDialog";
import { CompressFile } from "../../../../components/common/drop-zone/DropZone";
import { PeriodType, defaultPeriod } from "../../../../models/period"
import { Period } from "../../../../components/common/Period";
import {Multiselect} from "multiselect-react-dropdown";
import {Service} from "../../../../models/service";

export type CheckpointType = {
    standard?: string,
    numero?: number,
    image?: string
    description?: string,
    services?: Array<Service>,
    zoneId?: number,
    subzoneId?: number,
    categoryId?: number,
    period?: PeriodType
}

export const Form = (
    props: {
        onSubmit: SubmitHandler<CheckpointType>,
        validationSchema: SchemaOf<Omit<CheckpointType, 'period'>>,
        initialValues: CheckpointType,
        useCheckpointsNumeros: Array<number>
    }) => {
    const img = useRef<HTMLInputElement>(null);

    const {
        onSubmit,
        validationSchema,
        initialValues,
        useCheckpointsNumeros
    } = props;

    const {
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors },
    } = useForm<Omit<CheckpointType, 'period'>>({
        resolver: yupResolver(validationSchema)
    });
    const { services } = useService();
    const { atcategories } = useATCategory();
    const { zones, subzones, fetchSubzones } = useZone();

    const selectedZoneId = useWatch({ control, name: "zoneId" });

    const [error, setError] = useState<string[]>(['', ''])

    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    const detectSize = () => { setWindowWidth(window.innerWidth) }
    const [previewImage, setPreviewImage] = useState<string>('')

    useEffect(() => {
        if (initialValues.zoneId) {
            fetchSubzones(initialValues.zoneId);
        }
    }, [initialValues.zoneId])

    useEffect(() => {
        if (selectedZoneId) {
            fetchSubzones(selectedZoneId);
        }
    }, [selectedZoneId])

    // Pour gérer des affichages différents du dialogue en fonction de la taille de la fenêtre
    useEffect(() => { window.addEventListener('resize', detectSize) })

    const handleCameraClose = async (image: File) => {
        const compImg = await CompressFile({ file: image, maxSizeOutput: 0.5 })
        if (!(compImg instanceof Error)) {
            const response = await UploadFile(compImg.file, 'audit')
            setValue(`image`, response?.url);
        } else {
            const response = await UploadFile(image, 'audit')
            setValue(`image`, response?.url);
        }
        //on cree un lien pour previsualiser l'image
        setPreviewImage(URL.createObjectURL(image))
    };

    const handleFileUpload = async (event: ChangeEvent) => {
        const element = event.target as HTMLInputElement;
        if (element?.files && element.files[0]) {
            const file = element.files[0];
            const compImg = await CompressFile({ file: file, maxSizeOutput: 0.5 });
            if (!(compImg instanceof Error)) {
                const response = await UploadFile(compImg.file, 'audit')
                setValue(`image`, response?.url);
            } else {
                const response = await UploadFile(file, 'audit')
                setValue(`image`, response?.url);
            }
            //on cree un lien pour previsualiser l'image
            setPreviewImage(URL.createObjectURL(element.files[0]))
        }
    };

    // Les foncitons suivantes concernent la gestion du component 'Period'
    // C'est un controlled component
    const [period, setPeriod] = useState<PeriodType>(initialValues.period ? initialValues.period : defaultPeriod);

    return (
        <>
            <CameraDialog
                open={isDialogOpen}
                handleClose={async (image: File) => {
                    if (image instanceof File) {
                        const compImg = await CompressFile({ file: image, maxSizeOutput: 0.5 })
                        if (!(compImg instanceof Error)) {
                            handleCameraClose(image);
                        }
                    }
                    setIsDialogOpen(false);
                }}
            />
            <form onSubmit={handleSubmit(data => {
                console.log('onSubmit')
                let newData = { ...data, period: period }
                onSubmit(newData)
            })}>

                <Row style={{ padding: '1em 0 1em 1em' }}>

                    {/* Colonne de gauche */}
                    <Col xs={windowWidth > 1200 ? 8 : 10} className={windowWidth > 1200 ? "border-right" : ""}>
                        <Row style={{ display: 'flex', flexWrap: windowWidth > 1200 ? 'nowrap' : 'wrap' }}>
                            {/*Numero*/}
                            <Col>
                                <FormGroup>
                                    <label htmlFor='numero' style={{ display: 'block' }}>
                                        Numéro
                                    </label>
                                    <Controller
                                        name="numero"
                                        control={control}
                                        defaultValue={initialValues.numero}
                                        render={({ field }) =>
                                            <Input
                                                type='select'
                                                id='numero'
                                                className='select-input'
                                                style={{ height: '35px' }}
                                                {...field}
                                            >
                                                <option value={0}>Sélectionnez un numéro</option>
                                                {Array.from(Array(50), (_, i) => i + 1).map(num => {
                                                    return (
                                                        <option
                                                            value={num}
                                                            key={`num${num * Date.now()}`}
                                                            disabled={useCheckpointsNumeros?.includes(num) && num !== initialValues.numero}
                                                        >
                                                            {num}
                                                        </option>
                                                    )
                                                })}
                                            </Input>
                                        }
                                    />
                                </FormGroup>
                            </Col>

                            {/*Service*/}
                            {services &&
                                <Col>
                                    <FormGroup>
                                        <label htmlFor='services' style={{display: 'block'}}>
                                            Service
                                        </label>
                                        <Controller
                                            name="services"
                                            control={control}
                                            defaultValue={initialValues.services}
                                            render={({field: { value, onChange }}) =>
                                                <Multiselect displayValue="name"
                                                             options={services}
                                                             selectedValues={value}
                                                             onSelect={onChange}
                                                             onRemove={onChange}
                                                             showCheckbox
                                                             showArrow={true}
                                                             closeOnSelect={false}
                                                             placeholder="Sélectionnez un service"
                                                             hidePlaceholder={true}
                                                             emptyRecordMsg="Aucun service trouvé"
                                                             className='select-input'
                                                             style={{ height: '35px' }}
                                                />
                                            }
                                        />
                                        {errors.services && (
                                            <div className='input-feedback'>{errors.services.message}</div>
                                        )}
                                    </FormGroup>
                                </Col>
                            }

                            {/*Catégorie*/}
                            <Col>
                                <FormGroup>
                                    <label htmlFor='categoryId' style={{ display: 'block' }}>
                                        Catégorie
                                    </label>
                                    <Controller
                                        name="categoryId"
                                        control={control}
                                        defaultValue={initialValues.categoryId}
                                        render={({ field }) => <Input
                                            type='select'
                                            id='categoryId'
                                            className='select-input'
                                            style={{ height: '35px' }}
                                            {...field}
                                        >
                                            <option value={0}>Sélectionnez une catégorie</option>
                                            {atcategories &&
                                                atcategories.map((category) => {
                                                    return (
                                                        <option value={category.id} key={`cat${category.id * Date.now()}`}>
                                                            {category.name}
                                                        </option>
                                                    )
                                                })
                                            }

                                            {errors.categoryId && (
                                                <div className='input-feedback'>{errors.categoryId.message}</div>
                                            )}
                                        </Input>}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row>
                            {/*Zone*/}
                            <Col >
                                <FormGroup>
                                    <label
                                        htmlFor='zoneId'
                                        style={{ display: 'block' }}
                                    >
                                        Zone
                                    </label>
                                    <Controller
                                        name="zoneId"
                                        control={control}
                                        defaultValue={initialValues.zoneId}
                                        render={({ field }) => <Input
                                            type='select'
                                            id='zoneId'
                                            className='select-input'
                                            style={{ height: '35px' }}
                                            {...field}
                                        >
                                            <option value={0}>Sélectionnez une zone</option>
                                            {zones &&
                                                zones.map((zone) => {
                                                    return (
                                                        <option value={zone.id} key={`zn${zone.id * Date.now()}`}>
                                                            {zone.name}
                                                        </option>
                                                    )
                                                })
                                            }
                                        </Input>}
                                    />
                                    {errors.zoneId && (
                                        <div className='input-feedback'>{errors.zoneId.message}</div>
                                    )}
                                </FormGroup>
                            </Col>

                            {/*Sous-zone*/}
                            <Col>
                                <FormGroup>
                                    <label
                                        htmlFor="subzoneId"
                                        style={{ display: "block" }}
                                    >
                                        Sous-Zone
                                    </label>
                                    <Controller
                                        name="subzoneId"
                                        control={control}
                                        defaultValue={initialValues.subzoneId}
                                        render={({ field }) => <select
                                            id="subzoneId"
                                            style={{ height: '35px' }}
                                            {...field}
                                        >
                                            <option value={0}>Select sous-zones</option>
                                            {subzones &&
                                                subzones.map((zone) => (
                                                    <option key={zone.id} value={zone.id}>
                                                        {zone.name}
                                                    </option>
                                                ))}
                                        </select>}
                                    />

                                    {errors.subzoneId && (
                                        <div className="input-feedback">
                                            {errors.subzoneId.message}
                                        </div>
                                    )}
                                </FormGroup>
                            </Col>
                        </Row>

                        {/*Standard*/}
                        <FormGroup>
                            <label htmlFor='standard' style={{ display: 'block' }}>
                                Standard
                            </label>
                            <Controller
                                name="standard"
                                control={control}
                                defaultValue={initialValues.standard}
                                render={({ field }) => <Input
                                    autoComplete='off'
                                    type='text'
                                    id='standard'
                                    className={
                                        errors.standard
                                            ? 'text-input-error'
                                            : 'text-input'
                                    }
                                    {...field}
                                />}
                            />
                            {errors.standard && (
                                <div className='input-feedback'>{errors.standard.message}</div>
                            )}
                        </FormGroup>

                        {/*Description*/}
                        <FormGroup>
                            <label htmlFor='description' style={{ display: 'block' }}>
                                Description
                            </label>
                            <Controller
                                name="description"
                                control={control}
                                defaultValue={initialValues.description}
                                render={({ field }) => <Input
                                    autoComplete='off'
                                    type='textarea'
                                    id='description'
                                    className={
                                        errors.description
                                            ? 'text-input-error'
                                            : 'text-input'
                                    }
                                    {...field}
                                />}
                            />
                            {errors.description && (
                                <div className='input-feedback'>{errors.description.message}</div>
                            )}
                        </FormGroup>

                        {/* Périodicité */}
                        <Col>
                            <Period
                                period={period}
                                error={error}
                                onPeriodModified={setPeriod}
                                onError={setError}
                            />
                        </Col>
                    </Col>

                    {/* Colonne de droite */}
                    <Col>

                        {/*Photo*/}
                        <Row>
                            <Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Card>
                                    <CardBody style={{ width: '250px' }}>
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
                                                style={{ height: "125px" }}
                                            >
                                                {!watch('image') && (
                                                    <Typography variant="subtitle2">
                                                        Aucune image inserée
                                                    </Typography>
                                                )}
                                                {watch('image') && (
                                                    <img
                                                        style={{
                                                            maxHeight: "100%",
                                                            maxWidth: "100%",
                                                        }}
                                                        src={previewImage}
                                                        alt="photo1"
                                                    />
                                                )}
                                            </Grid>
                                            <Controller
                                                name="image"
                                                control={control}
                                                defaultValue={initialValues.image || ""}
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
                                                            img?.current?.click();
                                                        }}
                                                    >
                                                        {!watch('image') ? "Ajouter" : "Modifier"}
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
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>

                        {/* Enregistrer */}
                        <Row style={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0
                        }}>
                            <Col style={{ textAlign: 'right', paddingRight: '4em' }}>
                                <button
                                    type='submit'
                                    className='btn btn-primary'
                                    disabled={(errors.categoryId || errors.description) ? true : false}>
                                    Enregistrer
                                </button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </form>
        </>
    )
}
