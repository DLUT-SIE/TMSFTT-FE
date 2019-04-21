export interface User {
    id?: number;
    username?: string;
    last_login?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    is_active?: boolean;
    date_joined?: string;
    user_permissions?: number[];
    is_teacher?: boolean;
    is_department_admin?: boolean;
    is_school_admin?: boolean;
    department?: number;
    department_str?: string;
}
