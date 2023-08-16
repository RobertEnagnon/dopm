
export enum PeriodEnum {
    // eslint-disable-next-line no-unused-vars
    quotidienne = 1,
    // eslint-disable-next-line no-unused-vars
    hebdomadaire,
    // eslint-disable-next-line no-unused-vars
    mensuelle,
    // eslint-disable-next-line no-unused-vars
    annuelle
}

export type PeriodType = {
    periodEnum: number,
    every: number,
    everyMonth?: number,
    day?: string[],
    month?: string,
    frequency?: number,
    rank?: string,
}

export const defaultPeriod: PeriodType = {
    periodEnum: PeriodEnum.quotidienne,
    every: 1
}