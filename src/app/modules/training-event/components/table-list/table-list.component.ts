import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material';
import { of as observableOf, Subject, merge } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { CampusEventResponse } from 'src/app/interfaces/event';
import { EventService  } from '../../services/event.service';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {
  /** The data to be displayed */
  events: CampusEventResponse[] = [];
  /** How to sort the columns */
  displayedColumns: string[] = ['id', 'name', 'location'];
  /** The total number of eventlist. */
  eventlistLength = 0;
  /** Indicate data loading status */
  isLoadingResults = true;

  pageSize = 5;
  private manualRefresh$ = new Subject<PageEvent>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private readonly eventService: EventService,
  ) { }

  ngOnInit() {
    merge(this.paginator.page, this.manualRefresh$).pipe(
      switchMap((event: PageEvent) => {
        this.isLoadingResults = true;
        const offset = event.pageIndex * event.pageSize;
        return this.eventService.getEvents(offset);
      }),
      map(data => {
        this.isLoadingResults = false;
        this.eventlistLength = data.count;
        return data.results;
      }),
      catchError((err) => {
        this.isLoadingResults = false;
        return observableOf([]);
      }),
    ).subscribe(events => this.events = events);
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
