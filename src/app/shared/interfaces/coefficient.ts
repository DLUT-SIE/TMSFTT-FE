import { CampusEvent, OffCampusEvent } from './event';
export interface Coefficient {
    role?: number;
    coefficient?: number;
    hours_option?: number;
    workload_option?: number;
    campus_event?: CampusEvent;
    off_campus_event?: OffCampusEvent;
}
