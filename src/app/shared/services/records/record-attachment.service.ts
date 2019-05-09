import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of as observableOf } from 'rxjs';

import { RecordAttachment } from 'src/app/shared/interfaces/record-attachment';
import { GenericListService } from '../../generics/generic-list-service/generic-list-service';
import { PaginatedResponse } from '../../interfaces/paginated-response';

/** Export services for RecordAttachment. */
@Injectable({
  providedIn: 'root'
})
export class RecordAttachmentService extends GenericListService {

  constructor(
    protected readonly http: HttpClient,
  ) {
    super(http);
  }

  /** Get single attachment. */
  getRecordAttachment(id: number) {
    return this.http.get<RecordAttachment>(
      `/record-attachments/${id}/`
    );
  }

  /** Get multiple attachments. */
  getRecordAttachments(ids: number[]) {
    if (ids.length === 0) return observableOf({count: 0, next: '', previous: '', results: []});
    const extraParams = new Map<string, string>();
    extraParams.set('id__in', ids.toString());

    return this.list<PaginatedResponse<RecordAttachment>>('record-attachments', {extraParams});
  }

  deleteRecordAttachment(id: number) {
    return this.http.delete(`/record-attachments/${id}/`);
  }
}
