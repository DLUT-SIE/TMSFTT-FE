/** RESTful response interface for Notification. */
export interface Notification {
  id?: number;
  time?: string;
  sender?: number;
  recipient?: number;
  content?: string;
  read_time?: string;
}
