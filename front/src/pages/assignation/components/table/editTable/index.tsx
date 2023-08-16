import * as Yup from 'yup';
import {notify, NotifyActions} from "../../../../../utils/dopm.utils";
import {AsTable} from "../../../../../models/Assignation/asTable";
import { Modal } from 'react-bootstrap';
import {Form} from "./ServiceForm";

const validationSchema = Yup.object({
    id: Yup.number(),
    name: Yup.string().required('Vous devez indiquer un nom à la table.'),
    description: Yup.string(),
    color: Yup.string()
})

type EditTableFormType = {
    table: AsTable,
    editTable: Function,
    closeModalEdit: Function
}

type TableEditType = {
    id?: number,
    name: string,
    description?: string,
    color?: string
}

const EditTableForm = ( props: EditTableFormType) => {
    const { editTable, closeModalEdit } = props;

    const handleEditTable = async (table: TableEditType) => {
        try {
            const newTable = await editTable(props.table.id, table);
            notify(
                `La table ${newTable.name} a été modifiée`,
                NotifyActions.Successful
            );
            closeModalEdit();
        } catch (e) {
            notify('Modification impossible', NotifyActions.Error);
        }
    }

    const values = {
        id: props.table.id,
        name: props.table.name,
        description: props.table.description,
        color: props.table.color
    }

    return (
        <>
            <Modal.Header>
                <Modal.Title>Modification de {props.table.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form
                    onSubmit={handleEditTable}
                    validationSchema={validationSchema}
                    initialValues={values}
                />
            </Modal.Body>
        </>
    )
}

export default EditTableForm;