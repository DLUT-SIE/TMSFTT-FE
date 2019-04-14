import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timer, of as observableOf } from 'rxjs';

import { environment } from 'src/environments/environment';
import { RecordRequest, RecordResponse, } from 'src/app/shared/interfaces/record';
import { GenericListService } from 'src/app/shared/generics/generic-list-service/generic-list-service';
import { ListRequest } from 'src/app/shared/interfaces/list-request';
import { switchMap, catchError } from 'rxjs/operators';

/** Provide services for Record. */
@Injectable({
  providedIn: 'root'
})
export class RecordService extends GenericListService {
  numberOfRecordsWithoutFeedback = 0;

  constructor(
    protected readonly http: HttpClient,
  ) {
    super(http);
    timer(0, environment.REFRESH_INTERVAL).pipe(
      switchMap(() => this.getNumberOfRecordsWithoutFeedback()),
      catchError(() => observableOf(0)),
    ).subscribe(cnt => {
      this.numberOfRecordsWithoutFeedback = cnt;
    });
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

  getNumberOfRecordsWithoutFeedback() {
    return observableOf(10);
  }

  batchSubmitRecord(file: File) {
    const data = new FormData();
    data.set('file', file);
    return this.http.post<{'count': number}>(`${environment.API_URL}/records/actions/batch-submit/`, data);
  }

  createFeedback(recordID: number, feedbackData: string) {
    const data = new FormData();
    data.set('record', recordID.toString());
    data.set('feedback', feedbackData);
    return this.http.post(`${environment.API_URL}/campus-event-feedbacks/`, data);
  }
}
