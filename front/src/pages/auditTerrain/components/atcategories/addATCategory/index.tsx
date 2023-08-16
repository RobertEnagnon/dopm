import {Modal} from "react-bootstrap";
import * as Yup from "yup";
import {defaultColor, notify, NotifyActions} from "../../../../../utils/dopm.utils";
import {Form} from "./ServiceForm";

const validationSchema = Yup.object({
    name: Yup.string().required('Le champs Nom est Obligatoire'),
    color: Yup.string()
})

type AddATCategoryFormType = {
    addATCategory: Function,
    closeModalAdd: Function
}

type CategoryAddType = {
    name: string,
    color?: string
}

const AddATCategoryForm = (props: AddATCategoryFormType) => {
    const { addATCategory, closeModalAdd } = props;

    const handleAddATCategories = async (atcategory: CategoryAddType) => {
        try {
            const newATCategory = await addATCategory(atcategory);
            notify(
                `Une nouvelle catégorie a été ajoutée (${newATCategory.name})`,
                NotifyActions.Successful
            );
            closeModalAdd();
        } catch (error) {
            notify('Ajout impossible', NotifyActions.Error);
        }
    }

    const values = { name: '', color: defaultColor.value };
    return (
        <>
            <Modal.Header>
                <Modal.Title>Ajout de catégorie</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form
					onSubmit={handleAddATCategories}
					validationSchema={validationSchema}
					initialValues={values}
				/>
            </Modal.Body>
        </>
    )
}

export default AddATCategoryForm;