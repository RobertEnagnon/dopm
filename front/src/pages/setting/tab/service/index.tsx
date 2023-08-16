import { useState } from "react";
import { Button, Col, Row, Table } from "reactstrap";
import ModalComponent from "../../../ficheSecurite/modal";
import AddServiceForm from "./addService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import DeleteService from "./deleteService";
import EditServiceForm from "./editService";
import moment from "moment";
import { Service } from "../../../../models/service";
import { notify, NotifyActions } from "../../../../utils/dopm.utils";
import { useService } from "../../../../hooks/service";

const Services = () => {
  const { services, addService, updateService, deleteService } = useService();
  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [selectedServiceId, setSelectedServiceId] = useState<number>();
  const [selectedService, setselectedService] = useState<Service>();

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
          setselectedService(services[index]);
        }
        break;
      case "delete":
        if (index !== undefined) {
          setOpenDelete(true);
          setSelectedServiceId(index);
        }
    }
  };

  // Suppression d'un service
  const handleDeleteService = async (index: number) => {
    const serviceId = services[index].id;

    const response = await deleteService(serviceId);
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
            Gestion des <code>services</code>.
          </h6>
        </Col>
        <Col style={{display: 'flex', justifyContent: 'flex-end'}}>
          <Button
            color="success"
            onClick={() => {
              openModal("add");
            }}
          >
            +
          </Button>
        </Col>
      </Row>
      <ModalComponent
        children={
          <AddServiceForm
            addService={addService}
            closeModalAdd={() => closeModal("add")}
          />
        }
        open={openAdd}
        hide={() => closeModal("add")}
      />
      <ModalComponent
        children={
          <EditServiceForm
            updateService={updateService}
            closeModalEdit={() => closeModal("edit")}
            service={selectedService}
          />
        }
        open={openEdit}
        hide={() => closeModal("edit")}
      />
      <ModalComponent
        children={
          <DeleteService
            message="êtes-vous sûre de vouloir supprimer ce Service"
            confirmModal={() =>
              selectedServiceId !== undefined &&
              handleDeleteService(selectedServiceId)
            }
          />
        }
        open={openDelete}
        hide={() => closeModal("delete")}
      />
      <Table striped hover>
        <thead>
          <tr>
            {/*<th>ID</th>*/}
            <th>Nom</th>
            <th>Description</th>
            <th>Date de création</th>
            <th>Date de modification</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {services &&
            services.map((service, index) => {
              return (
                <tr key={index}>
                  {/*<td>{service.id}</td>*/}
                  <td>{service.name}</td>
                  <td>{service.description}</td>
                  <td>
                    {service.createdAt
                      ? moment(
                          typeof service.createdAt === "string"
                            ? new Date(service.createdAt)
                            : service.createdAt,
                          "DD-MM-YYYY"
                        ).format("DD-MM-YYYY")
                      : null}
                  </td>
                  <td>
                    {service.updatedAt
                      ? moment(
                          typeof service.updatedAt === "string"
                            ? new Date(service.updatedAt)
                            : service.updatedAt,
                          "DD-MM-YYYY"
                        ).format("DD-MM-YYYY")
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
}))*/ Services;
