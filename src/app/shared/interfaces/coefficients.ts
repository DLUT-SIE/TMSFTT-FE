interface Coefficient {
    coefficient: number;
    hours_option: number;
    workload_option: number;
}
export interface Coefficients {
    参与: Coefficient;
    专家: Coefficient;
}