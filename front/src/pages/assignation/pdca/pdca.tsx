import {Col, Row} from "reactstrap";
import React, {useState} from "react";
import ModalComponent from "../../../components/layout/modal";
import PDCATable from "../components/table/readTable";
import {AsTable} from "../../../models/Assignation/asTable";
import EditTableForm from "../components/table/editTable";
import DeleteTable from "../components/table/deleteTable";
import {notify, NotifyActions} from "../../../utils/dopm.utils";
import { DragDropContext, Draggable, DragStart, Droppable, DropResult } from 'react-beautiful-dnd';
import {useAssignation} from "../../../components/context/assignation.context";

const PDCA = () => {

    const Assignation = useAssignation();
    const {
        tables,
        updateTable,
        deleteTable,
        reorderTable,
        addTask,
        updateTask,
        deleteTask,
        reorderTask,
        archivedView
    } = Assignation;

    const [ openEditTable, setOpenEditTable ] = useState<boolean>(false);
    const [ openDeleteTable, setOpenDeleteTable ] = useState<boolean>(false);

    const [ selectedTable, setSelectedTable ] = useState<AsTable|undefined>(undefined);

    const [ draggingElementName, setDraggingElementName ] = useState<string | null>(null);

    const closeModal = (action: 'edit'|'delete') => {
        switch (action) {
            case "edit":
                setOpenEditTable(false);
                setSelectedTable(undefined);
                break;
            case "delete":
                setOpenDeleteTable(false);
                setSelectedTable(undefined);
                break;
        }
    }

    const openModal = (action: 'edit'|'delete', idTable?: number) => {
        switch (action) {
            case "edit":
                if( idTable ) {
                    setSelectedTable(tables.find(t => t.id === idTable));
                    setOpenEditTable(true);
                }
                break;
            case "delete":
                if( idTable ) {
                    setSelectedTable(tables.find(t => t.id === idTable));
                    setOpenDeleteTable(true);
                }
                break;
        }
    }

    const handleDeleteTable = async (id: number) => {
        const deletedItem = await deleteTable(id);
        if( deletedItem.message ) {
            closeModal('delete');
            notify('Table supprimée', NotifyActions.Successful);
        } else {
            notify('Suppression impossible', NotifyActions.Error);
        }
    }

    const handleOnDragStart = (initial: DragStart) => {
      if (initial.draggableId.includes('table')) {
        setDraggingElementName('table')
      }
      if (initial.draggableId.includes('task')) {
        setDraggingElementName('task')
      }
    }

    const handleDragEnd = (result: DropResult) => {
        const currentlyDraggedElement = draggingElementName
        setDraggingElementName(null)
        if(!result.destination) {
          return;
        }
        if (currentlyDraggedElement === 'table') {
          reorderTable(result.source.index, result.destination.index);
        }
        if (currentlyDraggedElement === 'task') {
          const sourceSeparator = result.source.droppableId.indexOf('-');
          if( sourceSeparator === -1 ) {
            return;
          }
          const sourceTableId = result.source.droppableId.substring(sourceSeparator+1);

          const destinationSeparator = result.destination.droppableId.indexOf('-');
          if( destinationSeparator === -1 ) {
            return;
          }
          const destinationTableId = result.destination.droppableId.substring(destinationSeparator+1);

          const taskIdSeparator = result.draggableId.indexOf('-');
          if( taskIdSeparator === -1 ) {
            return;
          }
          const taskId = result.draggableId.substring(taskIdSeparator+1);
          reorderTask(parseInt(sourceTableId), parseInt(destinationTableId), parseInt(taskId), result.source.index, result.destination.index);
        }
    }

    return (
        <>
            <Row>
                <Col>
                    {selectedTable &&
                        <>
                            <ModalComponent
                                size={"xl"}
                                open={openEditTable}
                                hide={()=>closeModal('edit')}
                            >
                                <EditTableForm
                                    table={selectedTable}
                                    editTable={updateTable}
                                    closeModalEdit={()=>closeModal('edit')}
                                />
                            </ModalComponent>
                            <ModalComponent
                                open={openDeleteTable}
                                hide={() => closeModal('delete')}
                            >
                                <DeleteTable
                                    message={`Êtes-vous sûr de vouloir supprimer cette Table ${
                                        selectedTable?.name
                                    }`}
                                    confirmModal={() =>{
                                        selectedTable !== undefined &&
                                        handleDeleteTable(selectedTable.id);
                                    }}
                                />
                            </ModalComponent>
                        </>
                    }
                </Col>
            </Row>
            <Row>
                <Col>
                    {tables &&
                        <DragDropContext onDragStart={handleOnDragStart} onDragEnd={handleDragEnd}>
                            <Droppable droppableId="droppableGlobal" isDropDisabled={draggingElementName === 'task' || !draggingElementName} direction={'horizontal'}>
                                {(provided) => (
                                    <div className={"row"} style={{flexWrap: 'nowrap', overflowX: 'auto'}} ref={provided.innerRef} {...provided.droppableProps}>
                                        {tables.map((table, indexTable) => {
                                            return (
                                                <div style={{ margin: '6px', width: '320px' }}>
                                                    <Draggable key={`table-${table.id}`} draggableId={`table-${table.id}`} index={indexTable} isDragDisabled={draggingElementName === 'task'}>
                                                        {(provided) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                            >
                                                                <PDCATable
                                                                    table={table}
                                                                    openModalTable={openModal}
                                                                    provided={provided}
                                                                    draggingElementName={draggingElementName}
                                                                    tasksActions={{
                                                                        addTask,
                                                                        updateTask,
                                                                        deleteTask
                                                                    }}
                                                                    archivedView={archivedView}
                                                                />
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                </div>
                                            )
                                        })}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    }
                </Col>
            </Row>
        </>
    )
}

export default PDCA;
