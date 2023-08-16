import React from "react";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, ModalBody, ModalFooter, ModalHeader, Spinner } from "reactstrap";
import { Permission } from "../../../../models/Right/permission";

interface Props {
  onDelete(_permissionId: number): void,
  onClose(): void,
  permission: Permission,
  isPending: boolean
}

const DeletePermissionModal: React.FC<Props> = ({ onDelete, onClose, permission, isPending }) => {

  return <>
    <ModalHeader
      close={
        <button className="close" onClick={onClose}>
          ×
        </button>
      }
      toggle={onClose}
    >
      Supprimer la permission
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
          Êtes-vous sûr de vouloir supprimer la permission ?
        </h3>
      </div>
    </ModalBody>
    <ModalFooter>
      <Button color="primary" onClick={onClose}>
        Annuler
      </Button>
      <Button color="danger" className="btn-spinner" onClick={() => {onDelete(permission.id)}} disabled={isPending}>
        Supprimer
        {isPending && <Spinner size="sm" children=""/>}
      </Button>
    </ModalFooter>
  </>
}

export default DeletePermissionModal