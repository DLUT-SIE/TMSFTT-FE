import { RecordContent } from './record-content';
import { RecordAttachment } from './record-attachment';
import { OffCampusEvent, CampusEvent } from './event';

/** RESTful reponse interface for Record. */
export interface Record {
  id?: number;
  create_time?: string;
  update_time?: string;
  campus_event?: CampusEvent;
  off_campus_event?: OffCampusEvent;
  user?: number;
  status?: number;
  status_str?: string;
  feedback?: number;
  attachments?: number[] | File[] | RecordAttachment[];
  contents?: number[] | RecordContent[];
  role?: number;
  role_str?: string;
  allow_actions_from_user?: boolean;
  allow_actions_from_admin?: boolean;
}
