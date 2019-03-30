export interface Admins {
    id: number;
    username: string;
    last_login: string;
    first_name: string;
    last_name: string;
    email: string;
    is_active: boolean;
    data_joined: string;
    user_permissions: string[];
}
