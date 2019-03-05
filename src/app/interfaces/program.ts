import { Department } from './department';
import { ProgramCategory } from './program-category';
export interface ProgramDetail {
    id: number;
    department_detail: Department;
    category_detail: ProgramCategory;
    form: [];
    name: string;
}
