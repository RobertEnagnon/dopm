import * as React from "react";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, ModalBody, ModalFooter, ModalHeader, Spinner } from "reactstrap";
import './branch.scss';

interface Props {
    onDelete(_branchData: number): void,
    onClose(): void,
    selectedBranch: number,
    isPending: boolean
}

const DeleteBranchModal: React.FC<Props> = ({ onDelete, onClose, selectedBranch, isPending }) => {

    return <>
        <ModalHeader
            close={
            <button className="close" onClick={onClose}>
                ×
            </button>
            }
            toggle={onClose}
        >
        Supprimer la branche
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
                Êtes-vous sûr de vouloir supprimer la branche ?
            </h3>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={onClose}>
          Annuler
        </Button>
        <Button color="danger" className="btn-spinner" onClick={() => {onDelete(selectedBranch)}} disabled={isPending}>
          Supprimer
          {isPending && <Spinner size="sm" children=""/>}
        </Button>
      </ModalFooter>
    </>
}

export default DeleteBranchModal