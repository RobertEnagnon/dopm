import { Form } from "./ServiceForm";
import * as Yup from "yup";
import { Modal } from "react-bootstrap";
import { notify, NotifyActions } from "../../../../../utils/dopm.utils";

const validationSchema = Yup.object({
  name: Yup.string().required("Le champs Nom est Obligatoire"),
  description: Yup.string()
});

type AddServiceType = {
  name: string,
  description?: string
}

type AddServiceFormType = {
  closeModalAdd: Function,
  addService: Function
}

const AddServiceForm = (props: AddServiceFormType) => {
  // add service function
  const handleAddService = async (service: AddServiceType) => {
    const response = await props.addService(service);
    if (response.newService) {
      notify("Un nouveau service a été ajouté!", NotifyActions.Successful);
      props.closeModalAdd();
    } else {
      notify(response.message, NotifyActions.Error);
    }
  };

  const values = { name: "", description: "" };
  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Ajout de service</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          initialValues={values}
          validationSchema={validationSchema}
          onSubmit={handleAddService}
        />
      </Modal.Body>
    </>
  );
}

export default AddServiceForm;
