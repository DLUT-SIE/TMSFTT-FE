export interface Department {
    name: string;
}

export interface DepartmentRequest extends Department {
}

export interface DepartmentResponse extends Department {
    id: number;
    create_time: string;
    update_time: string;
    admins: number[];
}
