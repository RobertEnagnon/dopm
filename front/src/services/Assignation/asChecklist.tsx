import RequestService from "../request";

const AddASChecklist = async (taskId: number, checkElement: { id: number, label: string, done: 0 | 1 } | null = null) => {
    let req = new RequestService();
    const res = await req.fetchEndpoint(`as_tasks/${taskId}/checklist`, 'POST', checkElement);
    return res?.data?.newChecklist;
}

const UpdateASChecklist = async (id: number, taskId: number, label: string, done: 0 | 1) => {
    let req = new RequestService();
    return await req.fetchEndpoint(`as_tasks/${taskId}/checklist/${id}`, 'PUT', { label, done });
}

const DeleteASChecklist = async (id: number, taskId: number) => {
    let req = new RequestService();
    const res = await req.fetchEndpoint(`as_tasks/${taskId}/checklist/${id}`, 'DELETE');
    return res?.data;
}

export {
    AddASChecklist,
    UpdateASChecklist,
    DeleteASChecklist
}