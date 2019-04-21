import { Injectable, Inject } from '@angular/core';
import { timer, of as observableOf } from 'rxjs';
import { switchMap, map, catchError, takeWhile } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { Notification } from 'src/app/shared/interfaces/notification';
import { AUTH_SERVICE, AuthService } from 'src/app/shared/interfaces/auth-service';
import { GenericListService } from 'src/app/shared/generics/generic-list-service/generic-list-service';
import { ListRequest } from 'src/app/shared/interfaces/list-request';


@Injectable({
  providedIn: 'root'
})
export class NotificationService extends GenericListService {
  /** Latest unread notifications. */
  unreadNotifications: Notification[] = [];
  /** Indicate whether unread notifications has been loaded. */
  unreadNotificationsLoaded = false;

  constructor(
    protected readonly http: HttpClient,
    @Inject(AUTH_SERVICE) private readonly authService: AuthService,
  ) {
    super(http);
    this.authService.authenticationSucceed.subscribe(() => {
      timer(0, environment.REFRESH_INTERVAL).pipe(
        takeWhile(() => this.authService.isAuthenticated),
        switchMap(() => this.getUnReadNotifications({offset: 0})),
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
    return this.http.get<Notification>(
      `${environment.API_URL}/notifications/${id}/`);
  }

  /** API for retrieving notifications. */
  getNotifications(req: ListRequest) {
    return this.list<Notification>('notifications', req);
  }

  /** API for retrieving notifications which have been read. */
  getReadNotifications(req: ListRequest) {
    return this.list<Notification>('notifications/read', req);
  }

  /** API for retrieving notifications which haven't been read. */
  getUnReadNotifications(req: ListRequest) {
    return this.list<Notification>('notifications/unread', req);
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
