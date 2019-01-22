import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { NotificationService } from 'src/app/services/notification/notification.service';

/** This component should display notifications in a dialog. */
@Component({
  selector: 'app-notification-box',
  templateUrl: './notification-box.component.html',
  styleUrls: ['./notification-box.component.css']
})
export class NotificationBoxComponent implements OnInit {

  constructor(
    readonly dialogRef: MatDialogRef<NotificationBoxComponent>,
    readonly notificationService: NotificationService,
  ) { }

  ngOnInit() {
  }

}
