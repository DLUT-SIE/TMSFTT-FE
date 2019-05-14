import { Injectable, Inject } from '@angular/core';
import { timer, merge, Subject } from 'rxjs';
import { switchMap, takeWhile, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { Notification } from 'src/app/shared/interfaces/notification';
import { AUTH_SERVICE, AuthService } from 'src/app/shared/interfaces/auth-service';
import { GenericListService } from 'src/app/shared/generics/generic-list-service/generic-list-service';
import { ListRequest } from 'src/app/shared/interfaces/list-request';
import { PaginatedResponse } from '../interfaces/paginated-response';
import { MatSnackBar } from '@angular/material';


@Injectable({
  providedIn: 'root'
})
export class NotificationService extends GenericListService {
  /** Latest unread notifications. */
  unreadNotifications: Notification[] = [];
  unreadNotificationsLength = 0;
  /** Indicate whether unread notifications has been loaded. */
  unreadNotificationsLoaded = false;

  private latestUnreadNotification: Notification;
  private readonly reloadUnReadNotifications$ = new Subject<void>();

  constructor(
    protected readonly http: HttpClient,
    private readonly snackBar: MatSnackBar,
    @Inject(AUTH_SERVICE) private readonly authService: AuthService,
  ) {
    super(http);
    this.authService.authenticationSucceed.subscribe(() => {
      merge(this.reloadUnReadNotifications$, timer(0, environment.REFRESH_INTERVAL))
      .pipe(
        takeWhile(() => this.authService.isAuthenticated),
        switchMap(() => this.getUnReadNotifications({ offset: 0 })),
      ).subscribe(
        (res) => {
          if (res.count !== 0
              && (!this.latestUnreadNotification || this.latestUnreadNotification.id !== res.results[0].id)) {
            this.snackBar.open('您有未阅读的通知，请前往通知中心查看!', '关闭', {
              duration: 2000,
              panelClass: 'color-white',
            });
            this.latestUnreadNotification = res.results[0];
          }
          this.unreadNotifications = res.results;
          this.unreadNotificationsLength = res.count;
          this.unreadNotificationsLoaded = true;
        },
        () => {
          this.unreadNotificationsLength = 0;
          this.unreadNotificationsLoaded = true;
        });
    });
  }

  private reloadUnReadNotifications() {
    this.reloadUnReadNotifications$.next();
  }

  getNotification(id: number) {
    return this.http.get<Notification>(`/notifications/${id}/`)
      .pipe(tap(() => this.reloadUnReadNotifications()));
  }

  /** API for retrieving notifications. */
  getNotifications(req: ListRequest) {
    return this.list<PaginatedResponse<Notification>>('notifications', req);
  }

  /** API for retrieving notifications which have been read. */
  getReadNotifications(req: ListRequest) {
    return this.list<PaginatedResponse<Notification>>('notifications/read', req);
  }

  /** API for retrieving notifications which haven't been read. */
  getUnReadNotifications(req: ListRequest) {
    return this.list<PaginatedResponse<Notification>>('notifications/unread', req);
  }

  /** Mark all notifications for user as read. */
  markAllNotificationsAsRead() {
    return this.http.post(`/notifications/mark-all-as-read/`, {});
  }
}
