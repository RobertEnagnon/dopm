import { Modal } from "react-bootstrap";
import { Checkpoint } from "../../../../../models/AuditTerrain/checkpoint";
import { Service } from "../../../../../models/service";
import { useEffect, useState } from "react";
import { Audit } from "../../../../../models/AuditTerrain/audit";
import { Button, Card, CardBody, CardTitle, Col, Row } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTrash, faX } from "@fortawesome/free-solid-svg-icons";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Evaluation } from "../../../../../models/AuditTerrain/evaluation";
import { notify, NotifyActions } from "../../../../../utils/dopm.utils";
import { PhotoCamera } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
import { CameraDialog } from "../../../../../components/common";
import ModalComponent from "../../../../../components/layout/modal";
import { UploadFile } from "../../../../../services/FicheSecurite/ficheSecurity";
import PhotoContainer from "../photoContainer";
import { CompressFile } from "../../../../../components/common/drop-zone/DropZone";
import { createPeriodicText, hasToBeDisplayed } from "../../../../../services/period"

type AuditCardProps = {
    checkpoints: Array<Checkpoint>,
    date: Date
    service: Service,
    editAudit: Function,
    audit: Audit,
    onDelete: Function,
    closeModal: Function
}

type AuditEditType = {
    id: number,
    date: Date,
    serviceId: number,
    evaluations: Array<{
        checkpoint: Checkpoint | undefined,
        check: string,
        comment: string,
        image: string
    }> | undefined
}

export interface FormValues {
    id: number;
    date: Date;
    serviceId: number;
    evaluations: Array<{
        idEval: number,
        checkpoint: Checkpoint | undefined,
        check: string,
        comment: string,
        image: string
    }> | undefined;
}

const EditAuditForm = ({ checkpoints, date, service, audit, editAudit, onDelete, closeModal }: AuditCardProps) => {
    const PUBLIC_API = process.env.REACT_APP_PUBLIC_URL;

    const [pictureModal, setPictureModal] = useState<boolean>(false);
    const [selectedLine, setSelectedLine] = useState<number>(-1);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [imgPreview, setImgPreview] = useState<Array<string>>([]);

    const {
        handleSubmit,
        setValue,
        control,
        watch,
        getValues,
    } = useForm<FormValues>({
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            id: 0,
            date: new Date(),
            serviceId: 0,
            evaluations: []
        }
    })

    const {
        fields: evaluationFields,
        update
        // @ts-ignore
    } = useFieldArray({
        name: 'evaluations',
        control
    })

    const evaluations = audit?.Evaluations?.map((evaluation: Evaluation) => ({
        idEval: evaluation.id,
        checkpoint: evaluation.checkpoint,
        check: evaluation.check,
        comment: evaluation.comment,
        image: evaluation.image
    }));

    useEffect(() => {
        if (service && audit) {
            // @ts-ignore
            setValue('id', audit.id);
            setValue('date', date);
            setValue('serviceId', service.id);
            setValue('evaluations', evaluations);

            if (evaluations) {
                setImgPreview(evaluations.map(e => PUBLIC_API + e.image));
            }
        }
    }, [service, checkpoints, audit, setValue])

    const handleEditAudit = async (audit: AuditEditType) => {
        try {
            const editedAudit = await editAudit(audit.id, audit);
            notify(
                `L'audit ${editedAudit?.service?.name} du ${new Date(editedAudit?.date)?.toLocaleDateString()} a été modifié`,
                NotifyActions.Successful
            );
            closeModal()
        } catch (e) {
            console.log(e);
            notify('Modification impossible', NotifyActions.Error);
        }
    }

    const handleDeleteAudit = (auditId: number) => {
        onDelete(auditId);
    }

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
        <>
            <Modal.Header>
                <Modal.Title>Modification de l'audit</Modal.Title>
                <div style={{ margin: '8px', cursor: 'pointer' }}>
                    <FontAwesomeIcon icon={faTrash} onClick={() => handleDeleteAudit(audit.id)} />
                </div>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit(handleEditAudit)}>
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
                                setPictureModal={setPictureModal}
                                imgPreview={imgPreview}
                                setImgPreview={setImgPreview}
                            />
                        </ModalComponent>
                        {audit && evaluationFields.map((auditEval: any, index) => {
                            const checkpoint = auditEval.checkpoint
                            const period = checkpoint?.period
                            console.log('auditEval', auditEval)
                            return (
                                (!period || hasToBeDisplayed(checkpoint.updatedAt, audit.date.toString(), period)) &&
                                <Card key={`ch${auditEval.idEval * Date.now()}`} className={'checkCard'} style={{
                                    borderTop: `1px solid ${auditEval.checkpoint?.category?.color}`,
                                    borderRight: `1px solid ${auditEval.checkpoint?.category?.color}`,
                                    borderBottom: `1px solid ${auditEval.checkpoint?.category?.color}`,
                                    borderLeft: `8px solid ${auditEval.checkpoint?.category?.color}`,
                                    boxShadow: '0px 4px 12px #afafaf',
                                    height: '5.5rem',
                                    marginBottom: '1rem',
                                }}>
                                    <CardBody style={{ padding: '0.5rem' }}>
                                        <Row style={{ height: '87%' }}>
                                            <Col md={6}>
                                                <Row>
                                                    <Col>
                                                        <CardTitle tag='h3' className={'title'} style={{ height: '1rem', marginBottom: '0.4rem' }}>
                                                            {`${auditEval.checkpoint?.numero?.toString()?.padStart(2, '0')}. `}
                                                            {auditEval.checkpoint?.standard}
                                                            {auditEval.checkpoint?.zone?.name && ` | Zone ${auditEval.checkpoint.zone.name}`}
                                                            {auditEval.checkpoint?.subzone?.name && ` > ${auditEval.checkpoint.subzone.name}`}
                                                        </CardTitle>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        {auditEval.checkpoint?.description}
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col md={6} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
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
                                                                        type='radio'
                                                                        name={auditEval.checkpoint?.id.value}
                                                                        id={`edit_ok${auditEval.checkpoint?.id.toString()}`}
                                                                        value={'true'}
                                                                        checked={auditEval.check == "true"}
                                                                    />
                                                                    <label htmlFor={`edit_ok${auditEval.checkpoint?.id.toString()}`}>
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
                                                                        type='radio'
                                                                        name={auditEval.checkpoint?.id.toString()}
                                                                        id={`edit_nok${auditEval.checkpoint?.id.toString()}`}
                                                                        value={'false'}
                                                                        checked={auditEval.check == "false"}
                                                                    />
                                                                    <label htmlFor={`edit_nok${auditEval.checkpoint?.id.toString()}`}>
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
                                            {/* {console.log('checkpoint', auditEval.checkpoint)} */}
                                            {createPeriodicText(auditEval.checkpoint?.period)}
                                        </Row>
                                    </CardBody>
                                </Card>
                            )
                        })}
                    </CardBody>

                    <Row>
                        <Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.8rem' }}>
                            <Button color='success' type='submit' style={{ padding: '12px 24px', fontSize: '16px' }}>
                                Valider
                                <FontAwesomeIcon icon={faCheck} style={{ marginLeft: '10px', fontWeight: 'bold', fontSize: '16px' }} />
                            </Button>
                        </Col>
                    </Row>
                </form>
            </Modal.Body>
        </>
    )
}

export default EditAuditForm;
