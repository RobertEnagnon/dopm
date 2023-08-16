import { Form } from "./ServiceForm";
import * as Yup from "yup";
import { Modal } from "react-bootstrap";
import { Zone } from "../../../../../models/zone";
import { notify, NotifyActions } from "../../../../../utils/dopm.utils";

const validationSchema = Yup.object({
  name: Yup.string().required(
    "Le champs Nom est Obligatoire"
  ),
  description: Yup.string()
});

type EditZoneType = {
  name: string,
  description?: string
}

type EditZoneFormType = {
  closeModalEdit: Function,
  updateZone: Function,
  zone?: Zone
}

const EditZoneForm = (props: EditZoneFormType) => {
  // update zone function
  const handleUpdateZone = async (zone: EditZoneType) => {
    const response = await props.updateZone(props?.zone?.id, zone);

    if (response.message) {
      notify(response.message, NotifyActions.Successful);
      props.closeModalEdit();
    } else {
      notify(response.error, NotifyActions.Error);
    }
  };

  const values = {
    name: props?.zone?.name || "",
    description: props?.zone?.description || "",
  };
  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>
          Modification de la zone {props?.zone?.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          initialValues={values}
          validationSchema={validationSchema}
          onSubmit={handleUpdateZone}
        />
      </Modal.Body>
    </>
  );
}

export default EditZoneForm;
