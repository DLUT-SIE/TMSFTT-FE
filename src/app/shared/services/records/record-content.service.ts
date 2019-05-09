import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of as observableOf } from 'rxjs';

import { RecordContent } from 'src/app/shared/interfaces/record-content';
import { GenericListService } from '../../generics/generic-list-service/generic-list-service';
import { PaginatedResponse } from '../../interfaces/paginated-response';

/** Provide services for RecordContent. */
@Injectable({
  providedIn: 'root'
})
export class RecordContentService extends GenericListService {

  constructor(
    protected readonly http: HttpClient,
  ) {
    super(http);
  }

  /** Get single content. */
  getRecordContent(id: number) {
    return this.http.get<RecordContent>(
      `/record-contents/${id}/`
    );
  }

  /** Get multiple contents. */
  getRecordContents(ids: number[]) {
    if (ids.length === 0) return observableOf({count: 0, next: '', previous: '', results: []});

    const extraParams = new Map<string, string>();
    extraParams.set('id__in', ids.toString());

    return this.list<PaginatedResponse<RecordContent>>('record-contents', {extraParams});
  }
}
