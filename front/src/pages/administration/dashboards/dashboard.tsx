import React, { useState } from "react";
import { Button, Col, Row, Table } from "reactstrap";
import Modal from "../../../components/layout/modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import CreateDashboardModal from "./createDashboardModal";
import UpdateDashboardModal from "./updateDashboardModal";
import DeleteDashboardModal from "./deleteDashboardModal";
import moment from "moment";
import { Dashboard } from "../../../models/dashboard";
import { useDashboard } from "../../../hooks/dashboard";

const DashboardTab = () => {
  const { dashboards, addDashboard, updateDashboard, deleteDashboard } =
    useDashboard();
  const [isCreationOpen, setIsCreationOpen] = useState<boolean>(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [selectedDashboard, setSelectedDashboard] = useState<number>(-1);
  const currentDashboard: Dashboard = dashboards.filter(
    (dashboard) => dashboard.id === selectedDashboard
  )[0];
  const [isPending, setIsPending] = useState(false);

  const onEdit = (dashboardId: number) => {
    setIsUpdateOpen(true);
    setSelectedDashboard(dashboardId);
  };

  const onDelete = (dashboardId: number) => {
    setIsDeleteOpen(true);
    setSelectedDashboard(dashboardId);
  };

  const onCreate = () => {
    setIsCreationOpen(true);
  };

  const onClose = () => {
    setIsUpdateOpen(false);
    setIsCreationOpen(false);
    setIsDeleteOpen(false);
  };

  const HandleAddDashboard = async (dashboard: Dashboard) => {
    setIsPending(true);
    await addDashboard(dashboard);
    setIsPending(false);
    setIsCreationOpen(false);
  };

  const HandleEditDashboard = async (dashboard: Dashboard) => {
    console.log("handle", dashboard);
    setIsPending(true);
    await updateDashboard(dashboard);
    setIsPending(false);
    setIsUpdateOpen(false);
  };

  const HandleDeleteDashboard = async (dashboardId: number) => {
    setIsPending(true);
    await deleteDashboard(dashboardId);
    setIsPending(false);
    setIsDeleteOpen(false);
  };

  return (
    <>
      {/* Popup for create a dashboard */}
      <Modal open={isCreationOpen} hide={setIsCreationOpen} size="sm">
        <CreateDashboardModal
          onSave={HandleAddDashboard}
          onClose={onClose}
          isPending={isPending}
        />
      </Modal>

      {/* Popup for update a dashboard */}
      <Modal open={isUpdateOpen} hide={setIsUpdateOpen} size="sm">
        <UpdateDashboardModal
          currentDashboard={currentDashboard}
          onSave={HandleEditDashboard}
          onClose={onClose}
          isPending={isPending}
        />
      </Modal>

      {/* Popup for delete a dashboard */}
      <Modal open={isDeleteOpen} hide={setIsDeleteOpen} size="sm">
        <DeleteDashboardModal
          onDelete={HandleDeleteDashboard}
          onClose={onClose}
          selectedDashboard={selectedDashboard}
          isPending={isPending}
        />
      </Modal>

      <Row className="mb-4 align-items-end">
        <Col>
          <h6 className="card-subtitle text-muted">
            Gestion des <code>dashboards</code>.
          </h6>
        </Col>
        <Col style={{display: 'flex', justifyContent: 'flex-end'}}>
        {isCreationOpen ? null : (
          <Button
            color="success"
            onClick={() => {
              onCreate();
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
              <th>Ordre</th>
              <th>Date de création</th>
              <th></th>
            </thead>
            <tbody>
              {dashboards.map((dashboard, index) => {
                return (
                  <tr key={index}>
                    <td>{dashboard.name}</td>
                    <td>{dashboard.order}</td>
                    <td>
                      {dashboard.createdAt
                        ? moment(
                            typeof dashboard.createdAt === "string"
                              ? new Date(dashboard.createdAt)
                              : dashboard.createdAt,
                            "DD-MM-YYYY"
                          ).format("DD-MM-YYYY")
                        : null}
                    </td>
                    <td>
                      <div className="d-flex flex-row justify-content-center align-items-center">
                        <FontAwesomeIcon
                          icon={faPen}
                          fixedWidth
                          className="align-middle mr-3"
                          onClick={() => {
                            onEdit(dashboard.id);
                          }}
                        />
                        <FontAwesomeIcon
                          icon={faTrash}
                          fixedWidth
                          className="align-middle"
                          onClick={() => {
                            onDelete(dashboard.id);
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

export default DashboardTab;
