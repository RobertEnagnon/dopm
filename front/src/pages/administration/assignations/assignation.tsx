import React, { useState } from "react";
import {Button, Card, CardBody, CardHeader, CardTitle, Col, Row} from "reactstrap";
import Modal from "../../../components/layout/modal";
import { options } from "../../../utils/dopm.utils";
import MUIDataTable from "mui-datatables";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPen,
    faTrash
} from "@fortawesome/free-solid-svg-icons";
import CreateAsBoardModal from "./createAsBoardModal";
import UpdateAsBoardModal from "./updateAsBoardModal";
import DeleteAsBoardModal from "./deleteAsBoardModal";
import moment from "moment";
import { useAsBoard } from "../../../hooks/Assignation/asboard";
import { AsBoard } from "../../../models/Assignation/asBoard";

const AssignationTab = () => {
    const { asBoards, addAsBoard, updateAsBoard, deleteAsBoard } = useAsBoard();
    const [ isCreationOpen, setIsCreationOpen ] = useState<boolean>( false );
    const [ isUpdateOpen, setIsUpdateOpen ] = useState<boolean>( false );
    const [ isDeleteOpen, setIsDeleteOpen ] = useState<boolean>( false )
    const [ selectedAsBoard, setSelectedAsBoard ] = useState<number>(-1)
    const currentAsBoard: AsBoard = asBoards.filter((asBoard) => asBoard.id === selectedAsBoard)[0];
    const [isPending, setIsPending] = useState(false)

    const onEdit = (dashboardId: number) => {
        setIsUpdateOpen(true);
        setSelectedAsBoard(dashboardId);
    };

    const onDelete = (dashboardId: number) => {
        setIsDeleteOpen(true);
        setSelectedAsBoard(dashboardId);
    };

    const onCreate = () => {
        setIsCreationOpen(true)
    }

    const onClose = () => {
        setIsUpdateOpen(false)
        setIsCreationOpen(false);
        setIsDeleteOpen(false);
    }

    const HandleAddAsBoard = async (asBoard: AsBoard) => {
        setIsPending(true)
        await addAsBoard(asBoard)
        setIsPending(false)
        setIsCreationOpen(false);
    }

    const HandleEditAsBoard = async (asBoard: AsBoard) => {
        setIsPending(true)
        await updateAsBoard(asBoard)
        setIsPending(false)
        setIsUpdateOpen(false);
    }

    const HandleDeleteAsBoard = async (asBoardId: number) => {
        setIsPending(true)
        await deleteAsBoard(asBoardId)
        setIsPending(false)
        setIsDeleteOpen(false);
    }

    return (
        <Card>
            <CardHeader>
                <Row>
                    <Col>
                        <CardTitle tag='h5'>Dashboards</CardTitle>
                        <h6 className="card-subtitle text-muted">
                            Gestion des <code>dashboards</code>.
                        </h6>
                    </Col>
                </Row>
            </CardHeader>
            <CardBody>
                {/* Popup for create a dashboard */}
                <Modal open={isCreationOpen} hide={setIsCreationOpen} size="sm">
                    <CreateAsBoardModal onSave={HandleAddAsBoard} onClose={onClose} isPending={isPending}/>
                </Modal>

                {/* Popup for update a dashboard */}
                <Modal open={isUpdateOpen} hide={setIsUpdateOpen} size="sm">
                    <UpdateAsBoardModal currentAsBoard={currentAsBoard} onSave={HandleEditAsBoard} onClose={onClose} isPending={isPending}/>
                </Modal>

                {/* Popup for delete a dashboard */}
                <Modal open={isDeleteOpen} hide={setIsDeleteOpen} size="sm">
                    <DeleteAsBoardModal onDelete={HandleDeleteAsBoard} onClose={onClose} selectedAsBoard={selectedAsBoard} isPending={isPending}/>
                </Modal>

                <Row>
                    <Col md={12}>
                        <MUIDataTable
                            title="Dashboards"
                            data={asBoards}
                            columns={[
                                { name: 'name', label: 'Nom' },
                                { name: 'order', label: 'Ordre' },
                                { 
                                    name: 'createdAt', 
                                    label: 'Date de création',
                                    options: {
                                        customBodyRender: (value: any) => {
                                            return <span>
                                                {`${moment(value).format('YYYY-MM-DD')}`}
                                            </span>
                                        }
                                    }
                                },
                                {
                                    name: 'id',
                                    label: 'Actions',
                                    options: {
                                        filter: false,
                                        sort: false,
                                        customBodyRender: (value: number) => {
                                            return (
                                                <>
                                                    <FontAwesomeIcon
                                                        icon={faPen}
                                                        fixedWidth
                                                        className="align-middle mr-3"
                                                        onClick={() => {
                                                            onEdit(value);
                                                        }}
                                                    />
                                                    <FontAwesomeIcon
                                                        icon={faTrash}
                                                        fixedWidth
                                                        className="align-middle"
                                                        onClick={() => {
                                                            onDelete(value);
                                                        }}
                                                    />
                                                </>
                                            )
                                        }
                                    }
                                }
                            ]}
                            options={options}
                            />
                    </Col>
                </Row>
                {isCreationOpen ? null :
                    <Row style={{marginTop: '1rem'}}>
                        <Col md={{size: 1, offset: 11}}>
                            <Button block color="success" onClick={onCreate}>
                                +
                            </Button>
                        </Col>
                    </Row>
                }
            </CardBody>
        </Card>
    )
}

export default AssignationTab;