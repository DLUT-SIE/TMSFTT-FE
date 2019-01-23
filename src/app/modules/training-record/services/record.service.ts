import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, of as observableOf, Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { RecordContentService } from './record-content.service';
import { RecordAttachmentService } from './record-attachment.service';
import { RecordContentRequest, RecordRequest, RecordContent, RecordResponse, RecordAttachmentRequest, } from 'src/app/interfaces/record';
import { RecordStatus } from 'src/app/enums/record-status.enum';
import { OffCampusEventRequest, OffCampusEventResponse } from 'src/app/interfaces/event';
import { EventService } from 'src/app/modules/training-event/services/event.service';

/** Provide services for Record. */
@Injectable({
  providedIn: 'root'
})
export class RecordService {

  constructor(
    private readonly http: HttpClient,
    private readonly contentService: RecordContentService,
    private readonly attachmentService: RecordAttachmentService,
    private readonly eventService: EventService,
  ) { }

  /** Create a record of a campus event. */
  createCampusEventRecord(campusEventID: number, userID: number,
    contents: RecordContent[], attachments: File[]): Observable<RecordResponse> {
    const req: RecordRequest = {
      campus_event: campusEventID,
      user: userID,
    };
    return this.createRecord(req, contents, attachments);
  }

  /** Create a record of an off-campus event. */
  createOffCampusEventRecord(offCampusEvent: OffCampusEventRequest, userID: number,
    contents: RecordContent[], attachments: File[]): Observable<RecordResponse> {
    return this.eventService.createOffCampusEvent(offCampusEvent).pipe(
      catchError(() => {
        // OffCampusEvent creation failed.
        return observableOf(null);
      }),
      switchMap((event: OffCampusEventResponse | null) => {
        if (event === null) return observableOf(null);
        const req: RecordRequest = {
          off_campus_event: event.id,
          user: userID,
        };
        return this.createRecord(req, contents, attachments);
      }),
    );
  }

  /**
   * This function do the following steps:
   * - Step 1:
   *    Create the Record and set its status to PRESUMIT.
   * - Step 2(optional):
   *    Create the contents of the record.
   * - Step 3(optional):
   *    Upload the attachments of the record.
   * - Step 4:
   *    Set the status of the record to SUBMITTED.
   * - If no contents and attachments provided, the step 2 and 3 will be skipped,
   * and step 1 and 4 will be merged as one request.
   */
  private createRecord(req: RecordRequest, contents: RecordContent[],
    attachments: File[]): Observable<RecordResponse> {
    let creation$ = observableOf(null);
    let recordID = -1;
    if (contents.length === 0 && attachments.length === 0) {
      req.status = RecordStatus.STATUS_SUBMITTED,
        // If no additional contents or attachments, we create the Record and return.
        creation$ = creation$.pipe(
          switchMap(() => this.http.post<RecordResponse>(
            environment.RECORD_SERVICE_URL, req)),
        );
    } else {
      req.status = RecordStatus.STATUS_PRESUBMIT,
        // If there are additional contents or attachments, we should create the
        // Record with status as PRESUMIT. After we created other resources,
        // we update the status to SUBMITTED.
        creation$ = creation$.pipe(
          switchMap(() => this.http.post<RecordResponse>(
            environment.RECORD_SERVICE_URL, req)),
          switchMap((resp: RecordResponse) => {
            // After an record is retrieved, create contents and attachments
            // in parallel.
            recordID = resp.id;
            const contentsReqs = contents.map(originContent => {
              return {
                record: resp.id,
                content_type: originContent.content_type,
                content: originContent.content,
              } as RecordContentRequest;
            });
            const attachmentsReqs = attachments.map(attachment => {
              return {
                record: resp.id,
                path: attachment,
              } as RecordAttachmentRequest;
            });
            return forkJoin(
              this.contentService.createRecordContents(contentsReqs),
              this.attachmentService.createRecordAttachments(attachmentsReqs),
            ).pipe(map(() => resp));
          }),
          switchMap((resp: RecordResponse) => {
            // Update status of record to SUBMITTED.
            return this.http.patch<RecordResponse>(
              environment.RECORD_SERVICE_URL + resp.id + '/',
              {
                status: RecordStatus.STATUS_SUBMITTED,
              });
          }));
    }
    return creation$.pipe(
      // If we encountered any errors, do some cleanup.
      catchError(() => {
        let cleanup$ = observableOf(null);
        if (req.off_campus_event) {
          // Delete the off-campus event.
          cleanup$ = cleanup$.pipe(
            switchMap(() => this.eventService.deleteOffCampusEvent(
              req.off_campus_event)),
          );
        }
        if (recordID !== -1) {
          cleanup$ = cleanup$.pipe(
            switchMap(() => this.deleteRecord(recordID)),
          );
        }
        // Even though we may encounter other errors in catchError, we choose
        // to ignore and let server do the cleanup.
        return cleanup$.pipe(
          map(() => null),
          catchError(() => observableOf(null)),
        );
      }),
    );
  }

  /** Delete Record. */
  deleteRecord(recordID: number) {
    return this.http.delete(environment.RECORD_SERVICE_URL + recordID + '/');
  }
}
