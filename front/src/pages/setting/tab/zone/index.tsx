import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Row,
  Table,
} from "reactstrap";
import ModalComponent from "../../../ficheSecurite/modal";
import AddZoneForm from "./addZone";
import DeleteZone from "./deleteZone";
import EditZoneForm from "./editZone";
import React, { useEffect, useState } from "react";
import { Zone } from "../../../../models/zone";
import { notify, NotifyActions } from "../../../../utils/dopm.utils";
import { useZone } from "../../../../hooks/zone";
import moment from "moment/moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Subzone } from "../../../../models/subzone";
import AddSubZoneForm from "./addSubZone";
import EditSubZone from "./editSubZone";
import { IconButton } from "@material-ui/core";

const Zones = () => {
  const {
    zones,
    addZone,
    updateZone,
    deleteZone,
    addSubZone,
    updateSubZone,
    deleteSubZone,
  } = useZone();
  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [selectedZoneId, setSelectedZoneId] = useState<number>();
  const [selectedZoneIndex, setSelectedZoneIndex] = useState<number>();
  const [selectedZone, setSelectedZone] = useState<Zone>();

  useEffect(() => {
    if (selectedZoneId) {
      setSelectedZone(zones.find((z) => z.id === selectedZoneId));
      setSelectedZoneIndex(zones.findIndex((z) => z.id === selectedZoneId));
    } else {
      setSelectedZone(undefined);
      setSelectedZoneIndex(undefined);
    }
  }, [selectedZoneId]);

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
  const openModal = (
    action: "add" | "edit" | "delete",
    index?: number,
    rowIndex?: number
  ) => {
    switch (action) {
      case "add":
        setOpenAdd(true);
        break;
      case "edit":
        if (index !== undefined) {
          setOpenEdit(true);
          setSelectedZone(zones[index]);
        }
        break;
      case "delete":
        if (index !== undefined && rowIndex !== undefined) {
          setOpenDelete(true);
          setSelectedZoneId(index);
          setSelectedZoneIndex(rowIndex);
        }
    }
  };

  // Suppression d'une zone
  const handleDeleteZone = async (index: number) => {
    const zoneId = zones[index].id;
    const response = await deleteZone(zoneId);

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
            Gestion des <code>zones</code>.
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
          <AddZoneForm
            addZone={addZone}
            closeModalAdd={() => closeModal("add")}
          />
        }
        open={openAdd}
        hide={() => closeModal("add")}
      />
      <ModalComponent
        children={
          <EditZoneForm
            updateZone={updateZone}
            closeModalEdit={() => closeModal("edit")}
            zone={selectedZone}
          />
        }
        open={openEdit}
        hide={() => closeModal("edit")}
      />
      <ModalComponent
        children={
          <DeleteZone
            message="êtes-vous sûre de vouloir supprimer cette Zone ?"
            confirmModal={() =>
              selectedZoneId &&
              selectedZoneIndex &&
              handleDeleteZone(selectedZoneIndex)
            }
          />
        }
        open={openDelete}
        hide={() => closeModal("delete")}
      />
      <Row>
        <Col md={4}>
          {zones?.map((zone, zoneIndex) => (
            <div
              key={zone.id}
              className={`groupe-card ${
                selectedZoneId === zone.id ? "active" : ""
              }`}
              onClick={() => setSelectedZoneId(zone.id)}
            >
              <Row>
                <Col md={10}>{zone.name?.toUpperCase()}</Col>
                {selectedZoneId === zone.id && (
                  <Col>
                    <Row className="gap-2 justify-content-end">
                      <IconButton
                        style={{
                          width: "30px",
                          height: "30px",
                        }}
                        color="primary"
                        type="button"
                        onClick={() => openModal("edit", zoneIndex)}
                      >
                        <FontAwesomeIcon
                          icon={faPen}
                          size="xs"
                          color="#212529"
                        />
                      </IconButton>

                      <IconButton
                        style={{
                          width: "30px",
                          height: "30px",
                        }}
                        type="button"
                        onClick={() => openModal("delete", zone.id, zoneIndex)}
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          size="xs"
                          color="#212529"
                        />
                      </IconButton>
                    </Row>
                  </Col>
                )}
              </Row>
            </div>
          ))}
        </Col>
        <Col md={8}>
          {zones && selectedZone && (
            <SubzoneSection
              zone={selectedZone}
              subzones={selectedZone.subzones || []}
              addSubZone={addSubZone}
              updateSubZone={updateSubZone}
              deleteSubZone={deleteSubZone}
            />
          )}
        </Col>
      </Row>
    </>
  );
};

const SubzoneSection = ({
  zone,
  subzones,
  addSubZone,
  updateSubZone,
  deleteSubZone,
}: {
  zone: Zone;
  subzones: Subzone[];
  addSubZone: Function;
  updateSubZone: Function;
  deleteSubZone: Function;
}) => {
  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [selectedSubZoneId, setSelectedSubZoneId] = useState<number>();
  const [selectedSubZoneIndex, setSelectedSubZoneIndex] = useState<number>();
  const [selectedSubZone, setSelectedSubZone] = useState<Subzone>();

  const handleDeleteSubZone = async (index: number) => {
    const subZoneId = subzones[index].id;
    const response = await deleteSubZone(subZoneId, zone.id);

    if (response.message) {
      closeModal("delete");
      notify(response.message, NotifyActions.Successful);
    } else {
      notify(response.error, NotifyActions.Error);
    }
  };

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
  const openModal = (
    action: "add" | "edit" | "delete",
    index?: number,
    rowIndex?: number
  ) => {
    switch (action) {
      case "add":
        setOpenAdd(true);
        break;
      case "edit":
        if (index !== undefined) {
          setOpenEdit(true);
          setSelectedSubZone(subzones[index]);
        }
        break;
      case "delete":
        if (index !== undefined && rowIndex !== undefined) {
          setOpenDelete(true);
          setSelectedSubZoneId(index);
          setSelectedSubZoneIndex(rowIndex);
        }
    }
  };

  return (
    <Row>
      <Col>
        <ModalComponent
          children={
            <AddSubZoneForm
              addSubZone={addSubZone}
              closeModalAdd={() => closeModal("add")}
              zoneId={zone.id}
            />
          }
          open={openAdd}
          hide={() => closeModal("add")}
        />
        <ModalComponent
          children={
            <EditSubZone
              closeModalEdit={() => closeModal("edit")}
              updateSubZone={updateSubZone}
              subzone={selectedSubZone}
            />
          }
          open={openEdit}
          hide={() => closeModal("edit")}
        />
        <ModalComponent
          children={
            <DeleteZone
              message="êtes-vous sûre de vouloir supprimer cette Sous Zone ?"
              confirmModal={() =>
                selectedSubZoneId &&
                selectedSubZoneIndex != undefined &&
                handleDeleteSubZone(selectedSubZoneIndex)
              }
            />
          }
          open={openDelete}
          hide={() => closeModal("delete")}
        />
        <Card>
          <CardHeader>
            <CardTitle>Sous Zones</CardTitle>
          </CardHeader>
          <CardBody>
            <Row>
              <Col>
                <Table hover striped>
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Description</th>
                      <th>Créée le</th>
                      <th>Modifiée le</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {subzones.map((sz, index) => {
                      return (
                        <tr key={sz.name}>
                          <td>{sz.name?.toUpperCase()}</td>
                          <td>{sz.description}</td>
                          <td>
                            {moment(
                              typeof sz.createdAt === "string"
                                ? new Date(sz.createdAt)
                                : sz.createdAt,
                              "DD-MM-YYYY"
                            ).format("DD-MM-YYYY")}
                          </td>
                          <td>
                            {moment(
                              typeof sz.updatedAt === "string"
                                ? new Date(sz.updatedAt)
                                : sz.updatedAt,
                              "DD-MM-YYYY"
                            ).format("DD-MM-YYYY")}
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
                              onClick={() => openModal("delete", sz.id, index)}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Col>
            </Row>
            <Row>
              <Button
                className="align-self-center"
                color="link"
                onClick={() => openModal("add")}
              >
                Ajouter une sous zone
              </Button>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default /*connect((store) => ({
  theme: store.theme.currentTheme,
}))*/ Zones;
