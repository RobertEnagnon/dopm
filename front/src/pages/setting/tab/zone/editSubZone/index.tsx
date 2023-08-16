import { Form } from "./SubZoneForm";
import * as Yup from "yup";
import { Modal } from "react-bootstrap";
import { notify, NotifyActions } from "../../../../../utils/dopm.utils";
import { Subzone } from "../../../../../models/subzone";

const validationSchema = Yup.object({
  name: Yup.string().required(
    "Le champs Nom est Obligatoire"
  )
});

type EditZoneFormType = {
  closeModalEdit: Function,
  updateSubZone: Function,
  subzone?: Subzone
}

type EditZoneType = {
  name: string
}

const EditSubZone = (props: EditZoneFormType) => {
  // update subzone function
  const handleUpdateSubZone = async (subzone: EditZoneType) => {
    const response = await props.updateSubZone(props?.subzone?.id, { ...subzone, zoneId: props.subzone?.zoneId })
    if (response.message) {
      notify(response.message, NotifyActions.Successful);
      props.closeModalEdit();
    } else {
      notify(response.error, NotifyActions.Error);
    }
  };

  const values = { name: props?.subzone?.name || "" };
  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>
          Modification de la sous zone `{props?.subzone?.name}`
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          initialValues={values}
          validationSchema={validationSchema}
          onSubmit={handleUpdateSubZone}
        />
      </Modal.Body>
    </>
  );
}

export default EditSubZone;
