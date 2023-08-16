import {Button, Col, Row, Table} from "reactstrap";
import moment from "moment";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen, faPlus, faTrash} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";
import ModalComponent from "../../../../components/layout/modal";
import {notify, NotifyActions} from "../../../../utils/dopm.utils";
import { useASCategory } from "../../../../hooks/Assignation/ascategory";
import {AsCategory} from "../../../../models/Assignation/asCategory";
import AddASCategoryForm from "./addASCategory";
import DeleteASCategory from "./deleteASCategory";
import EditASCategoryForm from "./editASCategory";

const ASCategories = () => {
    const { ascategories, addASCategory, updateASCategory, deleteASCategory } = useASCategory();
    const [openAdd, setOpenAdd] = useState<boolean>(false);
    const [openEdit, setOpenEdit] = useState<boolean>(false);
    const [openDelete, setOpenDelete] = useState<boolean>(false);
    const [selectedASCategory, setSelectedASCategory] = useState<AsCategory>();

    const closeModal = (action: 'add'|'edit'|'delete') => {
        switch (action) {
            case 'add':
                setOpenAdd(false);
                break;
            case 'edit':
                setOpenEdit(false);
                break;
            case 'delete':
                setOpenDelete(false);
                break;
        }
    }

    const openModal = (action: 'add'|'edit'|'delete', index?: number) => {
        switch (action) {
            case 'add':
                setOpenAdd(true);
                break;
            case 'edit':
                if( index !== undefined ) {
                    setOpenEdit(true);
                    setSelectedASCategory(ascategories[index]);
                }
                break;
            case 'delete':
                if( index !== undefined ) {
                    setOpenDelete(true);
                    setSelectedASCategory(ascategories[index]);
                }
                break;
        }
    }

    const handleDeleteASCategory = async (ascategoryId: number) => {
        const deletedItem = await deleteASCategory(ascategoryId);
        if( deletedItem.message ) {
            setOpenDelete(false);
            notify('Catégorie supprimée', NotifyActions.Successful);
        } else {
            notify("Suppression impossible", NotifyActions.Error);
        }
    }

    return (
        <>
            <Row className="mb-4 align-items-end">
                <Col>
                    <h6 className="card-subtitle text-muted">
                        Gestion des <code>catégories</code>.
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
                <AddASCategoryForm addASCategory={addASCategory} closeModalAdd={() => closeModal("add")} />
            </ModalComponent>
            <ModalComponent
                open={openEdit}
                hide={() => closeModal('edit')}
            >
                <EditASCategoryForm
                    closeModalEdit={() => closeModal('edit')}
                    updateATCategory={updateASCategory}
                    ascategory={selectedASCategory}
                />
            </ModalComponent>
            <ModalComponent
                open={openDelete}
                hide={() => closeModal('delete')}
            >
                <DeleteASCategory
                    message={`Êtes-vous sûr de vouloir supprimer cette Categorie ${
                        selectedASCategory?.name
                    }`}
                    confirmModal={() =>{
                        selectedASCategory !== undefined &&
                        handleDeleteASCategory(selectedASCategory.id);
                    }}
                />
            </ModalComponent>
            <Table striped hover>
                <thead>
                <tr>
                    <th>{''}</th>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Date de création</th>
                    <th>Date de modification</th>
                    <th>{''}</th>
                </tr>
                </thead>
                <tbody>
                {ascategories &&
                    ascategories.map((ascategory, index) => {
                        return (
                            <tr key={index}>
                                <td>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <div
                                            style={{
                                                height: '15px',
                                                width: '15px',
                                                border: `1px solid ${ascategory.color}`,
                                                borderRadius: '100%',
                                                backgroundColor: ascategory.color
                                            }}
                                        />
                                    </div>
                                </td>
                                <td>{ascategory.id}</td>
                                <td>{ascategory.name}</td>
                                <td>{ascategory.createdAt
                                    ? moment(
                                        typeof ascategory.createdAt === "string" ?
                                            new Date(ascategory.createdAt)
                                            :ascategory.createdAt,
                                        "DD-MM-YYYY hh:mm"
                                    ).format("DD-MM-YYYY hh:mm") : null}</td>
                                <td>{ascategory.updatedAt
                                    ? moment(
                                        typeof ascategory.updatedAt === "string" ?
                                            new Date(ascategory.updatedAt)
                                            :ascategory.updatedAt,
                                        "DD-MM-YYYY hh:mm"
                                    ).format("DD-MM-YYYY hh:mm") : null}</td>
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

export default ASCategories;
