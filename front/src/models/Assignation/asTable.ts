import {User} from "../user";
import {AsTask} from "./asTask";

type AsTable = {
    id: number,
    name: string,
    description: string,
    color: string,
    orderTable: number,
    tasks: Array<AsTask>,
    asBoardId: number,

  createdAt: Date,
    updatedAt: Date,
    createdBy: User
    updatedBy: User
}

export type {
    AsTable
}