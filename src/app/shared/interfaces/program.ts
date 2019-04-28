import { Department } from './department';

export interface Program {
    id?: number;
    name?: string;
    department?: Department|number;
    category?: number;
    form?: number[];
    status_str?: string;
}
