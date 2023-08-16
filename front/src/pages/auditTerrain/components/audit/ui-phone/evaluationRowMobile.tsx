import { Card, CardBody, CardTitle, Row, Col } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faX } from "@fortawesome/free-solid-svg-icons";
import { Controller } from "react-hook-form";
import { PhotoCamera } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
import { useEffect, useState } from "react";
import ModalComponent from "../../../../../components/layout/modal";
import { UploadFile } from "../../../../../services/FicheSecurite/ficheSecurity";
import { CameraDialog } from "../../../../../components/common";
import PhotoContainerMobile from "./photoContainerMobile";
import { CompressFile } from "../../../../../components/common/drop-zone/DropZone";
import { hasToBeDisplayed, createPeriodicText } from '../../../../../services/period';
import React from "react";

interface EvaluationRowProps {
    errors: any;
    control: any;
    register: any;
    checkpoints: any;
    evaluationFields: any;
    watch: any;
    setValue: any;
    getValues: any;
    date: Date;
    update: any;
}

const EvaluationRowMobile = ({
    control,
    checkpoints,
    watch,
    setValue,
    evaluationFields,
    update,
    getValues,
    date
}: EvaluationRowProps) => {
    const [pictureModal, setPictureModal] = useState<boolean>(false);
    const [selectedLine, setSelectedLine] = useState<number>(-1);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [imgPreview, setImgPreview] = useState<Array<string>>([]);

    useEffect(() => {
        if (checkpoints) {
            setImgPreview(checkpoints.map(() => ''));
        }
    }, [checkpoints])

    const handleCameraClose = async (image: File) => {
        const response = await UploadFile(image, 'audit')
        setValue(`evaluations.${selectedLine}.image`, response.url);
        if (response) {
            setImgPreview(() => {
                return imgPreview.map((el: string, k: number) => {
                    if (k === selectedLine) return URL.createObjectURL(image)
                    else return el
                })
            })
        }
    };

    return (
        <CardBody>
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
            <ModalComponent
                open={pictureModal}
                hide={() => {
                    setPictureModal(false)
                    setSelectedLine(-1);
                }}
            >
                <PhotoContainerMobile
                    watch={watch}
                    control={control}
                    setValue={setValue}
                    selectedLine={selectedLine}
                    setIsDialogOpen={setIsDialogOpen}
                    imgPreview={imgPreview}
                    setImgPreview={setImgPreview}
                    setPictureModal={setPictureModal}
                />
            </ModalComponent>
            {checkpoints.map((checkpoint: any, index: number) => {
                const { period } = checkpoint
                //console.log(`checkpoint ${checkpoint.numero} : `, period)
                //period && console.log('checkpoint', checkpoint.numero, checkpoint.updatedAt, checkpoint.period)
                return (
                    (!period || hasToBeDisplayed(checkpoint.updatedAt, date.toString(), period)) &&
                    < Card key={`ch${checkpoint.id * Date.now()}`
                    } className={'checkCard'} style={{
                        borderTop: `1px dotted ${checkpoint.category?.color}`,
                        borderRight: `1px dotted ${checkpoint.category?.color}`,
                        borderBottom: `1px dotted ${checkpoint.category?.color}`,
                        borderLeft: `10px solid ${checkpoint.category?.color}`,
                        boxShadow: '0px 4px 12px #afafaf',
                        height: '5rem',
                        marginBottom: '1rem',
                    }}>
                        <CardBody style={{ padding: '0.5rem' }}>
                            <Row className="mx-0" style={{ height: '100%' }}>
                                <Col  md={9} className="mr-1 px-0" style={{ display: 'flex', flexDirection: "column", width: '60%' }}>
                                {/* <div className="mr-1 px-0" style={{ display: 'flex', flexDirection: "column", width: '60%' }}> */}
                                    <CardTitle tag='h6' className={'title'} style={{ height: '1rem' }}>
                                        {`${checkpoint.numero.toString().padStart(2, '0')}. `}
                                        {checkpoint.standard}
                                        {checkpoint.zone?.name && ` | Zone ${checkpoint.zone.name}`}
                                        {checkpoint.subzone?.name && ` > ${checkpoint.subzone.name}`}
                                    </CardTitle>
                                    <p className="descriptionCheckpoint">{checkpoint.description}</p>
                                {/* </div> */}
                                </Col>
                                <Col md={3} className="px-0" style={{ display: 'flex', flexDirection: "row-reverse", alignItems: "center", width: '37%'}}>
                                {/* <div className="px-0" style={{ display: 'flex', flexDirection: "row-reverse", alignItems: "center", width: '36%' }}> */}
                                    
                                    
                                    <Controller
                                        name={`evaluations.${index}.check`}
                                        control={control}
                                        render={() => {
                                            return (
                                                <>
                                                    <div className={'radioCheck'}>
                                                        <input
                                                            onChange={() => {
                                                                let tmp = {
                                                                    ...getValues(`evaluations.${index}`),
                                                                    check: 'true'
                                                                }
                                                                update(index, tmp);
                                                            }}
                                                            style={{ display: "none" }}
                                                            type='radio'
                                                            name={checkpoint.id.toString()}
                                                            id={`ok${checkpoint.id}`}
                                                            value={'true'}
                                                            checked={evaluationFields[index]?.check == "true"}
                                                        />
                                                        <label htmlFor={`ok${checkpoint.id}`}>
                                                            <FontAwesomeIcon icon={faCheck} />
                                                        </label>
                                                    </div>
                                                    <div className={'radioCross'}>
                                                        <input
                                                            onChange={() => {
                                                                let tmp = {
                                                                    ...getValues(`evaluations.${index}`),
                                                                    check: 'false'
                                                                }
                                                                update(index, tmp);
                                                            }}
                                                            style={{ display: "none" }}
                                                            type='radio'
                                                            name={checkpoint.id.toString()}
                                                            id={`nok${checkpoint.id}`}
                                                            value={'false'}
                                                            checked={evaluationFields[index]?.check == "false"}
                                                        />
                                                        <label htmlFor={`nok${checkpoint.id}`}>
                                                            <FontAwesomeIcon icon={faX} />
                                                        </label>
                                                    </div>
                                                </>
                                            )
                                        }}
                                    />
                                    {watch(`evaluations.${index}.image`) &&
                                        <div style={{ width: '30px', height: '30px', margin: '12px 3px' }}>
                                            <img
                                                style={{ borderRadius: '100%', width: '100%', height: '100%', cursor: 'pointer' }}
                                                src={imgPreview[index]}
                                                onClick={() => {
                                                    setSelectedLine(index);
                                                    setPictureModal(true);
                                                }}
                                            // src={`${PUBLIC_API}${watch(`evaluations.${index}.image`)}`}
                                            />
                                        </div>
                                    }
                                    {!watch(`evaluations.${index}.image`) &&
                                        <IconButton
                                            style={{ width: '30px', height: '30px', border: '1px solid #3f51b5', margin: '6px 3px' }}
                                            color="primary"
                                            aria-label="upload picture"
                                            type="button"
                                            onClick={() => {
                                                setSelectedLine(index);
                                                setPictureModal(true);
                                            }}
                                        >
                                            <PhotoCamera style={{ fontSize: "18px" }} />
                                        </IconButton>
                                    }
                                {/* </div> */}
                                </Col>
                            </Row>
                            <Row style={{ justifyContent: "center", color: '#E0E0E0', fontStyle: 'italic', fontSize: '0.6rem', position: 'absolute', top: '80%', width: '100%' }}>
                                {createPeriodicText(period)}
                            </Row>
                        </CardBody>
                    </Card>
                )
            })}
        </CardBody >
    )
}

export default EvaluationRowMobile;
