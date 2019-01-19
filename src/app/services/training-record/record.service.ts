import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CampusEvent, OffCampusEvent } from '../training-event/event.service';
import { environment } from 'src/environments/environment';
import { catchError, map, switchMap, mergeMap } from 'rxjs/operators';
import { forkJoin, of as observableOf, Observable } from 'rxjs';

/** This enum is from server. */
export enum ContentType {
  CONTENT_TYPE_CONTENT = 0,
  CONTENT_TYPE_SUMMARY = 1,
  CONTENT_TYPE_FEEDBACK = 2,
}

/** This interface is a mapping to the definition of RecordContent on server. */
export interface RecordContent {
  record?: number;
  /** The type of this content. */
  content_type: ContentType;
  /** The value of thie content. */
  content: string;
}

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
  campus_event: CampusEvent | null;
  /**
   * The off-campus event this record related to, null if this record is related
   * to a campus event.
   */
  off_campus_event: OffCampusEvent | null;
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
  ) { }

  private createContents(recordID: number, contents: RecordContent[]) {
    // If no contents, skip this step.
    contents = contents.map((val) => {
      val.record = recordID;
      return val;
    });
    if (contents.length === 0) return observableOf(recordID);
    return this.http.post(environment.RECORD_CONTENT_SERVICE_URL,
      contents).pipe(map(() => recordID));
  }

  private createAttachments(recordID: number, attachments: File[]) {
    // If not attachments, skip this step.
    if (attachments.length === 0) return observableOf(recordID);
    return observableOf(attachments).pipe(
      mergeMap((_attachments: File[]) => forkJoin(
        attachments.map((attachment: File) => {
        const formData = new FormData();
        formData.set('record', recordID.toString());
        formData.set('path', attachment, attachment.name);
        return this.http.post(environment.RECORD_ATTACHMENT_SERVICE_URL, formData);
      }))),
      map(() => recordID));
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
  createRecord(record: Record, contents: RecordContent[],
    attachments: File[]): Observable<number | null> {
    let recordID = -1;
    if (contents.length === 0 && attachments.length === 0) {
      record.status = RecordStatus.STATUS_SUBMITTED;
      return this.http.post(environment.RECORD_SERVICE_URL, record).pipe(
        map((_record: Record) => _record.id),
        catchError(() => observableOf(null)),
      );
    }
    // Create record instance.
    return this.http.post(environment.RECORD_SERVICE_URL, record).pipe(
      switchMap((_record: Record) => {
        // After an record is retrieved, create contents and attachments
        // in parallel.
        recordID = _record.id;
        return forkJoin(
          this.createContents(recordID, contents),
          this.createAttachments(recordID, attachments),
        ).pipe(map(() => null));
      }),
      switchMap(() => {
        // Update status of record to SUBMITTED.
        return this.http.patch(environment.RECORD_SERVICE_URL + recordID + '/', {
          status: RecordStatus.STATUS_SUBMITTED,
        }).pipe(map(() => recordID));
      }),
      // If we encountered any errors, delete record if exists.
      catchError(() => {
        if (recordID === -1) return observableOf(null);
        return this.http.delete(environment.RECORD_SERVICE_URL + recordID + '/').pipe(
          map(() => null),
          catchError(() => observableOf(null)),
          );
      }),
    );
  }
}
