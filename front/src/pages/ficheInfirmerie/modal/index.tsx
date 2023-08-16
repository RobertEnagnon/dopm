import { Modal } from "react-bootstrap";
import { ReactElement } from "react";
import "react-toastify/dist/ReactToastify.css";

type ModalComponentType = {
  children: ReactElement,
  open: boolean,
  hide: () => void
}

const ModalComponent = (props: ModalComponentType) => {
  return (
    <Modal show={props.open} onHide={props.hide}>
      {props.children}
    </Modal>
  );
}

export default (ModalComponent);
