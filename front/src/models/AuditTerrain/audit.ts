import { User } from "../user"
import {Service} from "../service";
import { Evaluation } from "./evaluation";

type Audit = {
    id: number,
    date: Date,
    createdAt: Date,
    createdBy: User
    updatedAt: Date,
    updatedBy: User,

    service?: Service,
    serviceId?: number,

    Evaluations?: Array<Evaluation>
}

type AuditMap = {
    id: number,
    image: string
}

export type {
    Audit,
    AuditMap
}
