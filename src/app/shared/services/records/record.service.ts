import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timer, of as observableOf, Observable, zip } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Record } from 'src/app/shared/interfaces/record';
import { GenericListService } from 'src/app/shared/generics/generic-list-service/generic-list-service';
import { ListRequest } from 'src/app/shared/interfaces/list-request';
import { switchMap, catchError, map } from 'rxjs/operators';
import { RecordContent } from 'src/app/shared/interfaces/record-content';
import { RecordAttachment } from 'src/app/shared/interfaces/record-attachment';
import { RecordAttachmentService } from 'src/app/shared/services/records/record-attachment.service';
import { RecordContentService } from 'src/app/shared/services/records/record-content.service';
import { EventService } from '../events/event.service';
import { OffCampusEvent, CampusEvent } from '../../interfaces/event';
import { PaginatedResponse } from 'src/app/shared/interfaces/paginated-response';

/** Provide services for Record. */
@Injectable({
  providedIn: 'root'
})
export class RecordService extends GenericListService {
  numberOfRecordsWithoutFeedback = 0;

  constructor(
    protected readonly http: HttpClient,
    private readonly recordAttachmentService: RecordAttachmentService,
    private readonly recordContentSerice: RecordContentService,
    private readonly eventService: EventService,
  ) {
    super(http);
    timer(0, environment.REFRESH_INTERVAL).pipe(
      switchMap(() => this.getNumberOfRecordsWithoutFeedback()),
      catchError(() => observableOf({count: 0})),
    ).subscribe((cnt: {count: number}) => {
      this.numberOfRecordsWithoutFeedback = cnt.count;
    });
  }

  private buildRecordFormData(req: Record) {
    const data = new FormData();
    data.set('off_campus_event', JSON.stringify(req.off_campus_event));
    data.set('user', req.user.toString());
    (req.attachments as File[]).map(x => data.append('attachments', x));
    (req.contents as RecordContent[]).map(x => data.append('contents', JSON.stringify(x)));
    return data;
  }
  /** Create Records along with its contents and attachments. */
  createOffCampusRecord(req: Record) {
    const data = this.buildRecordFormData(req);
    return this.http.post<Record>(
      `/records/`, data);
  }

  updateOffCampusRecord(req: Record) {
    const data = this.buildRecordFormData(req);
    return this.http.patch<Record>(
      `/records/${req.id}/`, data);
  }

  deleteRecord(recordID: number) {
    return this.http.delete(`/records/${recordID}/`);
  }

  getRecord(id: number) {
    return this.http.get<Record>(
      `/records/${id}/`);
  }

  getRecordWithDetail(id: number) {
    return this.getDetaiOfRecord(this.getRecord(id));
  }
    /** Get the data of event,contents,attachments in record. */
  private getDetaiOfRecord(record: Observable<Record>) {
    let recordWithDetail: Record;
    return record.pipe(
      switchMap((data) => {
        recordWithDetail = data;
        return zip(
          recordWithDetail.off_campus_event ?
          this.eventService.getOffCampusEvent(data.off_campus_event as number) :
          this.eventService.getEvent(data.campus_event as number),
          this.recordContentSerice.getRecordContents(data.contents as number[]),
          this.recordAttachmentService.getRecordAttachments(data.attachments as number[]),
        );
      }),
      map((val: [OffCampusEvent | CampusEvent, PaginatedResponse<RecordContent>, PaginatedResponse<RecordAttachment>]) => {
        if (recordWithDetail.off_campus_event) {
          recordWithDetail.off_campus_event = val[0] as OffCampusEvent;
        } else {
          recordWithDetail.campus_event = val[0] as CampusEvent;
        }
        recordWithDetail.contents = val[1].results as RecordContent[];
        recordWithDetail.attachments = val[2].results as RecordAttachment[];
        return recordWithDetail;
      }),
    );
  }

  getRecords(req: ListRequest) {
    return this.list<Record>('records', req);
  }

  getRecordsWithDetail(req: ListRequest) {
    return this.getDetailOfRecords(this.getRecords(req));
  }

  getReviewedRecords(req: ListRequest) {
    return this.list<Record>('records/reviewed', req);
  }

  getReviewedRecordsWithDetail(req: ListRequest) {
    return this.getDetailOfRecords(this.getReviewedRecords(req));
  }

  private getDetailOfRecords(records: Observable<PaginatedResponse<Record>>): Observable<PaginatedResponse<Record>> {
    let paginatedRecords: PaginatedResponse<Record>;
    return records.pipe(
      switchMap((data) => {
        paginatedRecords = data;
        return zip(...paginatedRecords.results.map(record => {
          return record.off_campus_event ?
          this.eventService.getOffCampusEvent(record.off_campus_event as number) :
          this.eventService.getEvent(record.campus_event as number);
        }
        ));
      }),
      map((val: Array<CampusEvent | OffCampusEvent>) => {
        for (let index = 0; index < val.length; index++) {
          if (paginatedRecords.results[index].off_campus_event) {
            paginatedRecords.results[index].off_campus_event = val[index] as OffCampusEvent;
          } else {
            paginatedRecords.results[index].campus_event = val[index] as CampusEvent;
          }
        }
        return paginatedRecords;
      }),
    );
  }

  getNumberOfRecordsWithoutFeedback() {
    return this.http.get<{'count': number}>(`/records/no-feedback-records-count/`);
  }

  batchSubmitRecord(file: File) {
    const data = new FormData();
    data.set('file', file);
    return this.http.post<{'count': number}>(`/records/batch-submit/`, data);
  }

  createFeedback(recordID: number, feedbackData: string) {
    const data = new FormData();
    data.set('record', recordID.toString());
    data.set('content', feedbackData);
    return this.http.post(`/campus-event-feedbacks/`, data);
  }

  updateRecordStatus(record: Record, isApproved: boolean, isDepartmentAdmin: boolean, isSchoolAdmin: boolean) {
    const data = {
      id: record.id,
      user: record.user,
      contents: [],
      attachments: [],
      feedback: null,
      is_approved: isApproved
    };
    if ((isDepartmentAdmin) && (!isSchoolAdmin)) {
      return this.http.post(`${environment.API_URL}/records/${record.id}/department-admin-review/`, data);
    }
    if (isSchoolAdmin) {
      return this.http.post(`${environment.API_URL}/records/${record.id}/school-admin-review/`, data);
    }
  }
}
