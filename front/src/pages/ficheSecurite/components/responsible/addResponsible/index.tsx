import { useState } from "react";
import { Form } from "./ServiceForm";
import * as Yup from "yup";
import { Modal } from "react-bootstrap";
import { Grid } from "@material-ui/core";
import "../index.css";
import { notify, NotifyActions } from "../../../../../utils/dopm.utils";

const validationSchema = Yup.object({
  firstname: Yup.string().required("Le champs Prénom est Obligatoire"),
  lastname: Yup.string().required(
    "Le champs Prénom est Obligatoire"
  ),
  email: Yup.string()
    .email("Ce champs doit être un Email valide")
    .max(255, "Le champs email ne doit pas depasser 255 Lettres")
    .required("Le champs Email est Obligatoire"),
});

type ResponsibleAddType = {
  firstname: string,
  lastname: string,
  email: string
}

type AddFSCategoriesFormType = {
  closeModalAdd: Function,
  addResponsible: Function
}

const AddResponsibleForm = (props: AddFSCategoriesFormType) => {
  const [error, setError] = useState<string>("");

  // add responsible function
  const handleAddResponsible = async (responsible: ResponsibleAddType) => {
    try {
      const newResponsible = props.addResponsible(responsible);

      if (newResponsible !== undefined) {
        notify("Un nouveau responsable a été ajouté!", NotifyActions.Successful);
        props.closeModalAdd();
      } else {
        notify("Ajout impossible", NotifyActions.Error);
      }
    } catch (error) {
      setError("Email déja utilisé")
    }
  };

  const values = { firstname: "", lastname: "", email: "" };
  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Ajout de responsable</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="flex-start"
          spacing={1}
        >
          {error !== "" && (
            <Grid item xs={12}>
              <div className="alert-bs alert-danger-bs fade-bs">
                {error}
              </div>
            </Grid>
          )}
          <Grid item xs={12}>
            <Form
              onSubmit={handleAddResponsible}
              validationSchema={validationSchema}
              initialValues={values}
            />
          </Grid>
        </Grid>
      </Modal.Body>
    </>
  );
}

export default AddResponsibleForm;
