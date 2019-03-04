import { Department } from './department';
import { Category } from './category';
export interface ProgramDetail {
    id: number;
    department_detail: Department;
    category_detail: Category;
    form: [];
    name: string;
}
