import RequestService from "../request";
import {AsTask} from "../../models/Assignation/asTask";


const GetASTasks = async (tableId: number = 0) => {
    let req = new RequestService();
    let res;
    if(tableId == 0) {
        res = await req.fetchEndpoint('as_tasks');
    } else {
        res = await req.fetchEndpoint(`as_tasks/${tableId}`);
    }
    return res?.data.map((task: AsTask) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt)
    }))
}

const AddASTask = async (task: AsTask) => {
    let req = new RequestService();
    let user = JSON.parse( localStorage.getItem('user')! );

    const res = await req.fetchEndpoint('as_tasks', 'POST', {...task, user});
    const newTask = res?.data?.newASTask;

    return {
        ...newTask,
        updatedAt: new Date(newTask.updatedAt),
        createdAt: new Date(newTask.createdAt)
    };
}

const UpdateASTask = async (id: number, task: AsTask) => {
    let req = new RequestService();
    return await req.fetchEndpoint(`as_tasks/${id}`, 'PUT', task);
}

const DeleteASTask = async (id: number) => {
    let req = new RequestService();
    const res = await req.fetchEndpoint(`as_tasks/${id}`, 'DELETE');
    return res?.data;
}

const ReorderASTask = async (tasks: Array<AsTask>) => {
    let req = new RequestService();
    const res = await req.fetchEndpoint('as_tasks_reorder', 'PUT', {tasks});
    return res?.data;
}

export {
    GetASTasks,
    AddASTask,
    UpdateASTask,
    DeleteASTask,
    ReorderASTask
}