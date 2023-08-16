import { Form } from "./ServiceForm";
import * as Yup from "yup";
import { Modal } from "react-bootstrap";
import { notify, NotifyActions } from "../../../../../utils/dopm.utils";

const validationSchema = Yup.object({
  name: Yup.string().required("Le champs Nom est Obligatoire"),
  description: Yup.string()
});

type AddClassificationType = {
  name: string,
  description?: string,
}

type AddClassificationFormType = {
  closeModalAdd: Function,
  addClassification: Function
}

const AddClassificationForm = (props: AddClassificationFormType) => {
  // add classification function
  const handleAddClassification = async (classification: AddClassificationType) => {
    const response = await props.addClassification(classification);
    if (response.newClassification) {
      notify(
        "Une nouvelle classification a été ajoutée (" +
        response.newClassification.id +
        ")",
        NotifyActions.Successful
      );
      props.closeModalAdd();
    } else {
      notify(response.message, NotifyActions.Error);
    }
  };

  const values = { name: "", description: "" };
  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Ajout de classification</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          initialValues={values}
          validationSchema={validationSchema}
          onSubmit={handleAddClassification}
        />
      </Modal.Body>
    </>
  );
}

export default AddClassificationForm;
