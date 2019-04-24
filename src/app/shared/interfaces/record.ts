import { RecordContent } from './record-content';
import { OffCampusEvent, CampusEvent } from './event';

/** RESTful reponse interface for Record. */
export interface Record {
  id?: number;
  create_time?: string;
  update_time?: string;
  campus_event?: number | CampusEvent;
  off_campus_event?: number | OffCampusEvent;
  user?: number;
  status?: number;
  feedback?: number;
  attachments?: number[] | File[];
  contents?: number[] | RecordContent[];
}
