import {useState} from "react";
import {Button, Col, Row, Table,} from "reactstrap";
import ModalComponent from "../../modal";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen, faTrash} from "@fortawesome/free-solid-svg-icons";
import AddCategoriesForm from "../category/addCategory";
import EditCategoryForm from "../category/editCategory";
import DeleteCategoryForm from "../category/deleteCaetgory";
import moment from "moment";
import {notify, NotifyActions} from "../../../../utils/dopm.utils";
import { useCategory } from "../../../../hooks/FicheInfirmerie/fiCategory";
import { MaterialElements } from "../../../../models/materialElements";

const MaterialElementComp = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategory<MaterialElements>({endpoint: 'fi_materialElements'})
  const [openAdd, setOpenAdd] = useState<boolean>(false)
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>()
  const [selectedCategory, setSelectedCategory] = useState<MaterialElements>()

  // close modal
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
  }

  // open modal
  const openModal = (action: "add" | "edit" | "delete", index?: number) => {
    switch (action) {
      case "add":
        setOpenAdd(true)
        break
      case "edit":
        if (index !== undefined) {
          setOpenEdit(true)
          setSelectedCategory(categories[index])
        }
        break
      case "delete":
        if (index !== undefined) {
          setOpenDelete(true)
          setSelectedCategoryId(index)
        }
    }
  }

  // Suppression
  const handleDeleteFiInjCategory = async (index: number) => {
    const fscategoryId = categories[index].id;

    const deletedItem = await deleteCategory(fscategoryId)
    if (deletedItem.message) {
      setOpenDelete(false)
      notify("Suppression reussi", NotifyActions.Successful)
    } else {
      notify("Suppression impossible", NotifyActions.Error)
    }
  }

  return (
    <>
      <Row className="mb-4 align-items-end">
        <Col>
          <h6 className="card-subtitle text-muted">
            Gestion des <code>éléments matériels</code>
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
          <AddCategoriesForm
            title={"Ajout de categorie"}
            addCategory={addCategory}
            closeModalAdd={() => closeModal("add")}
          />
        }
        open={openAdd}
        hide={() => closeModal("add")}
      />
      <ModalComponent
        children={
          <EditCategoryForm
            title={`Modification de la categorie ${selectedCategory?.name}`}
            closeModalEdit={() => closeModal("edit")}
            updateCategory={updateCategory}
            category={selectedCategory}
          />
        }
        open={openEdit}
        hide={() => closeModal("edit")}
      />
      <ModalComponent
        children={
          <DeleteCategoryForm
            title={"Suppression de la categorie"}
            message={`êtes-vous sûre de vouloir supprimer cet element ${
              categories?.[
                selectedCategoryId || 0
              ]?.name
            }`}
            confirmModal={() => {
              selectedCategoryId !== undefined &&
              handleDeleteFiInjCategory(selectedCategoryId)
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
            <th>Date de creation</th>
            <th>Date de modification</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories &&
            categories.map((category, index) => {
              return (
                <tr key={index}>
                  <td>{category.id}</td>
                  <td>{category.name}</td>
                  <td>
                    {category.createdAt
                        ? moment(
                        typeof category.createdAt === "string"
                          ? new Date(category.createdAt)
                          : category.createdAt,
                      "DD-MM-YYYY hh:mm"
                      ).format("DD-MM-YYYY hh:mm")
                      : null}
                  </td>
                  <td>
                    {category.createdAt
                        ? moment(
                            typeof category.updatedAt === "string"
                                ? new Date(category.updatedAt)
                                : category.updatedAt,
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
              )
            })}
        </tbody>
      </Table>
    </>
  );
}

export default (MaterialElementComp)
