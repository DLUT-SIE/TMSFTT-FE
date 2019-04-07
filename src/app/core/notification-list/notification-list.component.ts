import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NotificationResponse } from 'src/app/shared/interfaces/notification';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { GenericListComponent } from 'src/app/shared/generics/generic-list/generic-list';

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
    private readonly notificationService: NotificationService,
  ) {
    super(route, router);
  }

  getResults(offset: number, limit: number) {
    return this.notificationService.getNotifications({offset, limit});
  }

  /** Mark all notifications as read. */
  markAllAsRead() {
    this.notificationService.markAllNotificationsAsRead().subscribe(() => {
      this.forceRefresh();
    });
  }

  /** Delete all notifications for current user. */
  deleteAll() {
    this.notificationService.deleteAllNotifications().subscribe(() => {
      this.forceRefresh();
   });
  }

}
