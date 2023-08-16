import * as Yup from 'yup';
import { notify, NotifyActions } from "../../../../../utils/dopm.utils";
import { Modal } from "react-bootstrap";
import { Form } from "./ServiceForm";
import {AsCategory} from "../../../../../models/Assignation/asCategory";

const validationSchema = Yup.object({
    name: Yup.string().required('Le champs Nom est Obligatoire'),
    color: Yup.string()
});

type CategoryEditType = {
    name: string,
    color?: string
}

type EditATCategoriesForm = {
    closeModalEdit: Function,
    ascategory?: AsCategory,
    updateATCategory: Function
}

const EditASCategoryForm = (props: EditATCategoriesForm) => {
    const {
        closeModalEdit,
        updateATCategory
    } = props;

    const handleUpdateASCategory = async (ascategory: CategoryEditType) => {
        const newASCategory = await updateATCategory(props.ascategory?.id, ascategory);
        if (newASCategory) {
            notify('Modification effectuée', NotifyActions.Successful);
            closeModalEdit();
        } else {
            notify('Modification impossible', NotifyActions.Error);
        }
    }

    const values = {
        name: props?.ascategory?.name || "",
        color: props?.ascategory?.color
    };

    return (
        <>
            <Modal.Header>
                <Modal.Title>
                    Modification de la catégorie `{props?.ascategory?.name}`
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form
                    onSubmit={handleUpdateASCategory}
                    validationSchema={validationSchema}
                    initialValues={values}
                />
            </Modal.Body>
        </>
    )
}

export default EditASCategoryForm;