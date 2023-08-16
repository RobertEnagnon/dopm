import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    CardTitle,
    DropdownMenu,
    DropdownToggle, Row, UncontrolledDropdown
} from "reactstrap";
import {AsTable} from "../../../../../models/Assignation/asTable";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEllipsisVertical, faPen, faTrash} from "@fortawesome/free-solid-svg-icons";
import PDCATask from "../../task/readTask";
import {Draggable, Droppable} from "react-beautiful-dnd";
import React, {useState} from "react";
import ModalComponent from "../../../../../components/layout/modal";
import EditTaskForm from "../../task/editTask";
import DeleteTask from "../../task/deleteTask";
import AddTaskForm from "../../task/addTask";
import {AsTask} from "../../../../../models/Assignation/asTask";
import {notify, NotifyActions} from "../../../../../utils/dopm.utils";

type PDCAProps = {
    table: AsTable,
    openModalTable: Function,
    provided: any,
    draggingElementName: string | null,
    tasksActions: { addTask: Function, updateTask: Function, deleteTask: Function },
    archivedView: boolean
}

const PDCATable = ({ table, openModalTable, provided, draggingElementName, tasksActions, archivedView }: PDCAProps) => {
    const { addTask, updateTask, deleteTask } = tasksActions;

    const [ selectedTask, setSelectedTask ] = useState<AsTask|undefined>(undefined);
    const [ openAddTask, setOpenAddTask ] = useState<boolean>(false);
    const [ openEditTask, setOpenEditTask ] = useState<boolean>(false);
    const [ openDeleteTask, setOpenDeleteTask ] = useState<boolean>(false);

    const openModal = (action: 'add'|'edit'|'delete', idTask?: number) => {
        switch (action) {
            case "add":
                setOpenAddTask(true);
                break;
            case "edit":
                if( idTask ) {
                    setSelectedTask(table.tasks.find(t => t.id === idTask));
                    setOpenEditTask(true);
                }
                break;
            case "delete":
                if( idTask ) {
                    setSelectedTask(table.tasks.find(t => t.id === idTask));
                    setOpenDeleteTask(true);
                }
                break;
        }
    }

    const closeModal = (action: 'add'|'edit'|'delete') => {
        switch (action) {
            case "add":
                setOpenAddTask(false);
                break;
            case "edit":
                setOpenEditTask(false);
                setSelectedTask(undefined);
                break;
            case "delete":
                setOpenDeleteTask(false);
                setSelectedTask(undefined);
                break;
        }
    }

    const handleDeleteTask = async (task: AsTask) => {
        const deletedItem = await deleteTask(task);
        if( deletedItem.message ) {
            closeModal('delete');
            notify('Tâche supprimée', NotifyActions.Successful);
        } else {
            notify('Suppression impossible', NotifyActions.Error)
        }
    }

    return (
        <Card style={{ margin: '6px', width: '320px', border: "0" }}>
            <ModalComponent
                open={openAddTask}
                hide={()=>closeModal('add')}
            >
                <AddTaskForm
                    addTask={addTask}
                    tableId={table.id}
                    closeModalAdd={()=>closeModal('add')}
                />
            </ModalComponent>
            {selectedTask &&
                <>
                    <ModalComponent
                        open={openEditTask}
                        hide={()=>closeModal('edit')}
                    >
                        <EditTaskForm
                            task={selectedTask}
                            editTask={updateTask}
                            closeModalEdit={()=>closeModal('edit')}
                        />
                    </ModalComponent>
                    <ModalComponent
                        open={openDeleteTask}
                        hide={() => closeModal('delete')}
                    >
                        <DeleteTask
                            message={`Êtes-vous sûr de vouloir supprimer cette Tâche ${
                                selectedTask?.title
                            }`}
                            confirmModal={() =>{
                                selectedTask !== undefined &&
                                handleDeleteTask(selectedTask);
                            }}
                        />
                    </ModalComponent>
                </>
            }
            <CardHeader style={table.color ? {backgroundColor: table.color, padding:"0.75rem 1rem"} : {}} className='cursor-grab' {...provided.dragHandleProps}>
                <CardTitle tag="h5" style={table.color ? {color: 'white', display: "flex", justifyContent: "space-between", marginBottom:"0"} : {display: "flex", justifyContent: "space-between", marginBottom:"0"}}>{table.name}
                    <UncontrolledDropdown className="d-inline-block">
                        <DropdownToggle color="white"
                                        style={{fontSize: "0.9em", padding: "4px 12px"}}>
                            <FontAwesomeIcon icon={faEllipsisVertical} style={{ color: table.color ? "white" : '#153D77' }} />
                        </DropdownToggle>
                        <DropdownMenu end>
                            <div
                                className='as-icon'
                                onClick={()=>openModalTable('edit', table.id)}
                            >
                                Modifier <FontAwesomeIcon icon={faPen} style={{ color: table.color ?? '#153D77', margin: 'auto 0' }} />
                            </div>
                            <div
                                className='as-icon'
                                onClick={()=>openModalTable('delete', table.id)}
                            >
                                Supprimer <FontAwesomeIcon icon={faTrash} style={{ color: table.color ?? '#153D77', margin: 'auto 0' }} />
                            </div>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </CardTitle>
                <h6 className={`card-subtitle ${table.color ? '' : 'text-muted'}`} style={table.color ? {color: '#f0f0f0', minHeight: 18} : {}}>{table.description}</h6>
            </CardHeader>
            <CardBody style={{padding: '0.5rem'}}>
                <Droppable droppableId={`droppable-${table.id}`} isDropDisabled={draggingElementName === 'table' || !draggingElementName}>
                    {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                            {table.tasks.map((task, indexTask) => {
                              return (
                                <Row key={`rowtask-${task.id*Date.now()}`}>
                                    <Draggable key={`task-${task.id}`} draggableId={`task-${task.id}`} index={indexTask} isDragDisabled={draggingElementName === 'table'}>
                                        {(provided) => (
                                            <div className="col-12" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                <PDCATask task={task} openModal={openModal} />
                                            </div>
                                        )}
                                    </Draggable>
                                </Row>
                              )
                            })}
                            {
                                table.tasks.length === 0
                                && <Row>
                                    <div style={{textAlign: "center", paddingTop: 10, color: "#828282"}} className="col-12">
                                        Déposer ou créer une tâche ici...
                                    </div>
                                </Row>
                            }
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </CardBody>
            <CardFooter>
                {
                    !archivedView && <Button color="primary" block onClick={()=>openModal('add')}>
                        Ajouter une tâche
                    </Button>
                }
            </CardFooter>
        </Card>
    )
}

export default PDCATable;
