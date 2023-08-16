import RequestService from "../request";

const AddASFile = async (taskId: number, file: File) => {
    let req = new RequestService();
    const formData = new FormData();
    formData.append('sampleFile', file);
    const res = await req.fetchEndpoint(`as_tasks/${taskId}/file`, 'POST', formData, false);
    return res?.data?.newFile;
}

const DeleteASFile = async (id: number, taskId: number) => {
    let req = new RequestService();
    const res = await req.fetchEndpoint(`as_tasks/${taskId}/file/${id}`, 'DELETE');
    return res?.data;
}

export {
    AddASFile,
    DeleteASFile
}