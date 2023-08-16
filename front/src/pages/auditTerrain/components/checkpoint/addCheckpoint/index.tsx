import { Modal } from 'react-bootstrap';
import * as Yup from 'yup';
import { notify, NotifyActions } from "../../../../../utils/dopm.utils";
import { Form, CheckpointType } from "../ServiceForm";

const validationSchema = Yup.object({
    standard: Yup.string().required('Vous devez indiquer un standard à respecter'),
    services: Yup.array().min(1, 'Vous devez sélectionner un service'),
    categoryId: Yup.number().min(1, 'Vous devez sélectionner une catégorie'),
    numero: Yup.number().min(1, 'Vous devez sélectionner un numéro'),
    image: Yup.string(),
    description: Yup.string(),
    zoneId: Yup.number(),
    subzoneId: Yup.number()
})

type AddCheckpointFormType = {
    addCheckpoint: Function,
    closeModalAdd: Function,
    useCheckpointsNumeros: Array<number>
}

const AddCheckpointForm = (props: AddCheckpointFormType) => {
    const { addCheckpoint, closeModalAdd, useCheckpointsNumeros } = props;

    const handleAddCheckpoint = async (checkpoint: CheckpointType) => {
        console.log("handleAddCheckpoint", checkpoint)
        try {
            const newCheckpoint = await addCheckpoint(checkpoint);
            notify(
                `Un nouveau checkpoint a été ajouté (${newCheckpoint.standard})`,
                NotifyActions.Successful
            );
            closeModalAdd();
        } catch (e) {
            notify('Ajout impossible', NotifyActions.Error);
        }
    }

    const values: CheckpointType = {
        standard: '',
        description: '',
        numero: 0,
        image: '',
        services: [],
        zoneId: 0,
        subzoneId: 0,
        categoryId: 0
    };

    return (
        <>
            <Modal.Header>
                <Modal.Title>Ajout de Checkpoint</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form
                    onSubmit={handleAddCheckpoint}
                    validationSchema={validationSchema}
                    initialValues={values}
                    useCheckpointsNumeros={useCheckpointsNumeros}
                />
            </Modal.Body>
        </>
    )
}

export default AddCheckpointForm;
