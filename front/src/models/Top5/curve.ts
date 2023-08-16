import { Indicator } from "./indicator";

type Curve = {
    id: number,
    name: string,
    curveType: number,
    color: string,
    indicatorId?: number,
    indicator_id?: number

}

export type {
    Curve
}