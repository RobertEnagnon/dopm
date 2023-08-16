import {Modal} from "react-bootstrap";
import * as Yup from "yup";
import {defaultColor, notify, NotifyActions} from "../../../../../utils/dopm.utils";
import {Form} from "./ServiceForm";

const validationSchema = Yup.object({
    name: Yup.string().required('Le champs Nom est Obligatoire'),
    color: Yup.string()
})

type AddASCategoryFormType = {
    addASCategory: Function,
    closeModalAdd: Function
}

type CategoryAddType = {
    name: string,
    color?: string
}

const AddASCategoryForm = (props: AddASCategoryFormType) => {
    const { addASCategory, closeModalAdd } = props;

    const handleAddASCategories = async (ascategory: CategoryAddType) => {
        try {
            const newASCategory = await addASCategory(ascategory);
            notify(
                `Une nouvelle catégorie a été ajoutée (${newASCategory.name})`,
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
                    onSubmit={handleAddASCategories}
                    validationSchema={validationSchema}
                    initialValues={values}
                />
            </Modal.Body>
        </>
    )
}

export default AddASCategoryForm;