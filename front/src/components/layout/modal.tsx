import { Modal } from "react-bootstrap";

const ModalComponent = (props: { open: any, hide: any, size?: 'sm' | 'lg' | 'xl', children: any }) => {
    return (
        <Modal show={props.open} onHide={props.hide} size={props.size || "xl"}>
            {props.children}
        </Modal>
    );
}

export default ModalComponent;
