import {Modal} from "react-bootstrap";
import * as Yup from "yup";
import {notify, NotifyActions} from "../../../../../utils/dopm.utils";
import {Form} from "./ServiceForm";
import {AsTask} from "../../../../../models/Assignation/asTask";
import { DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faCopy, faArrowRightArrowLeft, IconDefinition, faTableList, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import React, { MouseEventHandler, useState } from "react";
import { useAssignation } from "../../../../../components/context/assignation.context";

type EditTaskFormType = {
    task: AsTask,
    editTask: Function,
    closeModalEdit: Function
}

type TaskEditType = {
    title: string,
    description?: string,
    remain?: string,
    estimation?: string,
    tableId?: number,
    categoryId?: number,
    responsibles: string[],
    archived: number
}

type DropdownType = {
    title: string,
    icon: IconDefinition,
    onClick: MouseEventHandler,
    color: string
}

const EditTaskForm = (props: EditTaskFormType) => {
    const { editTask, closeModalEdit } = props;
    const { tables, addTask, moveTask } = useAssignation();

    const initialDropdown = [{
        title: 'Déplacer',
        icon: faArrowRightArrowLeft,
        onClick: () => {
            setDropdown([
                {
                    title: 'Retour',
                    icon: faArrowLeft,
                    onClick: () => { setDropdown(initialDropdown) },
                    color: 'inherit'
                },
                ...tables
                    .filter(t => t.id !== props.task.tableId)
                    .map(t => ({
                        title: t.name,
                        icon: faTableList,
                        onClick: () => {
                            moveTask(props.task.id, props.task, t.id)
                            closeModalEdit()
                        },
                        color: t.color
                    }))
            ]);
        },
        color: 'inherit'
    }, {
        title: 'Dupliquer',
        icon: faCopy,
        onClick: () => {
            addTask(props.task)
            closeModalEdit()
        },
        color: 'inherit'
    }];

    const [ dropdown, setDropdown ] = useState<Array<DropdownType>>(initialDropdown);

    const validationSchema = Yup.object({
        id: Yup.number().required().default(props.task.id),
        title: Yup.string().required("Vous devez indiquer un titre à la tâche"),
        description: Yup.string(),
        remain: Yup.string(),
        estimation: Yup.string(),
        categoryId: Yup.number().default(props.task.categoryId),
        responsibles: Yup.array().default(props.task.responsibles.map(r => r.id.toString())),
        tableId: Yup.number().required().default(props.task.tableId),
        archived: Yup.number().required().default(props.task.archived)
    })

    const handleEditTask = async (task: TaskEditType) => {
        try {
            const newTask = await editTask(props.task.id, task);
            notify(
                `La tâche ${newTask.title} a été modifiée`,
                NotifyActions.Successful
            );
            closeModalEdit();
        } catch (e) {
            notify("Modification impossible", NotifyActions.Error);
        }
    }

    const values = {
        id: props.task.id,
        title: props.task.title,
        description: props.task.description,
        remain: props.task.remain,
        estimation: props.task.estimation,
        categoryId: props.task.categoryId ?? 0,
        responsibles: props.task.responsibles.map(r => r.id.toString()),
        tableId: props.task.tableId,
        archived: props.task.archived
    }

    return (
        <>
            <Modal.Header>
                <Modal.Title>Modification de {props.task.title}</Modal.Title>
                <UncontrolledDropdown className="d-inline-block">
                    <DropdownToggle color="white" style={{fontSize: "0.9em", padding: "4px 12px"}}>
                        <FontAwesomeIcon icon={faEllipsisVertical} />
                    </DropdownToggle>
                    <DropdownMenu end>
                        {
                            dropdown.map((d, index) =>
                                <div
                                    key={`dropdown-${index}`}
                                    className="as-icon"
                                    onClick={d.onClick}
                                    style={{
                                        ...(d.color === 'inherit' ? {} : {backgroundColor: d.color}),
                                        color: d.color === 'inherit' ? '#3e4676' : 'white'
                                    }}
                                >
                                    {d.title} <FontAwesomeIcon icon={d.icon} />
                                </div>
                            )
                        }
                    </DropdownMenu>
                </UncontrolledDropdown>
            </Modal.Header>
            <Modal.Body>
                <Form
                    onSubmit={handleEditTask}
                    validationSchema={validationSchema}
                    initialValues={values}
                    task={props.task}
                />
            </Modal.Body>
        </>
    )
}

export default EditTaskForm;