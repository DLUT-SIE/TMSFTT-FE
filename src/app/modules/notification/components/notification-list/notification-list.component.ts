import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NotificationResponse } from 'src/app/interfaces/notification';
import { NotificationService } from '../../services/notification.service';
import { AuthService, AUTH_SERVICE } from 'src/app/interfaces/auth-service';
import { GenericListComponent } from 'src/app/generics/generic-list/generic-list';

/** Display a list of Notifications. */
@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css']
})
export class NotificationListComponent extends GenericListComponent<NotificationResponse> {
  constructor(
    protected readonly route: ActivatedRoute,
    protected readonly router: Router,
    @Inject(AUTH_SERVICE) private readonly authService: AuthService,
    private readonly notificationService: NotificationService,
  ) {
    super(route, router);
  }

  getResults(offset: number, limit: number) {
    return this.notificationService.getNotifications(offset, limit);
  }

  /** Mark all notifications as read. */
  markAllAsRead() {
    this.notificationService.markAllNotificationsAsRead(this.authService.userID).subscribe(() => {
      this.forceRefresh();
    });
  }

  /** Delete all notifications for current user. */
  deleteAll() {
    this.notificationService.deleteAllNotifications(this.authService.userID).subscribe(() => {
      this.forceRefresh();
   });
  }

}