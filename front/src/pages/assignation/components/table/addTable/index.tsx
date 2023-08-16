import { Modal } from 'react-bootstrap';
import * as Yup from 'yup';
import {notify, NotifyActions} from "../../../../../utils/dopm.utils";
import {Form} from "./ServiceForm";

const validationSchema = Yup.object({
    name: Yup.string().required('Vous devez indiquer un nom à la table.'),
    description: Yup.string(),
    color: Yup.string()
})

type AddTableFormType = {
    addTable: Function,
    closeModalAdd: Function
}

type TableAddType = {
    name: string,
    description?: string,
    color?: string
}

const AddTableForm = (props: AddTableFormType) => {
    const { addTable, closeModalAdd } = props;

    const handleAddTable = async (table: TableAddType) => {
        try {
            const newTable = await addTable(table);
            notify(
                `La table ${newTable.name} a été créée.`,
                NotifyActions.Successful
            );
            closeModalAdd();
        } catch (e) {
            notify('Ajout impossible', NotifyActions.Error);
        }
    }

    const values = {
        name: '',
        description: '',
        color: ''
    }

    return (
        <>
            <Modal.Header>
               <Modal.Title>Ajout d'une Table</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form
                    onSubmit={handleAddTable}
                    validationSchema={validationSchema}
                    initialValues={values}
                />
            </Modal.Body>
        </>
    )
}

export default AddTableForm;
