export interface StatusChangeLog {
    id?: number;
    pre_status?: number;
    pre_status_str?: string;
    post_status?: number;
    post_status_str?: string;
    time?: string;
    record?: number;
    user?: string;
}
