import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, of as observableOf, Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { OffCampusEvent, EventService } from '../training-event/event.service';
import { RecordContent, RecordContentService } from './record-content.service';
import { RecordAttachmentService } from './record-attachment.service';

/** This enum is from server. */
export enum RecordStatus {
  STATUS_PRESUBMIT = 0,
  STATUS_SUBMITTED = 1,
  STATUS_FACULTY_ADMIN_REVIEWED = 2,
  STATUS_SCHOOL_ADMIN_REVIEWED = 3,
}

/** This interface is a mapping to the definition of Record on server. */
export interface Record {
  /** The ID of the record */
  id?: number;
  /**
   * The campus event this record related to, null if this record is related
   * to an off-campus event.
   */
  campus_event?: number;
  /**
   * The off-campus event this record related to, null if this record is related
   * to a campus event.
   */
  off_campus_event?: number;
  /** The user that this record is related to. */
  user?: number;
  /** The status code of this record. */
  status?: RecordStatus;
}

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
    contents: RecordContent[], attachments: File[]) {
     return this.createRecord({ campus_event: campusEventID }, userID, contents, attachments);
   }

  /** Create a record of an off-campus event. */
  createOffCampusEventRecord(offCampusEvent: OffCampusEvent, userID: number,
    contents: RecordContent[], attachments: File[]) {
    return this.eventService.createOffCampusEvent(offCampusEvent).pipe(
      catchError(() => {
        // OffCampusEvent creation failed.
        return observableOf(null);
      }),
      switchMap((event: OffCampusEvent|null) => {
        if (event === null) return observableOf(null);
        return this.createRecord(
          { off_campus_event: event.id }, userID, contents, attachments);
      }),
      );
  }

  /**
   * This function do the following steps:
   * - Step 0(optional):
   *    If this record is related to an OffCampusEvent, create the event first.
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
  private createRecord(record: Record, userID: number, contents: RecordContent[],
    attachments: File[]): Observable<Record | null> {
    let creation$ = observableOf(null);
    record.user = userID;
    if (contents.length === 0 && attachments.length === 0) {
      record.status = RecordStatus.STATUS_SUBMITTED,
        // If no additional contents or attachments, we create the Record and return.
        creation$ = creation$.pipe(
          switchMap(() => this.http.post(environment.RECORD_SERVICE_URL, record)),
        );
    } else {
      record.status = RecordStatus.STATUS_PRESUBMIT,
        // If there are additional contents or attachments, we should create the
        // Record with status as PRESUMIT. After we created other resources,
        // we update the status to SUBMITTED.
        creation$ = creation$.pipe(
          switchMap(() => this.http.post(environment.RECORD_SERVICE_URL, record)),
          switchMap((_record: Record) => {
            // After an record is retrieved, create contents and attachments
            // in parallel.
            record.id = _record.id;
            return forkJoin(
              this.contentService.createRecordContents(_record.id, contents),
              this.attachmentService.createRecordAttachments(_record.id, attachments),
            ).pipe(map(() => _record));
          }),
          switchMap((_record: Record) => {
            // Update status of record to SUBMITTED.
            return this.http.patch(environment.RECORD_SERVICE_URL + _record.id + '/', {
              status: RecordStatus.STATUS_SUBMITTED,
            });
          }));
    }
    return creation$.pipe(
      // If we encountered any errors, do some cleanup.
      catchError(() => {
        let cleanup$ = observableOf(null);
        if (record.off_campus_event) {
          // Delete the off-campus event.
          cleanup$ = cleanup$.pipe(
            switchMap(() => this.eventService.deleteOffCampusEvent(
              record.off_campus_event)),
          );
        }
        if (record.id) {
          cleanup$ = cleanup$.pipe(
            switchMap(() => this.deleteRecord(record.id)),
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
