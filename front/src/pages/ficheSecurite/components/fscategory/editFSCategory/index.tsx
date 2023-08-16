import * as Yup from "yup";

import { Modal } from "react-bootstrap";
import { Category } from "../../../../../models/Top5/category";
import { notify, NotifyActions } from "../../../../../utils/dopm.utils";
import { Form } from "./ServiceForm";

const validationSchema = Yup.object({
	name: Yup.string().required("Le champs Nom est Obligatoire"),
	description: Yup.string()

});

type CategoryAddType = {
	name?: string,
	description?: string
}

type EditFSCategoriesFormType = {
	closeModalEdit: Function,
	fscategory?: Category,
	updateFSCategory: Function
}

const EditFSCategoryForm = (props: EditFSCategoriesFormType) => {
	// update fscategorie function
	const handleUpdateFSCategory = async (fscategory: CategoryAddType) => {
		const newFSCategory = await props.updateFSCategory(props?.fscategory?.id, fscategory);
		if (newFSCategory) {
			notify("Modification effectuée", NotifyActions.Successful);
			props.closeModalEdit();
		} else {
			notify("Modification impossible", NotifyActions.Error);
		}
	};

	const values = {
		name: props?.fscategory?.name,
		description: props?.fscategory?.description,
	};

	return (
		<>
			<Modal.Header closeButton>
				<Modal.Title>
					Modification de la categorie `{props?.fscategory?.name}`
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form
					onSubmit={handleUpdateFSCategory}
					validationSchema={validationSchema}
					initialValues={values}
				/>
			</Modal.Body>
		</>
	);
}

export default EditFSCategoryForm;
