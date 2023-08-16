import RequestService from "../request";

const AddASComment = async (taskId: number, text: string) => {
    let req = new RequestService();

    const res = await req.fetchEndpoint(`as_tasks/${taskId}/conversation`, 'POST', { text });
    const newASComment = res?.data.newTaskConversation;
    return newASComment;
}

export {
    AddASComment
}