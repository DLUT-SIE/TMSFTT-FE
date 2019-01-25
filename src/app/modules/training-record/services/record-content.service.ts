import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

import { environment } from 'src/environments/environment';
import { RecordContentRequest, RecordContentResponse } from 'src/app/interfaces/record';

/** Provide services for RecordContent. */
@Injectable({
  providedIn: 'root'
})
export class RecordContentService {

  constructor(
    private readonly http: HttpClient,
  ) { }

  /** Create single content. */
  createRecordContent(req: RecordContentRequest) {
    return this.http.post<RecordContentResponse>(
      `${environment.API_URL}/record-contents/`, req);
  }

  /** Create multiple contents. */
  createRecordContents(reqs: RecordContentRequest[]) {
    return forkJoin(reqs.map(req => this.createRecordContent(req)));
  }
}
