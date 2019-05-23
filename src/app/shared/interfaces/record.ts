import { RecordContent } from './record-content';
import { RecordAttachment } from './record-attachment';
import { OffCampusEvent, CampusEvent } from './event';
import { PaginatedResponse } from './paginated-response';

/** RESTful reponse interface for Record. */
export interface Record {
  id?: number;
  create_time?: string;
  update_time?: string;
  campus_event?: CampusEvent;
  off_campus_event?: OffCampusEvent;
  user?: number;
  status?: number;
  feedback?: number;
  attachments?: number[] | File[] | RecordAttachment[] | PaginatedResponse<RecordAttachment>;
  contents?: number[] | RecordContent[] | PaginatedResponse<RecordContent>;
  role: number;
  role_str?: string;
  allow_ordinary_user_review?: boolean;
  allow_department_admin_review?: boolean;
  allow_school_admin_review?: boolean;
}
