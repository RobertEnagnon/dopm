import { Button, Col, Row, Table } from "reactstrap";
import ModalComponent from "../../modal";
import AddClassificationForm from "./addClassification";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import DeleteClassification from "./deleteClassification";
import EditClassification from "./editClassification";
import moment from "moment";
import React, { useState } from "react";
import { Classification } from "../../../../models/FicheSecurite/classification";
import { useClassification } from "../../../../hooks/FicheSecurite/classification";
import { notify, NotifyActions } from "../../../../utils/dopm.utils";

const Classifications = () => {
  const {
    classifications,
    addClassification,
    updateClassification,
    deleteClassification,
  } = useClassification();
  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [selectedClassificationId, setSelectedClassificationId] =
    useState<number>();
  const [selectedClassification, setSelectedClassification] =
    useState<Classification>();

  // close modal add categorie
  const closeModal = (action: "add" | "edit" | "delete") => {
    switch (action) {
      case "add":
        setOpenAdd(false);
        break;
      case "edit":
        setOpenEdit(false);
        break;
      case "delete":
        setOpenDelete(false);
    }
  };

  // open modal add fscategory
  const openModal = (action: "add" | "edit" | "delete", index?: number) => {
    switch (action) {
      case "add":
        setOpenAdd(true);
        break;
      case "edit":
        if (index !== undefined) {
          setOpenEdit(true);
          setSelectedClassification(classifications[index]);
        }
        break;
      case "delete":
        if (index !== undefined) {
          setOpenDelete(true);
          setSelectedClassificationId(index);
        }
    }
  };

  // Suppression d'un classification
  const handleDeleteClassification = async (index: number) => {
    const classificationId = classifications[index].id;
    const response = await deleteClassification(classificationId);

    if (response.message) {
      closeModal("delete");
      notify(response.message, NotifyActions.Successful);
    } else {
      notify(response.error, NotifyActions.Error);
    }
  };

  return (
    <>
      <Row className="mb-4 align-items-end">
        <Col>
          <h6 className="card-subtitle text-muted">
            Gestion des <code>classifications</code>.
          </h6>
        </Col>

        <Col>
          <Row>
            <Col md={{ size: 1, offset: 11 }}>
              <Button block color="success" onClick={() => openModal("add")}>
                +
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>

      <ModalComponent
        children={
          <AddClassificationForm
            addClassification={addClassification}
            closeModalAdd={() => closeModal("add")}
          />
        }
        open={openAdd}
        hide={() => closeModal("add")}
      />
      <ModalComponent
        children={
          <EditClassification
            updateClassification={updateClassification}
            closeModalEdit={() => closeModal("edit")}
            classification={selectedClassification}
          />
        }
        open={openEdit}
        hide={() => closeModal("edit")}
      />
      <ModalComponent
        children={
          <DeleteClassification
            message="êtes-vous sûre de vouloir supprimer cette Classification ?"
            confirmModal={() =>
              selectedClassificationId !== undefined &&
              handleDeleteClassification(selectedClassificationId)
            }
          />
        }
        open={openDelete}
        hide={() => closeModal("delete")}
      />
      <Table striped hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom </th>
            <th>Description</th>
            <th>Date de création</th>
            <th>Date de modification</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {classifications &&
            classifications.map((classification, index) => {
              return (
                <tr key={index}>
                  <td>{classification.id}</td>
                  <td>{classification.name}</td>
                  <td>{classification.description}</td>
                  <td>
                    {moment(
                      new Date(classification.createdAt),
                      "DD-MM-YYYY hh:mm"
                    ).format("DD-MM-YYYY hh:mm")}
                  </td>
                  <td>
                    {moment(
                      new Date(classification.updatedAt),
                      "DD-MM-YYYY hh:mm"
                    ).format("DD-MM-YYYY hh:mm")}
                  </td>
                  <td className="table-action">
                    <FontAwesomeIcon
                      icon={faPen}
                      fixedWidth
                      className="align-middle mr-3 btn-icon"
                      onClick={() => openModal("edit", index)}
                    />

                    <FontAwesomeIcon
                      icon={faTrash}
                      fixedWidth
                      className="align-middle btn-icon"
                      onClick={() => openModal("delete", index)}
                    />
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
    </>
  );
};

export default /*connect((store) => ({
  theme: store.theme.currentTheme,
}))*/ Classifications;
