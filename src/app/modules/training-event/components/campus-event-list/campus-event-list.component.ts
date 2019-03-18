import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material';
import { of as observableOf, Subject, merge } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { CampusEventResponse } from 'src/app/interfaces/event';
import { EventService  } from '../../services/event.service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';

/** CampusEventListComponent provides campus event list. */
@Component({
  selector: 'app-campus-event-list',
  templateUrl: './campus-event-list.component.html',
  styleUrls: ['./campus-event-list.component.css']
})
export class CampusEventListComponent implements OnInit {
  /** The data to be displayed */
  events: CampusEventResponse[] = [];
  /** The total number of eventlist. */
  eventlistLength = 0;
  /** Indicate data loading status */
  isLoadingResults = true;
  readonly pageSize = environment.PAGINATION_SIZE;

  private manualRefresh$ = new Subject<PageEvent>();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly eventService: EventService,
  ) { }

  ngOnInit() {
    merge(this.paginator.page, this.manualRefresh$).pipe(
      switchMap((event: PageEvent) => {
        this.isLoadingResults = true;
        const offset = event.pageIndex * event.pageSize;
        return this.eventService.getCampusEvents({offset});
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
  navigateToDetail(row: CampusEventResponse) {
    this.router.navigate(['.', row.id], { relativeTo: this.route });
  }

  private forceRefresh() {
    this.manualRefresh$.next({
      previousPageIndex: 0,
      pageIndex: 0,
      length: 0,
      pageSize: this.pageSize,
    } as PageEvent);
  }

}
