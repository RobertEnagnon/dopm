import { Form } from "./ServiceForm";
import * as Yup from "yup";
import { Modal } from "react-bootstrap";
import { Team } from "../../../../../models/team";
import { notify, NotifyActions } from "../../../../../utils/dopm.utils";

const validationSchema = Yup.object({
  name: Yup.string().required(
    "Le champs Nom est Obligatoire"
  ),
  description: Yup.string()
});

type EditTeamType = {
  name: string,
  description?: string
}

type EditTeamFormType = {
  closeModalEdit: Function,
  updateTeam: Function,
  team?: Team
}

const EditTeamForm = (props: EditTeamFormType) => {
  // update team function
  const handleUpdateTeam = async (team: EditTeamType) => {
    const response = await props.updateTeam(props?.team?.id, team);

    if (response.message) {
      notify(response.message, NotifyActions.Successful);
      props.closeModalEdit();
    } else {
      notify(response.error, NotifyActions.Successful);
    }
  };

  const values = {
    name: props?.team?.name || "",
    description: props?.team?.description || "",
  };
  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>
          Modification de l'equipe {props?.team?.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          initialValues={values}
          validationSchema={validationSchema}
          onSubmit={handleUpdateTeam}
        />
      </Modal.Body>
    </>
  );
}

export default EditTeamForm;
