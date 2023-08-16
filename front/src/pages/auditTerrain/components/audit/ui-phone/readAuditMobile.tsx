import {
    Button,
    Card,
    Col,
    CardBody,
    CardFooter,
    CardHeader,
    CardTitle,
    Container,
    FormGroup, Input,
    Label,
    Row
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faX } from "@fortawesome/free-solid-svg-icons";
import { Audit } from "../../../../../models/AuditTerrain/audit";
import { hasToBeDisplayed, createPeriodicText } from '../../../../../services/period';
import { Grid } from "@material-ui/core";
import ModalComponent from "../../../../../components/layout/modal";
import React, { useState } from "react";

type ReadAuditProps = {
    audit: Audit
}

const ReadAuditMobile = ({ audit }: ReadAuditProps) => {
    const PUBLIC_API = process.env.REACT_APP_PUBLIC_URL;

    const [pictureModal, setPictureModal] = useState<boolean>(false);
    const [selectedLine, setSelectedLine] = useState<number>(-1);

    return (
        <>
            {audit?.Evaluations &&
                <ModalComponent
                    open={pictureModal}
                    hide={() => {
                        setPictureModal(false)
                        setSelectedLine(-1);
                    }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle tag="h3">
                                Détails de la photo
                            </CardTitle>
                        </CardHeader>
                        <CardBody>
                            <Container fluid>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: '3rem'
                                }}>
                                    <img
                                        style={{
                                            maxHeight: '100%',
                                            maxWidth: '100%'
                                        }}
                                        src={`${PUBLIC_API}${audit.Evaluations[selectedLine]?.image}`}
                                        alt="photoAudit"
                                    />
                                    <FormGroup style={{ width: '75%' }}>
                                        <Label htmlFor='evalComment' style={{ display: 'block' }}>
                                            Commentaire
                                        </Label>
                                        <Input disabled type="text" value={audit?.Evaluations[selectedLine]?.comment} />
                                    </FormGroup>
                                </div>
                            </Container>
                        </CardBody>
                        <CardFooter>
                            <Grid
                                container
                                direction="column"
                                justifyContent="flex-start"
                                alignItems="flex-end"
                                spacing={1}
                            >
                                <Button color='primary' onClick={() => setPictureModal(false)}
                                    style={{ padding: '12px 24px', fontSize: '16px' }}>
                                    Fermer
                                    <FontAwesomeIcon icon={faX} style={{
                                        marginLeft: '10px',
                                        fontWeight: 'bold',
                                        fontSize: '16px'
                                    }} />
                                </Button>
                            </Grid>
                        </CardFooter>
                    </Card>
                </ModalComponent>
            }
            <CardBody>
                {audit.Evaluations?.map((auditEval: any, index) => {
                    const checkpoint = auditEval.checkpoint
                    const period = checkpoint?.period
                    console.log("checkpoint", checkpoint)
                    return (
                        (!period || hasToBeDisplayed(checkpoint.updatedAt, audit.date.toString(), period)) &&
                        <Card key={`ch${auditEval.id * Date.now()}`} className={'checkCard'} style={{
                            borderTop: `1px dotted ${auditEval.checkpoint?.category?.color}`,
                            borderRight: `1px dotted ${auditEval.checkpoint?.category?.color}`,
                            borderBottom: `1px dotted ${auditEval.checkpoint?.category?.color}`,
                            borderLeft: `10px solid ${auditEval.checkpoint?.category?.color}`,
                            boxShadow: '0px 4px 12px #afafaf',
                            height: '5rem',
                            marginBottom: '1rem',
                        }}>
                            <CardBody style={{ padding: '0.5rem' }}>
                                <Row className="mx-0" style={{ height: '100%' }}>
                                <Col  md={9} className="mr-1 px-0" style={{ display: 'flex', flexDirection: "column", width: '60%' }}>
                                    {/* <div className="mr-1 px-0" style={{ display: 'flex', flexDirection: "column", width: '60%' }}> */}
                                        <CardTitle tag='h3' className={'title'} style={{ height: '1rem' }}>
                                            {`${auditEval.checkpoint?.numero?.toString()?.padStart(2, '0')}. `}
                                            {auditEval.checkpoint?.standard}
                                            {auditEval.checkpoint?.zone?.name && ` | Zone ${auditEval.checkpoint.zone.name}`}
                                            {auditEval.checkpoint?.subzone?.name && ` > ${auditEval.checkpoint.subzone.name}`}
                                        </CardTitle>
                                        <p className="descriptionCheckpoint">{auditEval.checkpoint?.description}</p>
                                    {/* </div> */}
                                </Col>
                                <Col md={3} className="px-0" style={{ display: 'flex', flexDirection: "row-reverse", alignItems: "center", width: '37%'}}>
                                    {/* <div className="px-0" style={{ display: 'flex', flexDirection: "row", alignItems: "center", width: '30%' }}> */}
                                        
                                        <div className={'radioCheckRead'}>
                                            <input
                                                style={{ display: "none" }}
                                                type='radio'
                                                name={auditEval.checkpoint?.id.toString()}
                                                id={`ok${auditEval.checkpoint?.id}`}
                                                value={'true'}
                                                checked={auditEval.check == 'true'}
                                                disabled
                                            />
                                            <label htmlFor={`ok${auditEval.checkpoint?.id}`}>
                                                <FontAwesomeIcon icon={faCheck} />
                                            </label>
                                        </div>
                                        <div className={'radioCrossRead'}>
                                            <input
                                                style={{ display: "none" }}
                                                type='radio'
                                                name={auditEval.checkpoint?.id.toString()}
                                                id={`nok${auditEval.checkpoint?.id}`}
                                                value={'false'}
                                                checked={auditEval.check == 'false'}
                                                disabled
                                            />
                                            <label htmlFor={`nok${auditEval.checkpoint?.id}`}>
                                                <FontAwesomeIcon icon={faX} />
                                            </label>
                                        </div>
                                        {auditEval.image &&
                                            <div style={{ width: '30px', height: '30px', margin: '12px 3px' }}>
                                                <img
                                                    style={{ borderRadius: '100%', width: '100%', height: '100%' }}
                                                    src={`${PUBLIC_API}${auditEval.image}`}
                                                    onClick={() => {
                                                        setSelectedLine(index);
                                                        setPictureModal(true);
                                                    }}
                                                />
                                            </div>
                                        }
                                    {/* </div> */}
                                    </Col>
                                </Row>
                                <Row style={{ justifyContent: "center", color: '#E0E0E0', fontStyle: 'italic', fontSize: '0.6rem', position: 'absolute', top: '80%', width: '100%' }}>
                                    {createPeriodicText(auditEval.checkpoint?.period)}
                                </Row>
                            </CardBody>
                        </Card>
                    )
                })}
            </CardBody>
        </>
    )
}

export default ReadAuditMobile;
