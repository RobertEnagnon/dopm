import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { Button, Col, Row, Table } from "reactstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";

import ModalComponent from "../../../components/layout/modal";
import { ClassificationForm } from "../components/classificationForm/ClassificationForm";
import { useSugClassification } from "../../../hooks/sugClassification";
import { SugClassification } from "../../../models/sugClassification";

export const Classification = () => {
  const {
    sugClassifications,
    OnAddSugClassification,
    OnUpdateSugClassification,
    OnDeleteSugClassification,
  } = useSugClassification();

  const [selectedSugClassification, setSelectedSugClassification] = useState<
    SugClassification | undefined
  >(undefined);
  const [switchClassificationForm, setSwitchClassificationForm] =
    useState<number>(1);
  const [open, setOpen] = useState<boolean>(false);

  const openModal = (index: number) => {
    setSwitchClassificationForm(index);
    setOpen(true);
  };

  const handleAddSugClassification = (
    data: SugClassification
  ): Promise<void> => {
    OnAddSugClassification(data);
    setOpen(false);

    return new Promise<void>((resolve) => {
      resolve();
    });
  };

  const handleEditSugClassification = (
    data: SugClassification
  ): Promise<void> => {
    OnUpdateSugClassification(data);
    setOpen(false);

    return new Promise<void>((resolve) => {
      resolve();
    });
  };

  const handleDeleteSugClassification = (
    data: SugClassification
  ): Promise<void> => {
    OnDeleteSugClassification(data);
    setOpen(false);

    return new Promise<void>((resolve) => {
      resolve();
    });
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
              <Button block color="success" onClick={() => openModal(1)}>
                +
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <ModalComponent open={open} hide={() => setOpen(false)}>
        {switchClassificationForm === 1 && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>
                <h3>Ajout de classification</h3>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <ClassificationForm
                handleAddSugClassification={handleAddSugClassification}
              />
            </Modal.Body>
          </>
        )}

        {switchClassificationForm === 2 && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>
                Modification de la classification{" "}
                {selectedSugClassification?.name}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <ClassificationForm
                handleEditSugClassification={handleEditSugClassification}
                selectedSugClassification={selectedSugClassification}
              />
            </Modal.Body>
          </>
        )}
        {switchClassificationForm === 3 && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>Suppression de la classification</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="alert alert-danger">
                {`Étes-vous sûre de vouloir supprimer la classification ${selectedSugClassification?.name}`}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="danger"
                onClick={() =>
                  selectedSugClassification &&
                  handleDeleteSugClassification(selectedSugClassification)
                }
              >
                Delete
              </Button>
            </Modal.Footer>
          </>
        )}
      </ModalComponent>
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
          {sugClassifications?.map((sugClassification, index) => {
            return (
              <tr key={index}>
                <td>{sugClassification.id}</td>
                <td>{sugClassification.name}</td>
                <td>
                  {sugClassification.createdAt
                    ? moment(
                        typeof sugClassification.createdAt === "string"
                          ? new Date(sugClassification.createdAt)
                          : sugClassification.createdAt,
                        "DD-MM-YYYY hh:mm"
                      ).format("DD-MM-YYYY hh:mm")
                    : null}
                </td>
                <td>
                  {sugClassification.createdAt
                    ? moment(
                        typeof sugClassification.updatedAt === "string"
                          ? new Date(sugClassification.updatedAt)
                          : sugClassification.updatedAt,
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
                    onClick={() => {
                      setSelectedSugClassification(sugClassification);
                      openModal(2);
                    }}
                  />

                  <FontAwesomeIcon
                    icon={faTrash}
                    style={{ cursor: "pointer" }}
                    fixedWidth
                    className="align-middle btn-icon"
                    onClick={() => {
                      setSelectedSugClassification(sugClassification);
                      openModal(3);
                    }}
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
