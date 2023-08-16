import * as Yup from "yup";
import { Checkpoint } from "../../../../../models/AuditTerrain/checkpoint";
import { notify, NotifyActions } from "../../../../../utils/dopm.utils";
import { Modal } from "react-bootstrap";
import { Form, CheckpointType } from "../ServiceForm";

const validationSchema = Yup.object({
    standard: Yup.string().required('Vous devez indiquer un standard à respecter'),
    services: Yup.array().min(1, 'Vous devez sélectionner un service'),
    categoryId: Yup.number().min(1, 'Vous devez sélectionner une catégorie'),
    numero: Yup.number().min(1, 'Vous devez sélectionner un numéro'),
    image: Yup.string(),
    description: Yup.string(),
    zoneId: Yup.number(),
    subzoneId: Yup.number(),
})

type CheckpointFormType = {
    closeModalEdit: () => void,
    checkpoint?: Checkpoint,
    updateCheckpoint: Function,
    useCheckpointsNumeros: Array<number>
}

const EditCheckpointForm = (props: CheckpointFormType) => {
    const {
        closeModalEdit,
        updateCheckpoint,
        useCheckpointsNumeros
    } = props;

    const handleUpdateCheckpoint = async (checkpoint: CheckpointType) => {
        const newCheckpoint = await updateCheckpoint(props.checkpoint?.id, checkpoint);
        console.log('handleUpdateCheckpoint : ', checkpoint)
        if (newCheckpoint) {
            notify('Modification effectuée', NotifyActions.Successful);
            closeModalEdit();
        } else {
            notify('Modification impossible', NotifyActions.Error);
        }
    }

    const values: CheckpointType = {
        standard: props?.checkpoint?.standard,
        description: props?.checkpoint?.description,
        image: props?.checkpoint?.image,
        services: props?.checkpoint?.services,
        zoneId: props?.checkpoint?.zoneId,
        subzoneId: props?.checkpoint?.subzoneId || 0,
        categoryId: props?.checkpoint?.categoryId,
        numero: props?.checkpoint?.numero,
        period: props?.checkpoint?.period
    };
    return (
        <>
            <Modal.Header>
                <Modal.Title>
                    Modification du checkpoint {props?.checkpoint?.standard}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form
                    onSubmit={handleUpdateCheckpoint}
                    validationSchema={validationSchema}
                    initialValues={values}
                    useCheckpointsNumeros={useCheckpointsNumeros}
                />
            </Modal.Body>
        </>
    )
}

export default EditCheckpointForm;
