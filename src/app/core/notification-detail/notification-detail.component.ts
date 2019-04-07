import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NotificationResponse } from 'src/app/shared/interfaces/notification';

/** Display a notification in detail. */
@Component({
  selector: 'app-notification-detail',
  templateUrl: './notification-detail.component.html',
  styleUrls: ['./notification-detail.component.css']
})
export class NotificationDetailComponent implements OnInit {
  /** The data to be displayed. */
  notification: NotificationResponse;
  constructor(
    private readonly route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: { notification: NotificationResponse}) => {
      this.notification = data.notification;
    });
  }
}
