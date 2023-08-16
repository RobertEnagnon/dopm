import RequestService from "../request";
import {Checkpoint} from "../../models/AuditTerrain/checkpoint";

const GetCheckpoints = async () => {
    let req = new RequestService();
    const res = await req.fetchEndpoint('audit-checkpoint');

    return res?.data.map((check: Checkpoint) => ({
        ...check,
        createdAt: new Date(check.createdAt),
        updatedAt: new Date(check.updatedAt),
        services: check.checkpoint_service.map((cs: any) => cs.service)
    }));
}

const AddCheckpoint = async (checkpoint: Checkpoint) => {
    let req = new RequestService();
    let user = JSON.parse( localStorage.getItem('user')! );

    const res = await req.fetchEndpoint('audit-checkpoint', 'POST', {...checkpoint, user});
    const newCheckpoint = res?.data.newCheckpoint;
    return {
        ...newCheckpoint,
        updatedAt: new Date(newCheckpoint.updatedAt),
        createdAt: new Date(newCheckpoint.createdAt),
        periodId: newCheckpoint.period.id
    };
}

const UpdateCheckpoint = async (id: number, checkpoint: Checkpoint) => {
    let req = new RequestService();
    return await req.fetchEndpoint(`audit-checkpoint/${id}`, 'PUT', checkpoint);
}

const DeleteCheckpoint = async (id: number) => {
    let req = new RequestService();
    const res = await req.fetchEndpoint(`audit-checkpoint/${id}`, 'DELETE');
    return res?.data;
}

export {
    GetCheckpoints,
    AddCheckpoint,
    UpdateCheckpoint,
    DeleteCheckpoint
}