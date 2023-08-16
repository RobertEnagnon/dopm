import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons'
import { Container, Col, Row } from "reactstrap"
//----------------------------------------------------------------
// Composant : Feature
// Il s'agit d'un form à remplir plus la possibilité de supprimer
// la nouvelle feature
//----------------------------------------------------------------

interface FeatureProps {
    index: number;
    value: string;
    onChange: (_i: number, _v: string) => void;
    onDelete: (_i: number) => void;
}

const Feature = ({ index, value, onChange, onDelete }: FeatureProps) => {
    return (
        < div style={{ padding: 5 }}>
            <Container>
                <Row>
                    <Col xs="11">
                        <Form.Control
                            placeholder="Nouvelle feature.."
                            value={value}
                            onChange={(e) => onChange(index, e.target.value)} />
                    </Col>
                    <Col xs="1">
                        <FontAwesomeIcon
                            icon={faClose}
                            fixedWidth
                            className="align-middle m-2"
                            size="lg"
                            onClick={() => { onDelete(index) }}
                            style={{ cursor: 'pointer' }} />
                    </Col>
                </Row>
            </Container>
        </div >);
}

export default Feature