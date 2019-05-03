import { AttachmentType } from '../enums/attachment-type.enum';

/** RESTful request interface for RecordAttachment. */
export interface RecordAttachment {
  id?: number;
  create_time?: string;
  update_time?: string;
  record?: number;
  attachment_type?: AttachmentType;
  path?: File | SecuredPath;
}

export interface SecuredPath {
  name: string;
  url: string;
}

