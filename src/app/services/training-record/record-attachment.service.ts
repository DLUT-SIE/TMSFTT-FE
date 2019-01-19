import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

import { environment } from '../../../environments/environment';

/** Export services for RecordAttachment. */
@Injectable({
  providedIn: 'root'
})
export class RecordAttachmentService {

  constructor(
    private readonly http: HttpClient,
  ) { }

  /** Create single attachment. */
  createRecordAttachment(recordID: number, file: File) {
    const formData = new FormData();
    formData.set('record', recordID.toString());
    formData.set('path', file, file.name);
    return this.http.post(environment.RECORD_ATTACHMENT_SERVICE_URL, formData);
  }

  /** Create multiple attachments. */
  createRecordAttachments(recordID: number, files: File[]) {
    return forkJoin(files.map((file: File) => this.createRecordAttachment(
      recordID, file)));
  }
}
