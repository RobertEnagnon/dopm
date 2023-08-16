import React from "react";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, ModalBody, ModalFooter, ModalHeader, Spinner } from "reactstrap";
import { Group } from "../../../../models/Right/group";

interface Props {
  onDelete(_groupId: number): void,
  onClose(): void,
  group: Group,
  isPending: boolean
}

const DeleteGroupModal: React.FC<Props> = ({ onDelete, onClose, group, isPending }) => {

  return <>
    <ModalHeader
      close={
        <button className="close" onClick={onClose}>
          ×
        </button>
      }
      toggle={onClose}
    >
      Supprimer le groupe
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
          Êtes-vous sûr de vouloir supprimer le groupe ?
        </h3>
      </div>
    </ModalBody>
    <ModalFooter>
      <Button color="primary" onClick={onClose}>
        Annuler
      </Button>
      <Button color="danger" className="btn-spinner" onClick={() => {onDelete(group.id)}} disabled={isPending}>
        Supprimer
        {isPending && <Spinner size="sm" children=""/>}
      </Button>
    </ModalFooter>
  </>
}

export default DeleteGroupModal