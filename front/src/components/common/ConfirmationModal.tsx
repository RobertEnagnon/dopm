import { Modal } from "react-bootstrap";
import { Button, Col, Row } from "reactstrap";
import "./ConfirmationModal.scss";

interface ConfirmationModalProps {
  title: string;
  description: string;
  open: any;
  hide: any;
  confirm: Function;
  style?: any
}

export const ConfirmationModal = ({
  title,
  description,
  open,
  hide,
  confirm,
  style
}: ConfirmationModalProps) => {
  const handleConfirmation = () => {
    confirm();
    hide();
  };
  return (
    <Modal show={open} onHide={hide} size="sm">
      <Modal.Header style={style}>
        <div className="title">{title}</div>
      </Modal.Header>
      <Modal.Body style={style}>
        <Row>
          <div className="description">{description}</div>
        </Row>
        <Row>
          <Col md={6}>
            <Button onClick={hide} block color="danger" size="md">
              Annuler
            </Button>
          </Col>
          <Col md={6}>
            <Button
              onClick={handleConfirmation}
              block
              color="success"
              size="md"
            >
              Confirmer
            </Button>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};
