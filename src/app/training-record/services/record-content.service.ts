import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { zip, of as observableOf } from 'rxjs';

import { environment } from 'src/environments/environment';
import { RecordContent } from 'src/app/shared/interfaces/record-content';

/** Provide services for RecordContent. */
@Injectable({
  providedIn: 'root'
})
export class RecordContentService {

  constructor(
    private readonly http: HttpClient,
  ) { }

  /** Create single content. */
  createRecordContent(req: RecordContent) {
    return this.http.post<RecordContent>(
      `${environment.API_URL}/record-contents/`, req);
  }

  /** Create multiple contents. */
  createRecordContents(reqs: RecordContent[]) {
    if (reqs.length === 0) return observableOf([]);
    return zip(...reqs.map(req => this.createRecordContent(req)));
  }
}
