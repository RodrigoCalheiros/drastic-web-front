import { Statistics } from "./statistics.model";

export interface Layer {
    name: string,
    description?: string,
    statistics?: Statistics,
    visible?: boolean,
    sld?: string
}