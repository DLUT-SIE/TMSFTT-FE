import { Injectable, Inject } from '@angular/core';
import { timer, of as observableOf } from 'rxjs';
import { switchMap, map, catchError, takeWhile } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { NotificationResponse } from 'src/app/interfaces/notification';
import { AUTH_SERVICE, AuthService } from 'src/app/interfaces/auth-service';
import { GenericListService } from 'src/app/generics/generic-list-service/generic-list-service';
import { ListRequest } from 'src/app/interfaces/list-request';


@Injectable({
  providedIn: 'root'
})
export class NotificationService extends GenericListService {
  /** Latest unread notifications. */
  unreadNotifications: NotificationResponse[] = [];
  /** Indicate whether unread notifications has been loaded. */
  unreadNotificationsLoaded = false;

  /** How many unread notifications should we display in toolbar. */
  private UNREAD_BOX_LIMIT = 10;
  /** How often should we query latest notifications. */
  private REFRESH_INTERVAL = 30 * 1000;

  constructor(
    protected readonly http: HttpClient,
    @Inject(AUTH_SERVICE) private readonly authService: AuthService,
  ) {
    super(http);
    this.authService.authenticationSucceed.subscribe(() => {
      timer(0, this.REFRESH_INTERVAL).pipe(
        takeWhile(() => this.authService.isAuthenticated),
        switchMap(() => this.getUnReadNotifications({offset: 0, limit: this.UNREAD_BOX_LIMIT})),
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

  getNotifications(req: ListRequest) {
    return this.list<NotificationResponse>('notifications', req);
  }

  getReadNotifications(req: ListRequest) {
    return this.list<NotificationResponse>('notifications/read', req);
  }

  getUnReadNotifications(req: ListRequest) {
    return this.list<NotificationResponse>('notifications/unread', req);
  }

  /** Mark all notifications for user as read. */
  markAllNotificationsAsRead() {
    const action = 'read-all';
    const url = `${environment.API_URL}/notifications/actions/${action}/`;
    return this.http.post(url, {});
  }

  /** Delete all notifications for user. */
  deleteAllNotifications() {
    const action = 'delete-all';
    const url = `${environment.API_URL}/notifications/actions/${action}/`;
    return this.http.post(url, {});
  }

}
