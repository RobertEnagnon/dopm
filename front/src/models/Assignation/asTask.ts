import { AsTable } from "./asTable";
import { UserData } from "../user";
import { AsCategory } from "./asCategory";
import { AsChecklist } from "./asChecklist";
import { AsFile } from "./asFile";

type AsConversation = {
    id: number,
    text: string,
    user: UserData,
    userId: number,
    taskId: number,
    createdAt: Date
}

type AsTask = {
    id: number,
    title: string,
    description: string,
    remain: string,
    estimation: string,
    orderTask: number,
    archived: number,

    table: AsTable,
    tableId?: number,

    category?: AsCategory,
    categoryId?: number,

    responsibles: Array<UserData>,
    checklist: Array<AsChecklist>,
    files: Array<AsFile>,
    conversation: Array<AsConversation>

    createdAt: Date,
    createdBy: string,
    updatedAt: Date,
    updatedBy: string
}

export type {
    AsTask,
    AsConversation
}