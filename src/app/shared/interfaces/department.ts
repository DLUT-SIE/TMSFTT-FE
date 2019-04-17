import { GenericObject } from './generics';

export interface Department extends GenericObject {
    id?: number;
    name?: string;
    create_time?: string;
    update_time?: string;
    admins?: number[];
    users?: number[];
}
