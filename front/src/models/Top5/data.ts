import {Curve} from "./curve";

type Data = {
    id: number
    date: string,
    data: number,
    comment: string,
    curve?: Curve,
    curveId?: number
}

export type {
    Data
}