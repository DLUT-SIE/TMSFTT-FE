import { PaginatedResponse } from './paginated-response';

/** RESTful response interface for Notification. */
export interface NotificationResponse {
  id: number;
  time: string;
  sender: string;
  recipient: string;
  content: string;
  read_time: string;
}

/** RESTful paginated response interface for Notification. */
export interface PaginatedNotificationResponse extends PaginatedResponse {
  results: NotificationResponse[];
}
