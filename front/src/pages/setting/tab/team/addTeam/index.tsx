import { Form } from "./ServiceForm";
import * as Yup from "yup";
import { Modal } from "react-bootstrap";
import { notify, NotifyActions } from "../../../../../utils/dopm.utils";

const validationSchema = Yup.object({
  name: Yup.string().required(
    "Le champs Nom est Obligatoire"
  ),
  description: Yup.string()
});

type AddTeamType = {
  name: string,
  description?: string
}

type AddTeamFormType = {
  closeModalAdd: Function,
  addTeam: Function
}

const AddTeamForm = (props: AddTeamFormType) => {
  // add team function
  const handleAddTeam = async (team: AddTeamType) => {
    const response = await props.addTeam(team);

    if (response.newTeam) {
      notify("Une nouvelle équipe a été ajoutée!", NotifyActions.Successful);
      props.closeModalAdd();
    } else {
      notify(response.message, NotifyActions.Error);
    }
  };

  const values = { name: "", description: "" };
  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Ajout d'une equipe</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          initialValues={values}
          validationSchema={validationSchema}
          onSubmit={handleAddTeam}
        />
      </Modal.Body>
    </>
  );
}

export default AddTeamForm;
