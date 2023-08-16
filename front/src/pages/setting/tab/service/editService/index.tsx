import { Form } from "./ServiceForm";
import * as Yup from "yup";
import { Modal } from "react-bootstrap";
import { Service } from "../../../../../models/service";
import { notify, NotifyActions } from "../../../../../utils/dopm.utils";

const validationSchema = Yup.object({
  name: Yup.string().required("Le champs Nom est Obligatoire"),
  description: Yup.string()
});

type ServiceEditType = {
  name: string,
  description?: string,
}

type EditServiceFormType = {
  closeModalEdit: Function,
  updateService: Function,
  service?: Service
}

const EditServiceForm = (props: EditServiceFormType) => {
  // update service function
  const handleUpdateService = async (service: ServiceEditType) => {
    const response = await props.updateService(props?.service?.id, service);
    if (response.message) {
      notify(response.message, NotifyActions.Successful);
      props.closeModalEdit();
    } else {
      notify(response.error, NotifyActions.Error);
    }
  };

  const values = {
    name: props?.service?.name || "",
    description: props?.service?.description || "",
  };
  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>
          Modification du service: `{props?.service?.name}`
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          initialValues={values}
          validationSchema={validationSchema}
          onSubmit={handleUpdateService}
        />
      </Modal.Body>
    </>
  );
}

export default EditServiceForm;
