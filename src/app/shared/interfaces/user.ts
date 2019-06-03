export interface User {
    id?: number;
    username?: string;
    last_login?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    is_active?: boolean;
    date_joined?: string;
    is_teacher?: boolean;
    is_department_admin?: boolean;
    is_school_admin?: boolean;
    department?: number;
    department_str?: string;
    administrative_department?: number;
    administrative_department_str?: string;
    groups?: number[];
    gender_str?: string;
    age?: number;
    onboard_time?: string;
    tenure_status?: string;
    education_background?: string;
    technical_title?: string;
    teaching_type?: string;
    cell_phone_number?: string;
}
