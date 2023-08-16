import { Modal, Button } from "react-bootstrap";

const DeleteCategoryForm = (props: { message: string, confirmModal: Function, title: string }) => {
  const { message } = props;
  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
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

export default DeleteCategoryForm;
