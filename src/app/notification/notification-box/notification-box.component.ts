import { Component, OnInit } from '@angular/core';
import { Notification, NotificationService } from '../../services/notification/notification.service';

/** This component should display notifications in a dialog. */
@Component({
  selector: 'app-notification-box',
  templateUrl: './notification-box.component.html',
  styleUrls: ['./notification-box.component.css']
})
export class NotificationBoxComponent implements OnInit {
  /** Indicate whether notifications has been loaded. */
  notificationsLoaded = false;
  /** Latest unread notifications. */
  notifications: Notification[] = [];

  constructor(
    private readonly notificationService: NotificationService,
  ) { }

  ngOnInit() {
    this.notificationService.latestUnreadNotifications$.subscribe(
      (res: {}) => {
        this.notifications = res['results'];
        this.notificationsLoaded = true;
      });
  }

}
