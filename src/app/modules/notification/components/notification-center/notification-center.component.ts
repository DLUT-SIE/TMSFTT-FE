import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material';
import { of as observableOf, Subject, merge } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

import { NotificationResponse } from 'src/app/interfaces/notification';
import { NotificationService } from '../../services/notification.service';
import { AuthService, AUTH_SERVICE } from 'src/app/interfaces/auth-service';

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

  pageSize = 5;

  private manualRefresh$ = new Subject<PageEvent>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    @Inject(AUTH_SERVICE) private readonly authService: AuthService,
    private readonly notificationService: NotificationService,
  ) { }

  ngOnInit() {
    merge(this.paginator.page, this.manualRefresh$).pipe(
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
    this.forceRefresh();
  }

  navigateToDetail(row: NotificationResponse) {
    this.router.navigate(['.', row.id], { relativeTo: this.route });
  }

  private forceRefresh() {
    this.manualRefresh$.next({
      previousPageIndex: 0,
      pageIndex: 0,
      pageSize: this.pageSize,
      length: 0,
    } as PageEvent);
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
