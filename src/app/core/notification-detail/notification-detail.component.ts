import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { Notification } from 'src/app/shared/interfaces/notification';

/** Display a notification in detail. */
@Component({
  selector: 'app-notification-detail',
  templateUrl: './notification-detail.component.html',
  styleUrls: ['./notification-detail.component.css']
})
export class NotificationDetailComponent implements OnInit {
  /** The data to be displayed. */
  notification: Notification;
  constructor(
    private readonly route: ActivatedRoute,
    readonly location: Location,
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: { notification: Notification}) => {
      this.notification = data.notification;
    });
  }
}
