import { Button, Col, Row, Table } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Checkpoint as CheckpointType } from "../../../../models/AuditTerrain/checkpoint";
import { useCheckpoint } from "../../../../hooks/AuditTerrain/checkpoint";
import moment from "moment";
import ModalComponent from "../../../../components/layout/modal";
import AddCheckpointForm from "./addCheckpoint";
import { notify, NotifyActions } from "../../../../utils/dopm.utils";
import DeleteCheckpoint from "./deleteCheckpoint";
import EditCheckpointForm from "./editCheckpoint";

const Checkpoint = () => {
    const PUBLIC_URL = process.env.REACT_APP_PUBLIC_URL;

    const { checkpoints, addCheckpoint, updateCheckpoint, deleteCheckpoint } = useCheckpoint();
    const [openAdd, setOpenAdd] = useState<boolean>(false);
    const [openEdit, setOpenEdit] = useState<boolean>(false);
    const [openDelete, setOpenDelete] = useState<boolean>(false);
    const [selectedCheckpoint, setSelectedCheckpoint] = useState<CheckpointType>();

    const closeModal = (action: 'add' | 'edit' | 'delete') => {
        switch (action) {
            case "add":
                setOpenAdd(false);
                break;
            case "edit":
                setOpenEdit(false);
                break;
            case "delete":
                setOpenEdit(false);
                break;
        }
    }

    const openModal = (action: 'add' | 'edit' | 'delete', index?: number) => {
        switch (action) {
            case "add":
                setOpenAdd(true);
                break;
            case "edit":
                if (index !== undefined) {
                    setOpenEdit(true);
                    setSelectedCheckpoint(checkpoints[index]);
                }
                break;
            case "delete":
                if (index !== undefined) {
                    setOpenDelete(true);
                    setSelectedCheckpoint(checkpoints[index]);
                }
                break;
        }
    }

    const handleDeleteCheckpoint = async (checkpointId: number) => {
        const deletedItem = await deleteCheckpoint(checkpointId);
        if (deletedItem.message) {
            setOpenDelete(false);
            notify('Checkpoint supprimé', NotifyActions.Successful);
        } else {
            notify("Suppression impossible", NotifyActions.Error);
        }
    }

    //console.log('checkpoints', checkpoints);

    return (
        <>
            <Row className="mb-4 align-items-end">
                <Col>
                    <h6 className="card-subtitle text-muted">
                        Gestion des <code>checkpoints</code>.
                    </h6>
                </Col>
                <Col>
                    <Row>
                        <Col md={{ size: 1, offset: 11 }}>
                            <Button block color='success' onClick={() => openModal('add')}>
                                <FontAwesomeIcon
                                    icon={faPlus}
                                    style={{ cursor: 'pointer' }}
                                    fixedWidth
                                    className="align-middle btn-icon"
                                />
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>

            <ModalComponent
                open={openAdd}
                hide={() => closeModal('add')}
            >
                <AddCheckpointForm
                    useCheckpointsNumeros={checkpoints.map(c => c.numero)}
                    addCheckpoint={addCheckpoint}
                    closeModalAdd={() => closeModal('add')}
                />
            </ModalComponent>
            <ModalComponent
                open={openEdit}
                hide={() => closeModal('edit')}
            >
                <EditCheckpointForm
                    useCheckpointsNumeros={checkpoints.map(c => c.numero)}
                    closeModalEdit={() => closeModal('edit')}
                    updateCheckpoint={updateCheckpoint}
                    checkpoint={selectedCheckpoint}
                />
            </ModalComponent>
            <ModalComponent
                open={openDelete}
                hide={() => closeModal('delete')}>
                <DeleteCheckpoint
                    message={`Êtes-vous sûr de vouloir supprimer ce Checkpoint ${selectedCheckpoint?.standard
                        }`}
                    confirmModal={() => {
                        selectedCheckpoint !== undefined &&
                            handleDeleteCheckpoint(selectedCheckpoint.id);
                    }}
                />
            </ModalComponent>
            <Table striped hover>
                <thead>
                    <th>N°</th>
                    <th>Standard</th>
                    <th>Services</th>
                    <th>Zone</th>
                    <th>Sous-Zone</th>
                    <th style={{ textAlign: 'center' }}>Catégorie</th>
                    <th>Image</th>
                    <th>Date de création</th>
                    <th>Date de modification</th>
                    <th>{''}</th>
                </thead>
                <tbody>
                    {checkpoints &&
                        checkpoints.map((checkpoint, index) => {
                            return (
                                <tr key={index}>
                                    <td>{checkpoint.numero}</td>
                                    <td>{checkpoint.standard}</td>
                                    <td>{checkpoint.services?.map(serv => {
                                        return (
                                            <>{serv.name} <br /></>
                                        )
                                    })}</td>
                                    <td>{checkpoint.zone?.name}</td>
                                    <td>{checkpoint.subzone?.name}</td>
                                    <td>{checkpoint.category && (
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <div
                                                style={{
                                                    height: '10px',
                                                    width: '10px',
                                                    border: `1px solid ${checkpoint.category.color}`,
                                                    borderRadius: '100%',
                                                    backgroundColor: checkpoint.category.color,
                                                    margin: '10px'
                                                }}
                                            />
                                            {checkpoint.category.name}
                                        </div>
                                    )}</td>
                                    <td>
                                        {checkpoint.image ?
                                            <div style={{ width: '50px', height: '50px', padding: '4px' }}>
                                                <img style={{ borderRadius: '100%', width: '100%', height: '100%' }} src={`${PUBLIC_URL}${checkpoint.image}`} />
                                            </div>
                                            :
                                            null
                                        }
                                    </td>
                                    <td>{checkpoint.createdAt
                                        ? moment(
                                            typeof checkpoint.createdAt === "string" ?
                                                new Date(checkpoint.createdAt)
                                                : checkpoint.createdAt,
                                            'DD-MM-YYYY'
                                        ).format('DD-MM-YYYY')
                                        : null}</td>
                                    <td>{checkpoint.updatedAt
                                        ? moment(
                                            typeof checkpoint.updatedAt === "string" ?
                                                new Date(checkpoint.updatedAt)
                                                : checkpoint.updatedAt,
                                            'DD-MM-YYYY'
                                        ).format('DD-MM-YYYY')
                                        : null}</td>
                                    <td className="table-action">
                                        <FontAwesomeIcon
                                            icon={faPen}
                                            style={{ cursor: 'pointer' }}
                                            fixedWidth
                                            className="align-middle mr-3 btn-icon"
                                            onClick={() => openModal('edit', index)}
                                        />
                                        <FontAwesomeIcon
                                            icon={faTrash}
                                            style={{ cursor: 'pointer' }}
                                            fixedWidth
                                            className="align-middle btn-icon"
                                            onClick={() => openModal('delete', index)}
                                        />
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
        </>
    )
}

export default Checkpoint;
