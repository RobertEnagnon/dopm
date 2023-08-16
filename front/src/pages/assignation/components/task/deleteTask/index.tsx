import { Modal } from "react-bootstrap";
import {Button} from "reactstrap";

const DeleteTask = (props: { message: string, confirmModal: Function }) => {
    const { message } = props;
    return (
        <>
            <Modal.Header>
                <Modal.Title>
                    Suppression Tâche
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="alert alert-danger p-20">{message}</div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='danger' onClick={() => {props.confirmModal()}}>
                    Supprimer
                </Button>
            </Modal.Footer>
        </>
    )
}

export default DeleteTask;