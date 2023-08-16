import * as Yup from 'yup';
import { AtCategory } from "../../../../../models/AuditTerrain/atCategory";
import { notify, NotifyActions } from "../../../../../utils/dopm.utils";
import { Modal } from "react-bootstrap";
import { Form } from "./ServiceForm";

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
    atcategory?: AtCategory
    updateATCategory: Function
}

const EditATCategoryForm = (props: EditATCategoriesForm) => {
    const {
        closeModalEdit,
        updateATCategory
    } = props;

    const handleUpdateATCategory = async (atcategory: CategoryEditType) => {
        const newATCategory = await updateATCategory(props.atcategory?.id, atcategory);
        if (newATCategory) {
            notify('Modification effectuée', NotifyActions.Successful);
            closeModalEdit();
        } else {
            notify('Modification impossible', NotifyActions.Error);
        }
    }

    const values = {
        name: props?.atcategory?.name || "",
        color: props?.atcategory?.color
    };

    return (
        <>
            <Modal.Header>
                <Modal.Title>
                    Modification de la catégorie `{props?.atcategory?.name}`
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form
                    onSubmit={handleUpdateATCategory}
                    validationSchema={validationSchema}
                    initialValues={values}
                />
            </Modal.Body>
        </>
    )
}

export default EditATCategoryForm;