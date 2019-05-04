import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of as observableOf } from 'rxjs';

import { environment } from 'src/environments/environment';
import { RecordContent } from 'src/app/shared/interfaces/record-content';
import { PaginatedResponse } from '../../interfaces/paginated-response';

/** Provide services for RecordContent. */
@Injectable({
  providedIn: 'root'
})
export class RecordContentService {

  constructor(
    private readonly http: HttpClient,
  ) { }

  /** Get single content. */
  getRecordContent(id: number) {
    return this.http.get<RecordContent>(
      `${environment.API_URL}/record-contents/${id}/`
    );
  }

  /** Get multiple contents. */
  getRecordContents(ids: number[]) {
    if (ids.length === 0) return observableOf({count: 0, next: '', previous: '', results: []});

    const queryParams = 'id__in=' + encodeURIComponent(ids.toString());

    return this.http.get<PaginatedResponse<RecordContent>>(
      `${environment.API_URL}/record-contents/?${queryParams}`);
  }
}
