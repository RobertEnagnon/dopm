import { Modal } from "react-bootstrap";
import { Form } from "../addZone/ServiceForm";
import * as Yup from "yup";
import { notify, NotifyActions } from "../../../../../utils/dopm.utils";

const validationSchema = Yup.object({
  name: Yup.string().required("Le champs Nom est obligatoire"),
  description: Yup.string(),
});

type AddSubZoneType = {
  name: string;
  description?: string;
};

type AddSubsZoneFormType = {
  closeModalAdd: Function;
  addSubZone: Function;
  zoneId: number;
};

const AddSubZoneForm = (props: AddSubsZoneFormType) => {
  const handleAddSubZone = async (subZone: AddSubZoneType) => {
    const response = await props.addSubZone({
      ...subZone,
      zoneId: props.zoneId,
    });

    if (response.subZone) {
      notify(
        "Une nouvelle sous zone a été ajoutée (" + response.subZone.id + ")",
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
      <Modal.Header>
        <Modal.Title>Ajout de Sous Zone</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          initialValues={values}
          validationSchema={validationSchema}
          onSubmit={handleAddSubZone}
        />
      </Modal.Body>
    </>
  );
};

export default AddSubZoneForm;
