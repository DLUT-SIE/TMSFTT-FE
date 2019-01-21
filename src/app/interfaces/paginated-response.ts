/** RESTful response interface for paginated content. */
export interface PaginatedResponse {
    count: number;
    next: string;
    previous: string;
    results: {};
}
