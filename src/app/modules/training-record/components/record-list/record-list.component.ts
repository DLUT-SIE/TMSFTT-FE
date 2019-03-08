import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material';
import { of as observableOf, Subject, merge } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

import { RecordResponse } from 'src/app/interfaces/record';
import { RecordService } from '../../services/record.service';
import { environment } from 'src/environments/environment';

/** Display a list of Records. */
@Component({
  selector: 'app-record-list',
  templateUrl: './record-list.component.html',
  styleUrls: ['./record-list.component.css']
})
export class RecordListComponent implements OnInit {
    /** The data to be displayed */
    records: RecordResponse[] = [];
    /** The total number of records. */
    recordsLength = 0;
    /** Indicate data loading status */
    isLoadingResults = true;

    readonly pageSize = environment.PAGINATION_SIZE;

    private manualRefresh$ = new Subject<PageEvent>();

    @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private readonly recordService: RecordService,
  ) { }

  ngOnInit() {
    merge(this.paginator.page, this.manualRefresh$).pipe(
      switchMap((event: PageEvent) => {
        this.isLoadingResults = true;
        const offset = event.pageIndex * event.pageSize;
        return this.recordService.getRecords(offset);
      }),
      map(data => {
        this.isLoadingResults = false;
        this.recordsLength = data.count;
        return data.results;
      }),
      catchError((err) => {
        this.isLoadingResults = false;
        return observableOf([]);
      }),
    ).subscribe(records => this.records = records);
    this.forceRefresh();
  }

  private forceRefresh() {
    this.manualRefresh$.next({
      previousPageIndex: 0,
      pageIndex: 0,
      pageSize: this.pageSize,
      length: 0,
    } as PageEvent);
  }

}
