import { CampusEvent, OffCampusEvent } from './event';
export interface Coefficient {
    role?: number;
    coefficient?: number;
    hours_option?: number;
    workload_option?: number;
    campus_event?: CampusEvent | number;
    off_campus_event?: OffCampusEvent | number;
    hours_option_str?: string;
    workload_option_str?: string;
    role_str?: string;
}
