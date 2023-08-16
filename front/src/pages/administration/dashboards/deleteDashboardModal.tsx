import * as React from "react";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, ModalBody, ModalFooter, ModalHeader, Spinner } from "reactstrap";
import './dashboard.scss';

interface Props {
    onDelete(_dashboardId: number): void,
    onClose(): void,
    selectedDashboard: number,
    isPending: boolean
}

const DeleteDashboardModal: React.FC<Props> = ({ onDelete, onClose, selectedDashboard, isPending }) => {

    return <>
        <ModalHeader
            close={
            <button className="close" onClick={onClose}>
                ×
            </button>
            }
            toggle={onClose}
        >
            Supprimer la dashboard
        </ModalHeader>
      <ModalBody>
        <div className="popup">
            <FontAwesomeIcon
                icon={faExclamationCircle}
                fixedWidth
                size="8x"
                color="red"
                className="align-middle"
            />
            <h3>
                Êtes-vous sûr de vouloir supprimer ce dashboard ?
            </h3>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={onClose}>
          Annuler
        </Button>
        <Button color="danger" className="btn-spinner" onClick={() => {onDelete(selectedDashboard)}} disabled={isPending}>
          Supprimer
          {isPending && <Spinner size="sm" children=""/>}
        </Button>
      </ModalFooter>
    </>
}

export default DeleteDashboardModal