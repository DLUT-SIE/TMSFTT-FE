import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { PaginatedResponse } from 'src/app/interfaces/paginated-response';
import { ListRequest } from 'src/app/interfaces/list-request';

/** Implement generic logic for retrieving list of objects. */
export class GenericListService {
    constructor(
        protected readonly http: HttpClient,
    ) { }

    /** Retrieve objects of type T from given resource URL with filter parameters. */
    protected list<T>(resourceURL: string, req: ListRequest) {
        // Remove prefix and suffix /
        resourceURL = resourceURL.replace(/(^[\/]+)|([\/]+$)/g, '');

        // Construct query parameters like ?offset=0&limit=10
        const params = req.extraParams || new Map();
        params.set('offset', req.offset || 0);
        params.set('limit', req.limit || environment.PAGINATION_SIZE);
        const queryParams = Array.from(params.keys()).sort().map(
            key => key + '=' + encodeURIComponent(params.get(key).toString())).join('&');

        // Construct final URL
        const url = `${environment.API_URL}/${resourceURL}/?${queryParams}`;
        return this.http.get<PaginatedResponse<T>>(url);
    }
}
