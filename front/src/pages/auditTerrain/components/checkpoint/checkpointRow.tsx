import { Checkpoint } from "../../../../models/AuditTerrain/checkpoint";
import { Card, CardBody, CardTitle, Col, Row } from "reactstrap";


type CheckpointRowProps = {
    checkpoints: Array<Checkpoint>
}

const CheckpointRow = ({ checkpoints }: CheckpointRowProps) => {

    return (
        <>
            {checkpoints.map(checkpoint => {
                return (
                    <Card key={`ch${checkpoint.id * Date.now()}`} className={'checkCard'}
                        style={{
                            borderTop: `1px solid ${checkpoint.category?.color}`,
                            borderRight: `1px solid ${checkpoint.category?.color}`,
                            borderBottom: `1px solid ${checkpoint.category?.color}`,
                            borderLeft: `8px solid ${checkpoint.category?.color}`,
                            boxShadow: '0px 4px 12px #afafaf',
                            height: '5.5rem',
                            marginBottom: '1rem',
                        }}
                    >
                        <CardBody style={{ padding: '0.5rem' }}>
                            <Row style={{ height: '100%' }}>
                                <Col>
                                    <Row>
                                        <Col>
                                            <CardTitle tag='h3' className={'title'} style={{ height: '1rem', marginBottom: '0.4rem' }}>
                                                {`${checkpoint.numero?.toString()?.padStart(2, '0')}. `}
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
                            </Row>
                        </CardBody>
                    </Card>
                )
            })}
        </>
    )
}

export default CheckpointRow;
