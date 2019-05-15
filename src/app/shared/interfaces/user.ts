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
    administrative_department?: number;
    administrative_department_str?: string;
    groups?: number[];
}
