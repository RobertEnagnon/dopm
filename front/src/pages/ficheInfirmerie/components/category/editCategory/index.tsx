import * as Yup from "yup";

import { Modal } from "react-bootstrap";
import { notify, NotifyActions } from "../../../../../utils/dopm.utils";
import { Form } from "./ServiceForm";
import { InjuredCategory } from "../../../../../models/injuredCategory";

const validationSchema = Yup.object({
	name: Yup.string().required("Le champs Nom est Obligatoire")
})

type CategoryAddType = {
	name?: string,
	isInjuredCategoryName?: boolean
}

type EditFICategoriesFormType = {
	closeModalEdit: Function,
	category?: InjuredCategory,
	updateCategory: Function,
	title: string,
	addText?: boolean
}

const EditCategoryForm = (props: EditFICategoriesFormType) => {
	// update ficategorie function
	const handleUpdateFiInjCategory = async (ficategory: CategoryAddType) => {
		const newFiInjCategory = await props.updateCategory(props?.category?.id, ficategory);
		if (newFiInjCategory) {
			notify("Modification effectuée", NotifyActions.Successful);
			props.closeModalEdit();
		} else {
			notify("Modification impossible", NotifyActions.Error);
		}
	}
	const values = {
		name: props?.category?.name,
		isInjuredCategoryName: props?.category?.isInjuredCategoryName
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
					addText={!!props.addText}
				/>
			</Modal.Body>
		</>
	);
}

export default EditCategoryForm;
