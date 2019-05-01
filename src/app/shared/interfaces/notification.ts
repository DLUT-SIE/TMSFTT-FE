/** RESTful response interface for Notification. */
export interface Notification {
  id?: number;
  time?: string;
  sender?: string;
  recipient?: string;
  content?: string;
  read_time?: string;
}
