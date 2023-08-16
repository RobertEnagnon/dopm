import {Indicator} from "./indicator";

type Target = {
    id: number,
    name: string,
    target: number,
    color: string,
    targetType: number,
    targetGoal: number,
    indicator?: Indicator
}

export type {
    Target
}