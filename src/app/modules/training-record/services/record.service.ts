import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { RecordRequest, RecordResponse, } from 'src/app/interfaces/record';
import { GenericListService } from 'src/app/generics/generic-list-service/generic-list-service';
import { ListRequest } from 'src/app/interfaces/list-request';

/** Provide services for Record. */
@Injectable({
  providedIn: 'root'
})
export class RecordService extends GenericListService {

  constructor(
    protected readonly http: HttpClient,
  ) {
    super(http);
  }

  /** Create TrainingRecord along with its contents and attachments. */
  createOffCampusRecord(req: RecordRequest) {
    const data = new FormData();
    data.set('off_campus_event_data', JSON.stringify(req.off_campus_event));
    data.set('user', req.user.toString());
    req.attachments.map(x => data.append('attachments_data', x));
    req.contents.map(x => data.append('contents_data', JSON.stringify(x)));

    return this.http.post<RecordResponse>(
      `${environment.API_URL}/records/`, data);
  }

  deleteRecord(recordID: number) {
    return this.http.delete(`${environment.API_URL}/records/${recordID}/`);
  }

  getRecord(id: number) {
    return this.http.get<RecordResponse>(
      `${environment.API_URL}/records/${id}/`);
  }

  getRecords(req: ListRequest) {
    return this.list<RecordResponse>('records', req);
  }

  getReviewedRecords(req: ListRequest) {
    return this.list<RecordResponse>('records/reviewed', req);
  }
}
