import { Injectable, Inject } from '@angular/core';
import { timer, of as observableOf } from 'rxjs';
import { switchMap, map, catchError, takeWhile } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { NotificationResponse, PaginatedNotificationResponse } from 'src/app/interfaces/notification';
import { AUTH_SERVICE, AuthService } from 'src/app/interfaces/auth-service';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  /** Latest unread notifications. */
  unreadNotifications: NotificationResponse[] = [];
  /** Indicate whether unread notifications has been loaded. */
  unreadNotificationsLoaded = false;

  /** How many unread notifications should we display in toolbar. */
  private UNREAD_BOX_LIMIT = 10;
  /** How often should we query latest notifications. */
  private REFRESH_INTERVAL = 30 * 1000;

  constructor(
    private readonly http: HttpClient,
    @Inject(AUTH_SERVICE) private readonly authService: AuthService,
  ) {
    this.authService.authenticationSucceed.subscribe(() => {
      timer(0, this.REFRESH_INTERVAL).pipe(
        takeWhile(() => this.authService.isAuthenticated),
        switchMap(() => this.getNotifications(0, this.UNREAD_BOX_LIMIT, false)),
        map(res => {
          this.unreadNotifications = res.results;
          this.unreadNotificationsLoaded = true;
        }),
        catchError(() => {
          this.unreadNotificationsLoaded = true;
          return observableOf(null);
        }),
      ).subscribe();
    });
  }

  getNotification(id: number) {
    return this.http.get<NotificationResponse>(
      `${environment.API_URL}/notifications/${id}/`);
  }

  getNotifications(offset?: number, limit?: number,
    readStatus?: boolean) {
    if (offset === undefined) offset = 0;
    if (limit === undefined) limit = environment.PAGINATION_SIZE;
    const paramsObj = { offset, limit };
    const queryParams = Object.keys(paramsObj).map(
      key => key + '=' + encodeURIComponent(paramsObj[key])).join('&');
    let url = environment.API_URL + '/notifications/';
    if (readStatus !== undefined) {
      url += readStatus ? 'read/' : 'unread/';
    }
    url += '?' + queryParams;
    return this.http.get<PaginatedNotificationResponse>(url);
  }
}
