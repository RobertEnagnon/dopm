import {Button, Col, Row, Table} from "reactstrap";
import {useATCategory} from "../../../../hooks/AuditTerrain/atcategory";
import moment from "moment";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen, faPlus, faTrash} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";
import ModalComponent from "../../../../components/layout/modal";
import AddATCategoryForm from "./addATCategory";
import {AtCategory} from "../../../../models/AuditTerrain/atCategory";
import EditATCategoryForm from "./editATCategory";
import {notify, NotifyActions} from "../../../../utils/dopm.utils";
import DeleteATCategory from "./deleteATCategory";

const ATCategories = () => {
    const { atcategories, addATCategory, updateATCategory, deleteATCategory } = useATCategory();
    const [openAdd, setOpenAdd] = useState<boolean>(false);
    const [openEdit, setOpenEdit] = useState<boolean>(false);
    const [openDelete, setOpenDelete] = useState<boolean>(false);
    const [selectedATCategory, setSelectedATCategory] = useState<AtCategory>();

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
                    setSelectedATCategory(atcategories[index]);
                }
                break;
            case 'delete':
                if( index !== undefined ) {
                    setOpenDelete(true);
                    setSelectedATCategory(atcategories[index]);
                }
                break;
        }
    }

    const handleDeleteATCategory = async (atcategoryId: number) => {
        const deletedItem = await deleteATCategory(atcategoryId);
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
                <AddATCategoryForm addATCategory={addATCategory} closeModalAdd={() => closeModal("add")} />
            </ModalComponent>
            <ModalComponent
                open={openEdit}
                hide={() => closeModal('edit')}
            >
                <EditATCategoryForm
                  closeModalEdit={() => closeModal('edit')}
                  updateATCategory={updateATCategory}
                  atcategory={selectedATCategory}
                />
            </ModalComponent>
            <ModalComponent
                open={openDelete}
                hide={() => closeModal('delete')}
            >
                <DeleteATCategory
                    message={`Êtes-vous sûr de vouloir supprimer cette Categorie ${
                        selectedATCategory?.name
                    }`}
                    confirmModal={() =>{
                        selectedATCategory !== undefined &&
                            handleDeleteATCategory(selectedATCategory.id);
                    }}
                />
            </ModalComponent>
            <Table striped hover>
                <thead>
                    <tr>
                        <th>{''}</th>
                        <th>Nom</th>
                        <th>Date de création</th>
                        <th>Date de modification</th>
                        <th>{''}</th>
                    </tr>
                </thead>
                <tbody>
                {atcategories &&
                    atcategories.map((atcategory, index) => {
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
                                                border: `1px solid ${atcategory.color}`,
                                                borderRadius: '100%',
                                                backgroundColor: atcategory.color
                                            }}
                                        />
                                    </div>
                                </td>
                                <td>{atcategory.name}</td>
                                <td>{atcategory.createdAt
                                    ? moment(
                                        typeof atcategory.createdAt === "string" ?
                                            new Date(atcategory.createdAt)
                                            :atcategory.createdAt,
                                            "DD-MM-YYYY hh:mm"
                                    ).format("DD-MM-YYYY hh:mm") : null}</td>
                                <td>{atcategory.updatedAt
                                    ? moment(
                                        typeof atcategory.updatedAt === "string" ?
                                            new Date(atcategory.updatedAt)
                                            :atcategory.updatedAt,
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

export default ATCategories;
