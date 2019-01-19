import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, of as observableOf, Observable } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { CampusEvent, OffCampusEvent, EventService } from '../training-event/event.service';
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
  campus_event: CampusEvent | number | null;
  /**
   * The off-campus event this record related to, null if this record is related
   * to a campus event.
   */
  off_campus_event: OffCampusEvent | number | null;
  /** The user that this record is related to. */
  user?: string | number;
  /** The status code of this record. */
  status: number;
  /** The contents of this record. */
  contents?: RecordContent[];
  /** The attachment urls related to this record. */
  attachments?: string[];
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
  createRecord(record: Record, contents: RecordContent[],
    attachments: File[]): Observable<Record | null> {
    let recordID = -1;
    let offCampusEventID = -1;
    let creation$ = observableOf(null);
    const offCampusEvent = record.off_campus_event;
    // If we are dealing with OffCampusEvent, we should create it first.
    if (offCampusEvent !== null) {
      creation$ = creation$.pipe(
        switchMap(() => {
          return this.eventService.createOffCampusEvent(
            offCampusEvent as OffCampusEvent);
        }),
        // And set field off_campus_event of record.
        tap((event: OffCampusEvent) => {
          offCampusEventID = event.id;
          record.off_campus_event = event.id;
        }),
      );
    }
    if (contents.length === 0 && attachments.length === 0) {
      // If no additional contents or attachments, we create the Record and return.
      record.status = RecordStatus.STATUS_SUBMITTED;
      creation$ = creation$.pipe(
        switchMap(() => this.http.post(environment.RECORD_SERVICE_URL, record)),
      );
    } else {
      // If there are additional contents or attachments, we should create the
      // Record with status as PRESUMIT. After we created other resources,
      // we update the status to SUBMITTED.
      creation$ = creation$.pipe(
        switchMap(() => this.http.post(environment.RECORD_SERVICE_URL, record)),
        switchMap((_record: Record) => {
          // After an record is retrieved, create contents and attachments
          // in parallel.
          recordID = _record.id;
          return forkJoin(
            this.contentService.createRecordContents(recordID, contents),
            this.attachmentService.createRecordAttachments(recordID, attachments),
          ).pipe(map(() => _record));
        }),
        switchMap((_record: Record) => {
          // Update status of record to SUBMITTED.
          return this.http.patch(environment.RECORD_SERVICE_URL + recordID + '/', {
            status: RecordStatus.STATUS_SUBMITTED,
          });
        }));
    }
    return creation$.pipe(
      // If we encountered any errors, do some cleanup.
      catchError(() => {
        let cleanup$ = observableOf(null);
        if (offCampusEventID !== -1) {
          // Delete the event.
          cleanup$ = cleanup$.pipe(
            switchMap(() => this.eventService.deleteOffCampusEvent(offCampusEventID)),
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
