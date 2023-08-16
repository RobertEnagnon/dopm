import { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Container,
  Button,
  Col,
  Row,
  Table,
} from "reactstrap";
import ModalComponent from "../../modal";
import AddResponsibleForm from "./addResponsible";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import DeleteResponsible from "./deleteResponsible";
import EditResponsibleForm from "./editResponsible";
import moment from "moment";
import {Responsible} from "../../../../models/responsible";
import {useResponsible} from "../../../../hooks/responsible";
import {notify, NotifyActions} from "../../../../utils/dopm.utils";

const Responsibles = () => {
  const { responsibles, addResponsible, updateResponsible, deleteResponsible } = useResponsible();
  const [openAdd, setOpenAdd] = useState<boolean>(false)
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const [selectedResponsibleId, setSelectedResponsibleId] = useState<number>();
  const [selectedResponsible, setselectedResponsible] = useState<Responsible>();

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
  }

  // open modal add fscategory
  const openModal = (action: "add" | "edit" | "delete", index?: number) => {
    switch (action) {
      case "add":
        setOpenAdd(true);
        break;
      case "edit":
        if (index !== undefined) {
          setOpenEdit(true);
          setselectedResponsible(responsibles[index]);
        }
        break;
      case "delete":
        if (index !== undefined) {
          setOpenDelete(true);
          setSelectedResponsibleId(index);
        }
    }
  }

  // Suppression d'un responsible
  const handleDeleteResponsible = async (index: number) => {
    const responsibleId = responsibles[index].id;

    const res = await deleteResponsible(responsibleId)
    if (res?.data.message) {
      closeModal("delete");
      notify("Responsable supprimée", NotifyActions.Successful);
    } else {
      notify(res?.data.error, NotifyActions.Error);
    }
  };

  return (
    <Container fluid>
      <Card>
        <CardHeader>
          <Row>
            <Col>
              <CardTitle tag="h2">Gestion des responsables</CardTitle>
            </Col>

            <Col md={1}>
              <Button block color="success" onClick={() => openModal("add")}>
                +
              </Button>
            </Col>
          </Row>
        </CardHeader>
        <CardBody>
          <ModalComponent
            children={
              <AddResponsibleForm addResponsible={addResponsible} closeModalAdd={() => closeModal("add")} />
            }
            open={openAdd}
            hide={() => closeModal("add")}
          />
          <ModalComponent
            children={
              <EditResponsibleForm
                closeModalEdit={() => closeModal("edit")}
                responsible={selectedResponsible}
                updateResponsible={updateResponsible}
              />
            }
            open={openEdit}
            hide={() => closeModal("edit")}
          />
          <ModalComponent
            children={
              <DeleteResponsible
                message="êtes-vous sûre de vouloir supprimer ce Responsable?"
                confirmModal={() =>
                  selectedResponsibleId !== undefined &&
                  handleDeleteResponsible(
                    selectedResponsibleId
                  )
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
                <th>Prénom</th>
                <th>Nom</th>
                <th>Email</th>
                <th>Date de création</th>
                <th>Date de modification</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {responsibles &&
                responsibles.map((responsible, index) => {
                  return (
                    <tr key={index}>
                      <td>{responsible.id}</td>
                      <td>{responsible.firstname}</td>
                      <td>{responsible.lastname}</td>
                      <td>{responsible.email}</td>
                      <td>
                        {responsible.createdAt
                          ? moment(
                            typeof responsible.createdAt === "string"
                              ? new Date(responsible.createdAt)
                              : responsible.createdAt,
                            "DD-MM-YYYY hh:mm"
                          ).format("DD-MM-YYYY hh:mm")
                          : null
                        }
                      </td>
                      <td>
                        {responsible.updatedAt
                          ? moment(
                            typeof responsible.updatedAt === "string"
                              ? new Date(responsible.updatedAt)
                              : responsible.updatedAt,
                            "DD-MM-YYYY hh:mm"
                          ).format("DD-MM-YYYY hh:mm")
                          : null
                        }
                      </td>
                      <td className="table-action">
                        <FontAwesomeIcon
                          style={{ cursor: "pointer" }}
                          icon={faPen}
                          fixedWidth
                          className="align-middle mr-3 btn-icon"
                          onClick={() => openModal("edit", index)}
                        />

                        <FontAwesomeIcon
                          style={{ cursor: "pointer" }}
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
        </CardBody>
      </Card>
    </Container>
  );
}

export default /*connect((store) => ({
  theme: store.theme.currentTheme,
}))*/(Responsibles);
