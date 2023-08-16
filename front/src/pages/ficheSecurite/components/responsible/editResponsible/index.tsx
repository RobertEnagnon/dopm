import React, { useState } from "react";
import { Form } from "./ServiceForm";
import * as Yup from "yup";
import { Modal } from "react-bootstrap";
import { Grid } from "@material-ui/core";
import "../index.css";
import { Responsible } from "../../../../../models/responsible";
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

type ResponsibleEditType = {
  firstname: string,
  lastname: string,
  email: string
}

type EditResponsibleFormType = {
  closeModalEdit: Function,
  responsible?: Responsible,
  updateResponsible: Function
}

const EditResponsibleForm = (props: EditResponsibleFormType) => {
  const [error, setError] = useState<string>("");

  // update responsible function
  const handleUpdateResponsible = async (responsible: ResponsibleEditType) => {
    const message = await props.updateResponsible(props?.responsible?.id, responsible);
    if (message) {
      notify("Modification de responsable effectuée", NotifyActions.Successful);
      props.closeModalEdit();
    } else {
      setError("Email deja utilisé");
    }
  };

  const values = {
    firstname: props?.responsible?.firstname || "",
    lastname: props?.responsible?.lastname || "",
    email: props?.responsible?.email || "",
  };
  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>
          Modification du responsable `{props?.responsible?.firstname}{" "}
          {props?.responsible?.lastname} `
        </Modal.Title>
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
              initialValues={values}
              validationSchema={validationSchema}
              onSubmit={handleUpdateResponsible}
            />
          </Grid>
        </Grid>
      </Modal.Body>
    </>
  );
}

export default EditResponsibleForm;
