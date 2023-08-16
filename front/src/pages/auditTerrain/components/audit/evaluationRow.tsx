import { Card, CardBody, CardTitle, Col, Row } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faX } from "@fortawesome/free-solid-svg-icons";
import { Controller } from "react-hook-form";
import { PhotoCamera } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
import { useEffect, useState } from "react";
import ModalComponent from "../../../../components/layout/modal";
import { UploadFile } from "../../../../services/FicheSecurite/ficheSecurity";
import { CameraDialog } from "../../../../components/common";
import PhotoContainer from "./photoContainer";
import { CompressFile } from "../../../../components/common/drop-zone/DropZone";
import { hasToBeDisplayed, createPeriodicText } from './../../../../services/period';

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

const EvaluationRow = ({
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
                <PhotoContainer
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
                        borderTop: `1px solid ${checkpoint.category?.color}`,
                        borderRight: `1px solid ${checkpoint.category?.color}`,
                        borderBottom: `1px solid ${checkpoint.category?.color}`,
                        borderLeft: `8px solid ${checkpoint.category?.color}`,
                        boxShadow: '0px 4px 12px #afafaf',
                        height: '5.5rem',
                        marginBottom: '1rem',
                    }}>
                        <CardBody style={{ padding: '0.5rem' }}>
                            <Row style={{ height: '87%' }}>
                                <Col md={9} sm={5}>
                                    <Row>
                                        <Col>
                                            <CardTitle tag='h3' className={'title'} style={{ height: '1rem', marginBottom: '0.4rem' }}>
                                                {`${checkpoint.numero.toString().padStart(2, '0')}. `}
                                                {checkpoint.standard}
                                                {checkpoint.zone?.name && ` | Zone ${checkpoint.zone.name}`}
                                                {checkpoint.subzone?.name && ` > ${checkpoint.subzone.name}`}
                                            </CardTitle>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            {checkpoint.description}
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md={3} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                    {!watch(`evaluations.${index}.image`) &&
                                        <IconButton
                                            style={{ border: '1px solid #3f51b5', margin: '12px 3px' }}
                                            color="primary"
                                            aria-label="upload picture"
                                            type="button"
                                            onClick={() => {
                                                setSelectedLine(index);
                                                setPictureModal(true);
                                            }}
                                        >
                                            <PhotoCamera />
                                        </IconButton>
                                    }
                                    {watch(`evaluations.${index}.image`) &&
                                        <div style={{ width: '50px', height: '50px', margin: '12px 3px' }}>
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
                                </Col>
                            </Row>
                            <Row style={{ justifyContent: "center", color: '#E0E0E0', fontStyle: 'italic', fontSize: '0.8rem' }}>
                                {createPeriodicText(period)}
                            </Row>
                        </CardBody>
                    </Card>
                )
            })}
        </CardBody >
    )
}

export default EvaluationRow;
