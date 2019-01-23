import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material';
import { of as observableOf } from 'rxjs';
import { switchMap, map, catchError, startWith } from 'rxjs/operators';

import { NotificationResponse } from 'src/app/interfaces/notification';
import { NotificationService } from '../../services/notification.service';

/** Display a list of Notifications. */
@Component({
  selector: 'app-notification-center',
  templateUrl: './notification-center.component.html',
  styleUrls: ['./notification-center.component.css']
})
export class NotificationCenterComponent implements OnInit {
  /** The data to be displayed */
  notifications: NotificationResponse[] = [];
  /** How to sort the columns */
  displayedColumns: string[] = ['time', 'sender', 'recipient', 'readStatus'];
  /** The total number of notifications. */
  notificationsLength = 0;
  /** Indicate data loading status */
  isLoadingResults = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly notificationService: NotificationService,
  ) { }

  ngOnInit() {
    this.paginator.page.pipe(
      startWith({
        previousPageIndex: 0,
        pageIndex: 0,
        pageSize: 10,
        length: 0,
      } as PageEvent),
      switchMap((event: PageEvent) => {
        this.isLoadingResults = true;
        const offset = event.pageIndex * event.pageSize;
        return this.notificationService.getNotifications(offset);
      }),
      map(data => {
        this.isLoadingResults = false;
        this.notificationsLength = data.count;
        return data.results;
      }),
      catchError((err) => {
        this.isLoadingResults = false;
        return observableOf([]);
      }),
    ).subscribe(notifications => this.notifications = notifications);
  }

  navigateToDetail(row: NotificationResponse) {
    this.router.navigate(['.', row.id], { relativeTo: this.route });
  }
}
