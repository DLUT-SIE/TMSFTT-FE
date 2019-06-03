import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatSnackBar, PageEvent, MatPaginator } from '@angular/material';
import { merge, Subject } from 'rxjs';
import { startWith, map, switchMap } from 'rxjs/operators';

import { Record } from 'src/app/shared/interfaces/record';
import { RecordService } from 'src/app/shared/services/records/record.service';
import { StatusChangeLog } from 'src/app/shared/interfaces/status-change-log';
import { HttpErrorResponse } from '@angular/common/http';
import { RecordStatus } from 'src/app/shared/enums/record-status.enum';
import { errorProcess } from '../../utils/error-process';

@Component({
  selector: 'app-record-status-change-logs-section',
  templateUrl: './record-status-change-logs-section.component.html',
  styleUrls: ['./record-status-change-logs-section.component.css']
})
export class RecordStatusChangeLogsSectionComponent implements OnInit {
  readonly recordStatus = RecordStatus;
  @Input() record: Record;

  statusChangeLogs: StatusChangeLog[] = [];
  totalLength = 0;
  isLoadingResults = true;
  readonly pageSize = 5;

  private forceRefresh$ = new Subject<PageEvent>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    protected readonly snackBar: MatSnackBar,
    private readonly recordService: RecordService,
  ) { }

  getStatusChangeLogs(offset: number, limit: number) {
    const extraParams = new Map();
    extraParams.set('record', this.record.id);
    return this.recordService.getStatusChangeLogs({offset, limit, extraParams});
  }

  ngOnInit() {
    merge(this.paginator.page, this.forceRefresh$).pipe(
      startWith({
        pageIndex: 0,
      }),
      map((event: PageEvent) => {
        this.isLoadingResults = true;
        return event.pageIndex;
      }),
      switchMap(page => {
        const offset = page * this.pageSize;
        return this.getStatusChangeLogs(offset, this.pageSize);
      }),
      map(data => {
        this.totalLength = data.count;
        this.statusChangeLogs = data.results;
        return null;
      }),
    ).subscribe(() => {
      this.isLoadingResults = false;
      },
      (error: HttpErrorResponse) => {
        const message = errorProcess(error);
        this.isLoadingResults = false;
        this.snackBar.open(message, '关闭');
      });
  }

  /** Trigger page refresh manually. */
  forceRefresh() {
    if (this.paginator.hasPreviousPage()) {
      // Not at first page. Jump to first page and content will be udpated
      // accordingly
      this.paginator.firstPage();
      return;
    }
    // At first page, just trigger content refresh
    this.forceRefresh$.next({
      pageIndex: 0,
    } as PageEvent);
  }

}
