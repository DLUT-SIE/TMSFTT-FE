import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of as observableOf } from 'rxjs';

import { RecordAttachment } from 'src/app/shared/interfaces/record-attachment';
import { GenericListService } from '../../generics/generic-list-service/generic-list-service';

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
    if (ids.length === 0) return observableOf([]);
    const extraParams = new Map<string, string>();
    extraParams.set('id__in', ids.toString());
    const limit = -1;

    return this.list<RecordAttachment[]>('record-attachments', {limit, extraParams});
  }

  deleteRecordAttachment(id: number) {
    return this.http.delete(`/record-attachments/${id}/`);
  }
}
