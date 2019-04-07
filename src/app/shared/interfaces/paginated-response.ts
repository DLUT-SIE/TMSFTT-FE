/** RESTful response interface for paginated content. */
export interface PaginatedResponse<T> {
    count: number;
    next: string;
    previous: string;
    results: T[];
}
