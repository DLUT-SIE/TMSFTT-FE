import { RecordStatus } from '../enums/record-status.enum';
import { ContentType } from '../enums/content-type.enum';
import { AttachmentType } from '../enums/attachment-type.enum';
import { OffCampusEventRequest, CampusEventResponse, OffCampusEventResponse } from './event';

/** RESTful request interface for Record. */
export interface RecordRequest {
  off_campus_event: OffCampusEventRequest;
  user: number;
  contents: RecordContent[];
  attachments: File[];
}

/** RESTful reponse interface for Record. */
export interface RecordResponse {
  id: number;
  create_time: string;
  update_time: string;
  campus_event: CampusEventResponse | null;
  off_campus_event: OffCampusEventResponse | null;
  attachments: RecordAttachmentResponse[];
  contents: RecordContentResponse[];
  user: number;
  status: RecordStatus;
}

/** Interface for RecordContent. */
export interface RecordContent {
  /** The type of this content. */
  content_type: ContentType;
  /** The value of thie content. */
  content: string;
}

/** RESTful request interface for RecordContent. */
export interface RecordContentRequest extends RecordContent {
  record: number;
}

/** RESTful response interface for RecordContent. */
export interface RecordContentResponse extends RecordContent {
  id: number;
  record: number;
  create_time: string;
  update_time: string;
}

/** RESTful request interface for RecordAttachment. */
export interface RecordAttachmentRequest {
  record: number;
  attachment_type?: AttachmentType;
  path: File;
}

/** RESTful response interface for RecordAttachment. */
export interface RecordAttachmentResponse {
  id: number;
  create_time: string;
  update_time: string;
  record: number;
  attachment_type: AttachmentType;
  path: string;
}
