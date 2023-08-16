import { Button, Col, Row, Table } from "reactstrap";
import Modal from "../../../components/layout/modal";
import CreateGroupModal from "./addForm";
import UpdateGroupModal from "./editForm";
import DeleteGroupModal from "./deleteForm";
import React, { useState } from "react";
import { useGroup } from "../../../hooks/Right/group";
import { Group } from "../../../models/Right/group";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";

const RightPermissions = () => {
  const { groupes, createGroup, updateGroup, deleteGroup } = useGroup();
  const [selectedGroup, setSelectedGroup] = useState<Group>();
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const onClose = () => {
    setIsAddModalOpen(false);
    setIsUpdateModalOpen(false);
    setIsDeleteModalOpen(false);
  };

  const handleCreateGroup = async (group: Group) => {
    setIsPending(true);
    await createGroup(group);
    setIsPending(false);
    setIsAddModalOpen(false);
  };

  const handleUpdateGroup = async (group: Group) => {
    setIsPending(true);
    await updateGroup(selectedGroup!.id, group.name);
    setIsPending(false);
    setIsUpdateModalOpen(false);
  };

  const handleDeleteGroup = async (id: number) => {
    setIsPending(true);
    await deleteGroup(id);
    setIsPending(false);
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      {/* Popup to create a group */}
      <Modal open={isAddModalOpen} hide={setIsAddModalOpen} size="sm">
        <CreateGroupModal
          onSave={handleCreateGroup}
          onClose={onClose}
          isPending={isPending}
        />
      </Modal>

      {/*/!* Popup to update a group *!/*/}
      <Modal open={isUpdateModalOpen} hide={setIsUpdateModalOpen} size="sm">
        <UpdateGroupModal
          onSave={handleUpdateGroup}
          onClose={onClose}
          group={selectedGroup!}
          isPending={isPending}
        />
      </Modal>

      {/*/!* Popup to delete a group *!/*/}
      <Modal open={isDeleteModalOpen} hide={setIsDeleteModalOpen} size="sm">
        <DeleteGroupModal
          onDelete={handleDeleteGroup}
          onClose={onClose}
          group={selectedGroup!}
          isPending={isPending}
        />
      </Modal>

      <Row className="mb-4 align-items-end">
        <Col>
          <h6 className="card-subtitle text-muted">
            Gestion des <code>groupes</code>.
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

      <Row>
        <Col md={12}>
          <Table striped hover>
            <thead>
              <th>Nom</th>
              <th></th>
            </thead>
            <tbody>
              {groupes?.map((group, index) => {
                return (
                  <tr key={index}>
                    <td>{group.name}</td>
                    <td>
                      <div className="d-flex flex-row justify-content-center align-items-center">
                        <FontAwesomeIcon
                          icon={faPen}
                          fixedWidth
                          className="align-middle mr-3 button"
                          onClick={() => {
                            setSelectedGroup(group);
                            setIsUpdateModalOpen(true);
                          }}
                        />
                        <FontAwesomeIcon
                          icon={faTrash}
                          fixedWidth
                          className="align-middle button"
                          onClick={() => {
                            setSelectedGroup(group);
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
