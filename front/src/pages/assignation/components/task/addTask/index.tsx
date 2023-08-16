import {Modal} from "react-bootstrap";
import * as Yup from 'yup';
import {notify, NotifyActions} from "../../../../../utils/dopm.utils";
import {Form} from "./ServiceForm";
import { useState } from "react";
import { useAssignation } from "../../../../../components/context/assignation.context";

type AddTaskFormType = {
    addTask: Function,
    closeModalAdd: Function
    tableId?: number
}

type TaskAddType = {
    title: string,
    description?: string,
    remain?: string,
    estimation?: string,
    tableId?: number,
    categoryId?: number,
    responsibles: Array<string>
}

type ChecklistAddType = {id: number, label: string, done: 0 | 1}
type FileAddType = {id: number, label: string, file: File}

const AddTaskForm = (props: AddTaskFormType) => {
    const { addTask, closeModalAdd, tableId } = props;
    const { addChecklist, addFile } = useAssignation();
    const [checklist, setChecklist] = useState<Array<ChecklistAddType>>([]);
    const [files, setFiles] = useState<Array<FileAddType>>([]);

    const validationSchema = Yup.object({
      title: Yup.string().required('Vous devez indiquer un titre à la tâche'),
      description: Yup.string(),
      remain: Yup.string(),
      estimation: Yup.string().required('Une deadline est obligatoire'),
      categoryId: Yup.number().required('Une catégorie est obligatoire'),
      responsibles: Yup.array(),
      tableId: Yup.number().default(tableId).required('Une table est obligatoire')
    })

    const handleAddTask = async (task: TaskAddType) => {
        try {
            // task.tableId = tableId;
            const newTask = await addTask(task);
            await Promise.all(checklist.map(async c => await addChecklist(tableId, newTask.id, c)))
            await Promise.all(files.map(async f => await addFile(tableId, newTask.id, f.file)))
            notify(
                `La tâche ${newTask.title} a été créée`,
                NotifyActions.Successful
            );
            closeModalAdd();
        } catch (e) {
            notify('Ajout impossible', NotifyActions.Error);
        }
    }

    const values = {
        title: '',
        description: '',
        remain: '',
        estimation: '',
        categoryId: undefined,
        responsibles: [],
        tableId: tableId
    }

    return (
        <>
            <Modal.Header>
                <Modal.Title>Ajout d'une Tâche</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form
                    onSubmit={handleAddTask}
                    validationSchema={validationSchema}
                    initialValues={values}
                    additionnalElements={{
                        checklist,
                        setChecklist,
                        files,
                        setFiles
                    }}
                />
            </Modal.Body>
        </>
    )
}

export default AddTaskForm;