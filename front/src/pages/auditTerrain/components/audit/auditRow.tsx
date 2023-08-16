import {Checkpoint} from "../../../../models/AuditTerrain/checkpoint";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    CardTitle,
    Container,
    FormGroup,
    Input,
    Label,
    Row
} from "reactstrap";
import {PhotoCamera} from "@material-ui/icons";
import {Grid, IconButton} from "@material-ui/core";
import React, {useState} from "react";
import {Evaluation} from "../../../../models/AuditTerrain/evaluation";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faX} from "@fortawesome/free-solid-svg-icons";
import ModalComponent from "../../../../components/layout/modal";
import {hasToBeDisplayed} from "../../../../services/period";

type AuditRowProps = {
    checkpoints: Array<Checkpoint>,
    audit: any,
    date?: Date,
}

const AuditRow = ({ checkpoints, audit, date } : AuditRowProps) => {
    const PUBLIC_API = process.env.REACT_APP_PUBLIC_URL;

    const [pictureModal, setPictureModal] = useState<boolean>(false);
    const [selectedLine, setSelectedLine] = useState<number>(-1);

    return (
        <>
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
                                padding: '3rem',
                                gap: '6px'
                            }}>
                                <img
                                    style={{
                                        maxHeight: '100%',
                                        maxWidth: '100%'
                                    }}
                                    src={`${PUBLIC_API}${audit?.Evaluations[selectedLine]?.image}`}
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
                            <Button color='primary' onClick={()=>setPictureModal(false)} style={{ padding: '12px 24px', fontSize: '16px' }}>
                                Fermer
                                <FontAwesomeIcon icon={faX} style={{ marginLeft: '10px', fontWeight: 'bold', fontSize: '16px' }} />
                            </Button>
                        </Grid>
                    </CardFooter>
                </Card>
            </ModalComponent>
            {checkpoints.map((checkpoint, index) => {
                let AuditEval = audit?.Evaluations?.find((ae:Evaluation) => ae?.checkpoint?.id === checkpoint.id);
                let testDate = date;
                if(!date) {
                    testDate = audit?.date
                }

                const displayable = !checkpoint.period || !testDate || hasToBeDisplayed(checkpoint.updatedAt.toString(), testDate.toString(), checkpoint.period);

                return (
                    <Card key={`ch${checkpoint.id*Date.now()}`} className={displayable ? 'checkCard' : 'grayCheckCard'}
                          style={{
                              border: `1px solid ${checkpoint.category?.color}`,
                              boxShadow: '0px 4px 12px #afafaf',
                              backgroundColor: checkpoint.color,
                              height: '5.5rem',
                              marginBottom: '1rem',

                          }}
                    >
                        {displayable &&
                            <CardBody style={{ padding: '0.5rem' }}>
                                <Row style={{ height: '100%', justifyContent: 'center' }}>
                                    <div style={{ display: 'flex', justifyContent: 'center' }} >
                                        {AuditEval?.image ?
                                            <div style={{ width: '50px', height: '50px', margin: '12px 3px'}}>
                                                <img
                                                    style={{ borderRadius: '100%', width: '100%', height: '100%' }}
                                                    src={`${PUBLIC_API}${AuditEval?.image}`}
                                                    onClick={() => {
                                                        setSelectedLine(index);
                                                        setPictureModal(true);
                                                    }}
                                                />
                                            </div>
                                            :
                                            <IconButton
                                                style={{ border: '1px solid #3f51b5', width: '50px', height: '50px', margin: '12px 3px' }}
                                                color="primary"
                                                type="button"
                                            >
                                                <PhotoCamera/>
                                            </IconButton>
                                        }
                                        {AuditEval?.check == 'true' ?
                                            <div className={'radioCheckRead'}>
                                                <input
                                                    style={{ display: "none" }}
                                                    type='radio'
                                                    checked={true}
                                                    disabled
                                                />
                                                <label htmlFor={`ok${AuditEval?.checkpoint?.id}`}>
                                                    <FontAwesomeIcon icon={faCheck} />
                                                </label>
                                            </div>
                                            :
                                            <>
                                                {AuditEval?.check == 'false' ?
                                                    <div className={'radioCrossRead'}>
                                                        <input
                                                            style={{ display: "none" }}
                                                            type='radio'
                                                            checked={true}
                                                            disabled
                                                        />
                                                        <label htmlFor={`nok${AuditEval?.checkpoint?.id}`}>
                                                            <FontAwesomeIcon icon={faX} />
                                                        </label>
                                                    </div>
                                                    :
                                                    <div className={'radioNARead'}>
                                                        <input
                                                            style={{ display: "none" }}
                                                            type='radio'
                                                            checked={false}
                                                            disabled
                                                        />
                                                        <label htmlFor={`ok${AuditEval?.checkpoint?.id}`}>
                                                            N/A
                                                        </label>
                                                    </div>
                                                }
                                            </>
                                        }
                                    </div>
                                </Row>
                            </CardBody>
                        }
                    </Card>
                )
            })}
        </>
    )
}

export default AuditRow
