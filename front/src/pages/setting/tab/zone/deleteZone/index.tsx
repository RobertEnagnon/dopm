import { Modal, Button } from "react-bootstrap";

const DeleteZone = (props: { message: string, confirmModal: Function }) => {
  const { message } = props;
  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Confirmation de suppression</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="alert alert-danger">{message}</div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={() => props.confirmModal()}>
          Delete
        </Button>
      </Modal.Footer>
    </>
  );
}

export default DeleteZone;
