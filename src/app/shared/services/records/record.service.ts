import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timer, of as observableOf, Observable, zip } from 'rxjs';
import { tap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { Record } from 'src/app/shared/interfaces/record';
import { GenericListService } from 'src/app/shared/generics/generic-list-service/generic-list-service';
import { ListRequest } from 'src/app/shared/interfaces/list-request';
import { switchMap, catchError, map, takeWhile } from 'rxjs/operators';
import { RecordContent } from 'src/app/shared/interfaces/record-content';
import { RecordAttachment } from 'src/app/shared/interfaces/record-attachment';
import { RecordAttachmentService } from 'src/app/shared/services/records/record-attachment.service';
import { RecordContentService } from 'src/app/shared/services/records/record-content.service';
import { PaginatedResponse } from 'src/app/shared/interfaces/paginated-response';
import { AUTH_SERVICE, AuthService } from 'src/app/shared/interfaces/auth-service';
import { RoleChoice } from 'src/app/shared/interfaces/event-role-choices';

/** Provide services for Record. */
@Injectable({
  providedIn: 'root'
})
export class RecordService extends GenericListService {
  numberOfRecordsWithoutFeedback = 0;
  private cachedRoleChoices: RoleChoice[] = [];

  constructor(
    protected readonly http: HttpClient,
    private readonly recordAttachmentService: RecordAttachmentService,
    private readonly recordContentSerice: RecordContentService,
    @Inject(AUTH_SERVICE) private readonly authService: AuthService,
  ) {
    super(http);
    this.authService.authenticationSucceed.subscribe(() => {
      timer(0, environment.REFRESH_INTERVAL).pipe(
        takeWhile(() => this.authService.isAuthenticated),
        switchMap(() => this.getNumberOfRecordsWithoutFeedback()),
        catchError(() => observableOf({count: 0})),
      ).subscribe((cnt: {count: number}) => {
        this.numberOfRecordsWithoutFeedback = cnt.count;
      });
    });
  }

  private buildRecordFormData(req: Record) {
    const data = new FormData();
    data.set('off_campus_event', JSON.stringify(req.off_campus_event));
    data.set('user', req.user.toString());
    (req.attachments as File[]).map(x => data.append('attachments', x));
    (req.contents as RecordContent[]).map(x => data.append('contents', JSON.stringify(x)));
    data.set('role', req.role.toString());
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
          this.recordContentSerice.getRecordContents(data.contents as number[]),
          this.recordAttachmentService.getRecordAttachments(data.attachments as number[]),
        );
      }),
      map((val: [RecordContent[], RecordAttachment[]]) => {
        recordWithDetail.contents = val[0] as RecordContent[];
        recordWithDetail.attachments = val[1] as RecordAttachment[];
        return recordWithDetail;
      }),
    );
  }

  getRecords(url: string, req: ListRequest) {
    return this.list<PaginatedResponse<Record>>(url, req);
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

  updateRecordStatus(recordId: number, isApproved: boolean, isDepartmentAdmin: boolean) {
    if (isDepartmentAdmin) {
      return this.http.post(`/records/${recordId}/department-admin-review/`, {});
    }
    return this.http.post(`/records/${recordId}/school-admin-review/`, {});
  }

  closeRecord(recordId: number) {
    return this.http.post(`/records/${recordId}/close/`, {});
  }

  getRoleChoices() {
    if (this.cachedRoleChoices.length !== 0) {
      return observableOf(this.cachedRoleChoices);
    }
    return this.http.get<RoleChoice[]>(`/role-choices/`).pipe(
      tap(data => this.cachedRoleChoices = data),
    );
  }
}
