import { useState } from "react";
import { Button, Col, Row, Table } from "reactstrap";
import ModalComponent from "../../../ficheSecurite/modal";
import AddTeamForm from "./addTeam";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import DeleteTeam from "./deleteTeam";
import EditTeamService from "./editTeam";
import moment from "moment";
import { Team } from "../../../../models/team";
import { useTeam } from "../../../../hooks/team";
import { notify, NotifyActions } from "../../../../utils/dopm.utils";

const Teams = () => {
  const { teams, addTeam, updateTeam, deleteTeam } = useTeam();
  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [selectedTeamId, setSelectedTeamId] = useState<number>();
  const [selectedTeam, setSelectedTeam] = useState<Team>();

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
          setSelectedTeam(teams[index]);
        }
        break;
      case "delete":
        if (index !== undefined) {
          setOpenDelete(true);
          setSelectedTeamId(index);
        }
    }
  };

  // Suppression d'une equipe
  const handleDeleteTeam = async (index: number) => {
    const teamId = teams[index].id;
    const response = await deleteTeam(teamId);

    if (response.message) {
      closeModal("delete");
      notify("Equipe supprimée", NotifyActions.Successful);
    } else {
      notify(response.error, NotifyActions.Error);
    }
  };

  return (
    <>
      <Row className="mb-4 align-items-end">
        <Col>
          <h6 className="card-subtitle text-muted">
            Gestion des <code>équipes</code>.
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
          <AddTeamForm
            addTeam={addTeam}
            closeModalAdd={() => closeModal("add")}
          />
        }
        open={openAdd}
        hide={() => closeModal("add")}
      />
      <ModalComponent
        children={
          <EditTeamService
            updateTeam={updateTeam}
            closeModalEdit={() => closeModal("edit")}
            team={selectedTeam}
          />
        }
        open={openEdit}
        hide={() => closeModal("edit")}
      />
      <ModalComponent
        children={
          <DeleteTeam
            message="êtes-vous sûre de vouloir supprimer cette équipe?"
            confirmModal={() =>
              selectedTeamId !== undefined && handleDeleteTeam(selectedTeamId)
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
            <th>Name</th>
            <th>Description</th>
            <th>Date de création</th>
            <th>Date de modification</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teams &&
            teams.map((team, index) => {
              return (
                <tr key={index}>
                  {/*<td>{team.id}</td>*/}
                  <td>{team.name}</td>
                  <td>{team.description}</td>
                  <td>
                    {team.createdAt
                      ? moment(
                          typeof team.createdAt === "string"
                            ? new Date(team.createdAt)
                            : team.createdAt,
                          "DD-MM-YYYY"
                        ).format("DD-MM-YYYY")
                      : null}
                  </td>
                  <td>
                    {team.createdAt
                      ? moment(
                          typeof team.updatedAt === "string"
                            ? new Date(team.updatedAt)
                            : team.updatedAt,
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
}))*/ Teams;
