import { useState } from "react";
import { Button, Col, Row, Table } from "reactstrap";
import ModalComponent from "../../modal";
import AddFSCategoryForm from "./addFSCategory";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import DeleteFSCategory from "./deleteFSCaetgory";
import EditFSCategoryForm from "./editFSCategory";
import moment from "moment";
import { Category } from "../../../../models/Top5/category";
import { useFSCategory } from "../../../../hooks/FicheSecurite/fsCategory";
import { notify, NotifyActions } from "../../../../utils/dopm.utils";

const FSCategories = () => {
  const { fscategories, addFSCategory, updateFSCategory, deleteFSCategory } =
    useFSCategory();
  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [selectedFSCategoryId, setSelectedFSCategoryId] = useState<number>();
  const [selectedFSCategory, setSelectedFSCategory] = useState<Category>();

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
          setSelectedFSCategory(fscategories[index]);
        }
        break;
      case "delete":
        if (index !== undefined) {
          setOpenDelete(true);
          setSelectedFSCategoryId(index);
        }
    }
  };

  // Suppression d'un fscategory
  const handleDeleteFSCategory = async (index: number) => {
    const fscategoryId = fscategories[index].id;

    const deletedItem = await deleteFSCategory(fscategoryId);
    if (deletedItem.message) {
      setOpenDelete(false);
      notify("Categorie supprimée", NotifyActions.Successful);
    } else {
      notify("Suppression impossible", NotifyActions.Error);
    }
  };

  return (
    <>
      <Row className="mb-4 align-items-end">
        <Col>
          <h6 className="card-subtitle text-muted">
            Gestion des <code>catégories</code>
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
          <AddFSCategoryForm
            addFSCategory={addFSCategory}
            closeModalAdd={() => closeModal("add")}
          />
        }
        open={openAdd}
        hide={() => closeModal("add")}
      />
      <ModalComponent
        children={
          <EditFSCategoryForm
            closeModalEdit={() => closeModal("edit")}
            updateFSCategory={updateFSCategory}
            fscategory={selectedFSCategory}
          />
        }
        open={openEdit}
        hide={() => closeModal("edit")}
      />
      <ModalComponent
        children={
          <DeleteFSCategory
            message={`êtes-vous sûre de vouloir supprimer cette Categorie ${
              fscategories?.[selectedFSCategoryId || 0]?.name
            }`}
            confirmModal={() => {
              selectedFSCategoryId !== undefined &&
                handleDeleteFSCategory(selectedFSCategoryId);
            }}
          />
        }
        open={openDelete}
        hide={() => closeModal("delete")}
      />
      <Table striped hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Description</th>
            <th>Date de creation</th>
            <th>Date de modification</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {fscategories &&
            fscategories.map((fscategory, index) => {
              return (
                <tr key={index}>
                  <td>{fscategory.id}</td>
                  <td>{fscategory.name}</td>
                  <td>{fscategory.description}</td>
                  <td>
                    {fscategory.createdAt
                      ? moment(
                          typeof fscategory.createdAt === "string"
                            ? new Date(fscategory.createdAt)
                            : fscategory.createdAt,
                          "DD-MM-YYYY hh:mm"
                        ).format("DD-MM-YYYY hh:mm")
                      : null}
                  </td>
                  <td>
                    {fscategory.createdAt
                      ? moment(
                          typeof fscategory.updatedAt === "string"
                            ? new Date(fscategory.updatedAt)
                            : fscategory.updatedAt,
                          "DD-MM-YYYY hh:mm"
                        ).format("DD-MM-YYYY hh:mm")
                      : null}
                  </td>
                  <td className="table-action">
                    <FontAwesomeIcon
                      icon={faPen}
                      style={{ cursor: "pointer" }}
                      fixedWidth
                      className="align-middle mr-3 btn-icon"
                      onClick={() => openModal("edit", index)}
                    />

                    <FontAwesomeIcon
                      icon={faTrash}
                      style={{ cursor: "pointer" }}
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
}))*/ FSCategories;
