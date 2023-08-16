import { Row, Card, Col, CardBody } from "reactstrap";
import { SuggestionForm } from "../components/suggestionForm/SuggestionForm";

export default function Suggestion() {
  return (
    <>
      <Card>
        <CardBody>
          <Row>
            <Col md={{ size: 12, offset: 0 }}>
              <SuggestionForm />
            </Col>
          </Row>
        </CardBody>
      </Card>
    </>
  );
}
