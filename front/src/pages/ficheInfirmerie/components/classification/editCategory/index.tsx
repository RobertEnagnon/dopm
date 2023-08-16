import * as Yup from "yup";

import { Modal } from "react-bootstrap";
import { notify, NotifyActions } from "../../../../../utils/dopm.utils";
import { Form } from "./ServiceForm";
import { Classification } from "../../../../../models/FicheInfirmerie/classification";

const validationSchema = Yup.object({
	name: Yup.string().required("Le champs Nom est Obligatoire"),
	description: Yup.string()
})

type CategoryAddType = {
	name?: string
}

type EditFSCategoriesFormType = {
	closeModalEdit: Function,
	category?: Classification,
	updateCategory: Function,
	title: string
}

const EditCategoryForm = (props: EditFSCategoriesFormType) => {
	// update ficategorie function
	const handleUpdateFiInjCategory = async (ficategory: CategoryAddType) => {
		const newCategory = await props.updateCategory(props?.category?.id, ficategory);
		if (newCategory) {
			notify("Modification effectuée", NotifyActions.Successful);
			props.closeModalEdit();
		} else {
			notify("Modification impossible", NotifyActions.Error);
		}
	}

	const values = {
		name: props?.category?.name || "",
		description: props?.category?.description || "",
	}

	return (
		<>
			<Modal.Header closeButton>
				<Modal.Title>
					{props.title}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form
					onSubmit={handleUpdateFiInjCategory}
					validationSchema={validationSchema}
					initialValues={values}
				/>
			</Modal.Body>
		</>
	);
}

export default EditCategoryForm;
