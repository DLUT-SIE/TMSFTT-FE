import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of as observableOf } from 'rxjs';

import { RecordAttachment } from 'src/app/shared/interfaces/record-attachment';
import { PaginatedResponse } from '../../interfaces/paginated-response';

/** Export services for RecordAttachment. */
@Injectable({
  providedIn: 'root'
})
export class RecordAttachmentService {

  constructor(
    private readonly http: HttpClient,
  ) { }

  /** Get single attachment. */
  getRecordAttachment(id: number) {
    return this.http.get<RecordAttachment>(
      `/record-attachments/${id}/`
    );
  }

  /** Get multiple attachments. */
  getRecordAttachments(ids: number[]) {
    if (ids.length === 0) return observableOf({count: 0, next: '', previous: '', results: []});

    const queryParams = 'id__in=' + encodeURIComponent(ids.toString());

    return this.http.get<PaginatedResponse<RecordAttachment>>(
      `/record-attachments/?${queryParams}`);
  }

  deleteRecordAttachment(id: number) {
    return this.http.delete(`/record-attachments/${id}/`);
  }
}
