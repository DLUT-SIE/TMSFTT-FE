import { Component, OnInit, Input } from '@angular/core';
import { Notification } from '../../services/notification/notification.service';

/** Used for single Notification in NotificationBox. */
@Component({
  selector: 'app-notification-box-card',
  templateUrl: './notification-box-card.component.html',
  styleUrls: ['./notification-box-card.component.css']
})
export class NotificationBoxCardComponent implements OnInit {
  /** The notification to be displayed. */
  @Input() notification: Notification;

  constructor() { }

  ngOnInit() {
  }

}
