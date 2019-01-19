import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

import { environment } from '../../../environments/environment';

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

/** Provide services for RecordContent. */
@Injectable({
  providedIn: 'root'
})
export class RecordContentService {

  constructor(
    private readonly http: HttpClient,
  ) { }

  /** Create single content. */
  createRecordContent(recordID: number, content: RecordContent) {
    content.record = recordID;
    return this.http.post(environment.RECORD_CONTENT_SERVICE_URL, content);
  }

  /** Create multiple contents. */
  createRecordContents(recordID: number, contents: RecordContent[]) {
    return forkJoin(contents.map((content: RecordContent) => this.createRecordContent(
      recordID, content)));
  }
}
