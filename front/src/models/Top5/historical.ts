import {Indicator} from "./indicator";

type Historical = {
    id: number,
    month: string,
    year: string,
    data: number,
    target: number,
    comment?: string,
    indicator?: Indicator,
    indicatorId?: number
}
type Comment = {
    id: number,
    month: number,
    year: string,
    indicatorId: number,
    comment: string
}

export type {
    Historical,
    Comment
}