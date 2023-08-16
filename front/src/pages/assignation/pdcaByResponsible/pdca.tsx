import {Col, Row} from "reactstrap";
import moment from "moment";
import {useAssignation} from "../../../components/context/assignation.context";
import DefaultAvatar from "../../../assets/img/avatars/avatar.webp";
import "./pdca.scss";
import PDCATask from "../components/task/readTask";
import React, {useState} from "react";
import {AsTask} from "../../../models/Assignation/asTask";
import {notify, NotifyActions} from "../../../utils/dopm.utils";
import ModalComponent from "../../../components/layout/modal";
import EditTaskForm from "../components/task/editTask";
import DeleteTask from "../components/task/deleteTask";
import {
    DragDropContext,
    Draggable,
    Droppable,
    DroppableProvided,
    DroppableStateSnapshot,
    DropResult
} from "react-beautiful-dnd";
const PUBLIC_URL = process.env.REACT_APP_PUBLIC_URL;

const PDCA = () => {
    const {
        getTasksByResponsibles,
        tables,
        updateTask,
        deleteTask,
        displayMode,
        displayModes
    } = useAssignation();

    let nbDays = 0
    switch (displayMode) {
        case displayModes.day:
            nbDays = 1
            break
        case displayModes.week:
            nbDays = 7
            break
        case displayModes.doubleWeeks:
            nbDays = 14
            break
        case displayModes.month:
            nbDays = 1
            break
    }
    const dates: Array<moment.Moment> = []
    for (let i = 0; i < nbDays; i++) {
        const newDate =  moment().add(i, 'days')
        if (newDate.isoWeekday() !== 6 && newDate.isoWeekday() !== 7) {
            dates.push(moment().add(i, 'days'))
        }
    }

    const responsibles = getTasksByResponsibles();

    const [ selectedTask, setSelectedTask ] = useState<AsTask|undefined>(undefined);
    const [ openEditTask, setOpenEditTask ] = useState<boolean>(false);
    const [ openDeleteTask, setOpenDeleteTask ] = useState<boolean>(false);

    const openModal = (action: 'add'|'edit'|'delete', idTask: number) => {
        switch (action) {
            case "edit":
                if( idTask ) {
                    setSelectedTask(responsibles
                        .filter(responsible =>
                            responsible.tasks.filter(task => task.id === idTask).length > 0
                        )[0].tasks
                            .find(t => t.id === idTask));
                    setOpenEditTask(true);
                }
                break;
            case "delete":
                if( idTask ) {
                    setSelectedTask(responsibles
                        .filter(responsible =>
                            responsible.tasks.filter(task => task.id === idTask).length > 0
                        )[0].tasks
                        .find(t => t.id === idTask));
                    setOpenDeleteTask(true);
                }
                break;
        }
    }

    const closeModal = (action: 'add'|'edit'|'delete') => {
        switch (action) {
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

    const handleDragEndEvent = async (result: DropResult) => {
        if (!result.destination) {
            return
        }
        const newDate = result.destination.droppableId.split('droppableDates-')[1]
        const [, taskId, tableId] = result.draggableId.split('-')
        if (!newDate || !taskId || !tableId) {
            return
        }
        const table = tables.find(table => table.id === +tableId)
        const task = table?.tasks.find(task => task.id === +taskId)
        await updateTask(task?.id, { ...task, estimation: newDate })
    }

    return (
        <div className="tasksByResponsibles">
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
            <Row className="dates border-bottom">
                <Col className="column-max-width border-right" />
                {
                    displayMode !== displayModes.month
                        ? dates.map((date, index) =>
                            <Col
                                key={date.day()}
                                className={`text-center ${index + 1 === dates.length ? '' : 'border-right'}`}
                                xs={index === 0 && [displayModes.week, displayModes.doubleWeeks].includes(displayMode) ? displayMode === displayModes.week ? 3 : 2 : false}
                            >
                                <span>{ date.format('dddd DD/MM') }</span>
                            </Col>
                        )
                        : <Col className={`text-center border-right`}>
                            <span>{ dates[0].format('MM/YYYY').toUpperCase() }</span>
                        </Col>
                }
            </Row>
            {
                responsibles.map((responsible, index) =>
                    <DragDropContext onDragEnd={handleDragEndEvent} key={'' + responsible.id + index + Date.now()}>
                        <Row key={responsible.id} className={`dates ${[displayModes.week, displayModes.doubleWeeks].includes(displayMode) ? 'rowMinHeight' : ''} ${index + 1 === responsibles.length ? '' : 'border-bottom'}`}>
                            <Col className="sidebar-user column-max-width border-right">
                                <p>
                                    <img
                                        src={`${PUBLIC_URL}/${responsible?.url}`}
                                        width="75"
                                        height="75"
                                        className="rounded-circle imgResponsible"
                                        onError={(event) => (event.target as HTMLImageElement).src = DefaultAvatar}
                                        alt="Avatar"
                                    />
                                </p>
                                <p className="mb-1">{responsible.firstname} {responsible.lastname}</p>
                                <p className="mb-1"><small>{responsible.function}</small></p>
                            </Col>
                            {
                                dates.map((date, index) =>
                                    <Droppable droppableId={`droppableDates-${date.format('YYYY-MM-DD')}`} key={index + Date.now()} direction={"horizontal"}>
                                        {(provided, snapshot) => (
                                            <>
                                                <TaskField
                                                    date={date}
                                                    datesLength={dates.length}
                                                    index={index}
                                                    tasks={responsible.tasks}
                                                    openModal={openModal}
                                                    provided={provided}
                                                    snapshot={snapshot}
                                                />
                                            </>
                                        )}
                                    </Droppable>
                                )
                            }
                        </Row>

                    </DragDropContext>
                )
            }
        </div>
    )
}

type TaskFieldType = {
    date: moment.Moment,
    datesLength: number,
    index: number,
    tasks: AsTask[],
    openModal: Function,
    provided: DroppableProvided,
    snapshot: DroppableStateSnapshot
}

const TaskField = ({ date, datesLength, index, tasks, openModal, provided, snapshot }: TaskFieldType) => {
    const { displayMode, displayModes } = useAssignation();

    const tasksToDisplay = tasks.filter(task => {
        if (displayMode !== displayModes.month) {
            return task.estimation === date.format('YYYY-MM-DD')
        }
        return moment(task.estimation).format('YYYY-MM') === date.format('YYYY-MM')
    })

    return (
        <Col
            key={date.day()}
            className={`${index +1 === datesLength ? '' : 'border-right'} ${snapshot.isDraggingOver ? 'isDraggingOver' : ''} ${[displayModes.day, displayModes.month].includes(displayMode) ? 'pl-1 pr-1' : ''}`}
            xs={index === 0 && [displayModes.week, displayModes.doubleWeeks].includes(displayMode) ? displayMode === displayModes.week ? 3 : 2 : false}
        >
            <div className={[displayModes.day, displayModes.month, displayModes.week].includes(displayMode) ? 'row' : ''} ref={provided.innerRef} {...provided.droppableProps}>
                {
                    tasksToDisplay.map((task, indexTask) =>
                        <Draggable key={`task-${task.id}`} draggableId={`task-${task.id}-${task.tableId}`} index={indexTask} isDragDisabled={[displayModes.day, displayModes.month].includes(displayMode)}>
                            {(provided) => (
                                <div
                                    key={task.id + new Date().toDateString()}
                                    className={
                                      [displayModes.day, displayModes.month, displayModes.week].includes(displayMode)
                                        ? displayMode === displayModes.week
                                          ? `col-6 pl-${indexTask % 2 === 0 ? 3 : 1} pr-${indexTask % 2 === 0 ? 1 : 3}`
                                          : 'col flex-wrap-250'
                                        : `pl-1 pr-1`
                                    }
                                    style={{
                                        maxWidth: [displayModes.day, displayModes.month].includes(displayMode) ? 300 : 'initial',
                                        minWidth: [displayModes.day, displayModes.month].includes(displayMode) ? 300 : 'initial'
                                    }}
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                >
                                    <PDCATask task={task} openModal={openModal} responsiblesView={true} />
                                </div>
                            )}
                        </Draggable>

                    )
                }
            </div>
        </Col>
    );
}

export default PDCA;
