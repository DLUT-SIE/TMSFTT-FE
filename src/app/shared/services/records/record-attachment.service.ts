import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { zip, of as observableOf, Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { RecordAttachment } from 'src/app/shared/interfaces/record-attachment';

/** Export services for RecordAttachment. */
@Injectable({
  providedIn: 'root'
})
export class RecordAttachmentService {

  constructor(
    private readonly http: HttpClient,
  ) { }

  /** Create single attachment. */
  createRecordAttachment(req: RecordAttachment) {
    const data = new FormData();
    data.set('record', req.record.toString());
    data.set('path', req.path as File, (req.path as File).name);
    return this.http.post<RecordAttachment>(
      `${environment.API_URL}/record-attachments/`, data);
  }

  /** Create multiple attachments. */
  createRecordAttachments(reqs: RecordAttachment[]) {
    if (reqs.length === 0) return observableOf([]);
    return zip(...reqs.map(req => this.createRecordAttachment(req)));
  }

  /** Get single attachment. */
  getRecordAttachment(id: number) {
    return this.http.get<RecordAttachment>(
      `${environment.API_URL}/record-attachments/${id}/`
    );
  }

  /** Get multiple attachments. */
  getRecordAttachments(ids: number[]): Observable<RecordAttachment[]> {
    if (ids.length === 0) return observableOf([]);
    return zip(...ids.map(id => this.getRecordAttachment(id)));
  }

  deleteRecordAttachment(id: number) {
    return this.http.delete(`${environment.API_URL}/record-attachments/${id}/`);
  }
}
