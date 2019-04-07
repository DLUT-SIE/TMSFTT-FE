import { Department } from './department';
import { ProgramCategory } from './program-category';
export interface Program {
    id: number;
    department: number;
    category: number;
    department_detail: Department;
    category_detail: ProgramCategory;
    form: number[];
    name: string;
}
