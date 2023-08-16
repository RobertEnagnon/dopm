import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { Button, Col, Row, Table } from "reactstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";

import ModalComponent from "../../../components/layout/modal";
import { SugCategory } from "../../../models/sugCategory";
import { CategoryForm } from "../components/categoryForm/CategoryForm";
import { useSugCategory } from "../../../hooks/sugCategory";

export const Category = () => {
  const {
    sugCategories,
    OnAddSugCategory,
    OnUpdateSugCategory,
    OnDeleteSugCategory,
  } = useSugCategory();

  const [selectedSugCategory, setSelectedSugCategory] = useState<
    SugCategory | undefined
  >(undefined);
  const [switchCategoryForm, setSwitchCategoryForm] = useState<number>(1);
  const [open, setOpen] = useState<boolean>(false);

  const openModal = (index: number) => {
    setSwitchCategoryForm(index);
    setOpen(true);
  };

  const handleAddSugCategory = (data: SugCategory): Promise<void> => {
    OnAddSugCategory(data);
    setOpen(false);

    return new Promise<void>((resolve) => {
      resolve();
    });
  };

  const handleEditSugCategory = (data: SugCategory): Promise<void> => {
    OnUpdateSugCategory(data);
    setOpen(false);

    return new Promise<void>((resolve) => {
      resolve();
    });
  };

  const handleDeleteSugCategory = (data: SugCategory): Promise<void> => {
    OnDeleteSugCategory(data);
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
            Gestion des <code>catégories</code>.
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
        {switchCategoryForm === 1 && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>
                <h3>Ajout de catégorie</h3>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <CategoryForm handleAddSugCategory={handleAddSugCategory} />
            </Modal.Body>
          </>
        )}

        {switchCategoryForm === 2 && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>
                Modification de la catégorie {selectedSugCategory?.name}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <CategoryForm
                handleEditSugCategory={handleEditSugCategory}
                selectedSugCategory={selectedSugCategory}
              />
            </Modal.Body>
          </>
        )}
        {switchCategoryForm === 3 && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>Suppression de la catégorie</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="alert alert-danger">
                {`Étes-vous sûre de vouloir supprimer la categorie ${selectedSugCategory?.name}`}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="danger"
                onClick={() =>
                  selectedSugCategory &&
                  handleDeleteSugCategory(selectedSugCategory)
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
          {sugCategories?.map((sugCategory, index) => {
            return (
              <tr key={index}>
                <td>{sugCategory.id}</td>
                <td>{sugCategory.name}</td>
                <td>
                  {sugCategory.createdAt
                    ? moment(
                        typeof sugCategory.createdAt === "string"
                          ? new Date(sugCategory.createdAt)
                          : sugCategory.createdAt,
                        "DD-MM-YYYY hh:mm"
                      ).format("DD-MM-YYYY hh:mm")
                    : null}
                </td>
                <td>
                  {sugCategory.createdAt
                    ? moment(
                        typeof sugCategory.updatedAt === "string"
                          ? new Date(sugCategory.updatedAt)
                          : sugCategory.updatedAt,
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
                      setSelectedSugCategory(sugCategory);
                      openModal(2);
                    }}
                  />

                  <FontAwesomeIcon
                    icon={faTrash}
                    style={{ cursor: "pointer" }}
                    fixedWidth
                    className="align-middle btn-icon"
                    onClick={() => {
                      setSelectedSugCategory(sugCategory);
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
