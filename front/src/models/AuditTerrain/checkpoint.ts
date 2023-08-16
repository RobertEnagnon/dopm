import {User} from "../user";
import {Service} from "../service";
import {Zone} from "../zone";
import {Subzone} from "../subzone";
import {AtCategory} from "./atCategory";
import {PeriodType} from '../period'

type Checkpoint = {
    id: number,
    numero: number,
    standard: string,
    description?: string,
    image?: string,
    createdAt: Date,
    createdBy: User,
    updatedAt: Date,
    updatedBy: User,

    serviceIds?: Array<number>,
    zoneId?: number,
    subzoneId?: number,
    categoryId?: number
    periodId?: number   

    services?: Array<Service>,
    zone?: Zone,
    subzone?: Subzone,
    category?: AtCategory
    period?: PeriodType

    checkpoint_service?: any,
    color?: string
}

export type {
    Checkpoint
}
