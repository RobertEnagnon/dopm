import * as Yup from "yup";
import { Modal } from "react-bootstrap";
import { notify, NotifyActions } from "../../../../../utils/dopm.utils";
import { Form } from "./ServiceForm";

const validationSchema = Yup.object({
	name: Yup.string().required("Le champs Nom est Obligatoire")
})

type AddCategoriesFormType = {
	addCategory: Function,
	closeModalAdd: Function,
	title: string,
	addText?: boolean,
}

type CategoryAddType = {
	name: string,
	isInjuredCategoryName: boolean
}

const AddCategoriesForm = (props: AddCategoriesFormType) => {
	// add ficategorie function
	const handleAddFiInjCategories = async (category: CategoryAddType) => {
		try {
			const newCategory = await props.addCategory(category)
			notify(
				"Une nouvelle catégorie a été ajoutée (" + newCategory.name + ")",
				NotifyActions.Successful
			)
			props.closeModalAdd();
		} catch (error) {
			notify("Ajout impossible", NotifyActions.Error);
		}
	}

	const values = { name: "", isInjuredCategoryName: false }

	return (
		<>
			<Modal.Header closeButton>
				<Modal.Title>{props.title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form
					onSubmit={handleAddFiInjCategories}
					validationSchema={validationSchema}
					initialValues={values}
					addText={!!props.addText}
				/>
			</Modal.Body>
		</>
	);
}

export default AddCategoriesForm;
