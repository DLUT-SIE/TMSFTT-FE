/** Interface for list requests. */
export interface ListRequest {
    offset?: number;
    limit?: number;
    extraParams?: Map<string, {}>;
}
