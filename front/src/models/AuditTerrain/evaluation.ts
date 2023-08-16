import {User} from "../user";
import {Checkpoint} from "./checkpoint";
import {Audit} from "./audit";

type Evaluation = {
    id: number,
    check: string,
    comment: string,
    image: string,
    createdAt: Date,
    createdBy: User,
    updatedAt: Date,
    updatedBy: User,

    checkpointId?: number,
    checkpoint?: Checkpoint,

    auditId?: number,
    audit?: Audit
}

export type {
    Evaluation
}
