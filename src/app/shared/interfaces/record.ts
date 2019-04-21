import { RecordContent } from './record-content';

/** RESTful reponse interface for Record. */
export interface Record {
  id?: number;
  create_time?: string;
  update_time?: string;
  campus_event?: number;
  off_campus_event?: number;
  user?: number;
  status?: number;
  feedback?: number;
  attachments?: number[] | File[];
  contents?: number[] | RecordContent[];
}
