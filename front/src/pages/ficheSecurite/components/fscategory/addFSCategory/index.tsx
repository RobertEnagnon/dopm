import * as Yup from "yup";
import { Modal } from "react-bootstrap";
import { notify, NotifyActions } from "../../../../../utils/dopm.utils";
import { Form } from "./ServiceForm";

const validationSchema = Yup.object({
	name: Yup.string().required("Le champs Nom est Obligatoire"),
	description: Yup.string()
});

type AddFSCategoriesFormType = {
	addFSCategory: Function,
	closeModalAdd: Function
}

type CategoryAddType = {
	name: string,
	description?: string
}

const AddFSCategoriesForm = (props: AddFSCategoriesFormType) => {
	// add fscategorie function
	const handleAddFSCategories = async (fscategory: CategoryAddType) => {
		console.log(fscategory)
		try {
			const newFSCategory = await props.addFSCategory(fscategory);
			notify(
				"Une nouvelle catégorie a été ajoutée (" + newFSCategory.name + ")",
				NotifyActions.Successful
			);
			props.closeModalAdd();
		} catch (error) {
			notify("Ajout impossible", NotifyActions.Error);
		}
	};

	const values = { name: "", description: "" };

	return (
		<>
			<Modal.Header closeButton>
				<Modal.Title>Ajout de categorie</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form
					onSubmit={handleAddFSCategories}
					validationSchema={validationSchema}
					initialValues={values}
				/>
			</Modal.Body>
		</>
	);
}

export default AddFSCategoriesForm;
