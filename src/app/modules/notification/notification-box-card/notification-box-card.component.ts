import { Component, OnInit, Input } from '@angular/core';
import { NotificationResponse } from 'src/app/interfaces/notification';
import { MatDialogRef } from '@angular/material';

/** Used for single Notification in NotificationBox. */
@Component({
  selector: 'app-notification-box-card',
  templateUrl: './notification-box-card.component.html',
  styleUrls: ['./notification-box-card.component.css']
})
export class NotificationBoxCardComponent implements OnInit {
  /** The notification to be displayed. */
  @Input() notification: NotificationResponse;
  /** The reference of the opened notification box dialog. */
  @Input() dialogRef: MatDialogRef<NotificationBoxCardComponent>;

  constructor() { }

  ngOnInit() {
  }

}
