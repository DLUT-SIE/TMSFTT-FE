import { PaginatedResponse } from './paginated-response';

/** RESTful response interface for Notification. */
export interface NotificationResponse {
  time: string;
  sender: string;
  recipient: string;
  content: string;
}

/** RESTful paginated response interface for Notification. */
export interface PaginatedNotificationResponse extends PaginatedResponse {
  results: NotificationResponse[];
}
