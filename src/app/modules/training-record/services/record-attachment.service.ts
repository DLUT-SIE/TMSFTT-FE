import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { zip, of as observableOf } from 'rxjs';

import { environment } from 'src/environments/environment';
import { RecordAttachmentResponse, RecordAttachmentRequest } from 'src/app/interfaces/record';

/** Export services for RecordAttachment. */
@Injectable({
  providedIn: 'root'
})
export class RecordAttachmentService {

  constructor(
    private readonly http: HttpClient,
  ) { }

  /** Create single attachment. */
  createRecordAttachment(req: RecordAttachmentRequest) {
    const data = new FormData();
    data.set('record', req.record.toString());
    data.set('path', req.path, req.path.name);
    return this.http.post<RecordAttachmentResponse>(
      `${environment.API_URL}/record-attachments/`, data);
  }

  /** Create multiple attachments. */
  createRecordAttachments(reqs: RecordAttachmentRequest[]) {
    if (reqs.length === 0) return observableOf([]);
    return zip(...reqs.map(req => this.createRecordAttachment(req)));
  }
}
