import { Form } from "./ServiceForm";
import * as Yup from "yup";
import { Modal } from "react-bootstrap";
import { notify, NotifyActions } from "../../../../../utils/dopm.utils";

const validationSchema = Yup.object({
  name: Yup.string().required(
    "Le champs Nom est obligatoire"
  ),
  description: Yup.string()
});

type AddZoneType = {
  name: string,
  description?: string
}

type AddZoneFormType = {
  closeModalAdd: Function,
  addZone: Function
}

const AddZoneForm = (props: AddZoneFormType) => {
  // add zone function
  const handleAddZone = async (zone: AddZoneType) => {
    const response = await props.addZone(zone);

    if (response.newZone) {
      notify(
        "Une nouvelle zone a été ajoutée (" + response.newZone.id + ")",
        NotifyActions.Successful
      );
      props.closeModalAdd();
    } else {
      notify(response.error, NotifyActions.Error);
    }
  };

  const values = { name: "", description: "" };
  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Ajout de zone</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          initialValues={values}
          validationSchema={validationSchema}
          onSubmit={handleAddZone}
        />
      </Modal.Body>
    </>
  );
}

export default AddZoneForm;
