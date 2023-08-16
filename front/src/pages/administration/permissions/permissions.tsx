import { Button, Col, Row, Table } from "reactstrap";
import Modal from "../../../components/layout/modal";
import CreatePermissionModal from "./addForm";
import UpdatePermissionModal from "./editForm";
import DeletePermissionModal from "./deleteForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import { usePermission } from "../../../hooks/Right/permission";
import { Permission } from "../../../models/Right/permission";

const RightPermissions = () => {
  const { permissions, createPermission, updatePermission, deletePermission } =
    usePermission();
  const [selectedPermission, setSelectedPermission] = useState<Permission>();
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const onClose = () => {
    setIsAddModalOpen(false);
    setIsUpdateModalOpen(false);
    setIsDeleteModalOpen(false);
  };

  const handleCreatePermission = async (permission: Permission) => {
    setIsPending(true);
    await createPermission(permission);
    setIsPending(false);
    setIsAddModalOpen(false);
  };

  const handleUpdatePermission = async (permission: Permission) => {
    setIsPending(true);
    await updatePermission(selectedPermission!.id, permission.name);
    setIsPending(false);
    setIsUpdateModalOpen(false);
  };

  const handleDeletePermission = async (id: number) => {
    setIsPending(true);
    await deletePermission(id);
    setIsPending(false);
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <Row className="mb-4 align-items-end">
        <Col>
          <h6 className="card-subtitle text-muted">
            Gestion des <code>permissions</code>.
          </h6>
        </Col>
        <Col style={{display: 'flex', justifyContent: 'flex-end'}}>
        {isAddModalOpen ? null : (
          <Button
            color="success"
            onClick={() => {
              setIsAddModalOpen(true);
            }}
          >
            +
          </Button>
        )}
        </Col>
      </Row>
      {/* Popup to create a permission */}
      <Modal open={isAddModalOpen} hide={setIsAddModalOpen} size="sm">
        <CreatePermissionModal
          onSave={handleCreatePermission}
          onClose={onClose}
          isPending={isPending}
        />
      </Modal>

      {/*/!* Popup to update a permission *!/*/}
      <Modal open={isUpdateModalOpen} hide={setIsUpdateModalOpen} size="sm">
        <UpdatePermissionModal
          onSave={handleUpdatePermission}
          onClose={onClose}
          permission={selectedPermission!}
          isPending={isPending}
        />
      </Modal>

      {/*/!* Popup to delete a permission *!/*/}
      <Modal open={isDeleteModalOpen} hide={setIsDeleteModalOpen} size="sm">
        <DeletePermissionModal
          onDelete={handleDeletePermission}
          onClose={onClose}
          permission={selectedPermission!}
          isPending={isPending}
        />
      </Modal>

      <Row>
        <Col md={12}>
          <Table striped hover>
            <thead>
              <th>Nom</th>
              <th></th>
            </thead>
            <tbody>
              {permissions?.map((permission, index) => {
                return (
                  <tr key={index}>
                    <td>{permission.name}</td>
                    <td>
                      <div className="d-flex flex-row justify-content-center align-items-center">
                        <FontAwesomeIcon
                          icon={faPen}
                          fixedWidth
                          className="align-middle mr-3"
                          onClick={() => {
                            setSelectedPermission(permission);
                            setIsUpdateModalOpen(true);
                          }}
                        />
                        <FontAwesomeIcon
                          icon={faTrash}
                          fixedWidth
                          className="align-middle"
                          onClick={() => {
                            setSelectedPermission(permission);
                            setIsDeleteModalOpen(true);
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Col>
      </Row>
    </>
  );
};

export default RightPermissions;
