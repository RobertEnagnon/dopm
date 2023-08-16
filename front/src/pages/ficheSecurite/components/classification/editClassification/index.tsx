import { Form } from "./ServiceForm";
import * as Yup from "yup";
import { Modal } from "react-bootstrap";
import { Classification } from "../../../../../models/FicheSecurite/classification";
import { notify, NotifyActions } from "../../../../../utils/dopm.utils";

const validationSchema = Yup.object({
  name: Yup.string().required("Le champs nom est Obligatoire"),
  description: Yup.string()
});

type EditClassificationType = {
  name: string,
  description?: string,
}

type EditClassificationFormType = {
  closeModalEdit: Function,
  updateClassification: Function,
  classification?: Classification
}

const EditClassificationForm = (props: EditClassificationFormType) => {
  // update classification function
  const handleUpdateClassification = async (classification: EditClassificationType) => {
    const response = await props.updateClassification(props.classification?.id, classification);
    if (response.message) {
      notify(response.message, NotifyActions.Successful);
      props.closeModalEdit();
    } else {
      notify(response.error, NotifyActions.Error);
    }
  };

  const values = {
    name: props?.classification?.name || "",
    description: props?.classification?.description || "",
  };
  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>
          Modification: classification `{props?.classification?.name}`
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          initialValues={values}
          validationSchema={validationSchema}
          onSubmit={handleUpdateClassification}
        />
      </Modal.Body>
    </>
  );
}

export default EditClassificationForm;
