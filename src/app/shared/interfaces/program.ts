import { Department } from './department';
import { ProgramCategory } from './program-category';

export interface Program {
    id?: number;
    name?: string;
    department?: Department|number;
    category?: ProgramCategory|number;
    form?: number[];
}
