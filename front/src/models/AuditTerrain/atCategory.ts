import {User} from "../user";

type AtCategory = {
    id: number,
    color: string,
    name: string,
    createdAt: Date,
    updatedAt: Date,
    createdBy: User
    updatedBy: User
}

export type {
    AtCategory
}