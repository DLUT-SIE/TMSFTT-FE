import { Injectable } from '@angular/core';
import { timer, of as observableOf } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { NotificationResponse, PaginatedNotificationResponse } from 'src/app/interfaces/notification';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  /** Latest unread notifications. */
  unreadNotifications: NotificationResponse[] = [];
  /** Indicate whether unread notifications has been loaded. */
  unreadNotificationsLoaded = false;

  private LIMIT = 20;
  /** How often should we query latest notifications. */
  private REFRESH_INTERVAL = 30 * 1000;


  constructor(
    private readonly http: HttpClient,
  ) {
    timer(0, this.REFRESH_INTERVAL).pipe(
      switchMap(() => this.getNotifications(0, this.LIMIT, false)),
      map(res => {
        this.unreadNotifications = res.results;
        this.unreadNotificationsLoaded = true;
      }),
      catchError(() => {
        this.unreadNotificationsLoaded = true;
        return observableOf(null);
      }),
    ).subscribe();
  }

  getNotifications(offset?: number, limit?: number,
                   readStatus?: boolean) {
    if (offset === undefined) offset = 0;
    if (limit === undefined) limit = this.LIMIT;
    const paramsObj = { offset, limit };
    const queryParams = Object.keys(paramsObj).map(
      key => key + '=' + encodeURIComponent(paramsObj[key])).join('&');
    let url = environment.NOTIFICATION_SERVICE_URL;
    if (readStatus !== undefined) {
      url += readStatus ? 'read-notifications/' : 'unread-notifications/';
    }
    url += '?' + queryParams;
    return this.http.get<PaginatedNotificationResponse>(url);
  }
}
