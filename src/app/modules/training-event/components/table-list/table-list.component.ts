import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material';
import { of as observableOf, Subject, merge } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

import { CampusEventResponse } from 'src/app/interfaces/event';
import { EventService  } from '../../services/event.service';
// import { AuthService, AUTH_SERVICE } from 'src/app/interfaces/auth-service';
// import { AUTH_SERVICE } from 'src/app/interfaces/auth-service';
@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {
  /** The data to be displayed */
  events: CampusEventResponse[] = [];
  /** How to sort the columns */
  displayedColumns: any[] = ['id','name', 'location'];
  /** The total number of eventlist. */
  eventlistLength = 0;
  /** Indicate data loading status */
  isLoadingResults = true;

  pageSize = 5;
  private manualRefresh$ = new Subject<PageEvent>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    // @Inject(AUTH_SERVICE) private readonly authService: AuthService,
    // @Inject(AUTH_SERVICE)
    private readonly eventService: EventService,
  ) { }

  ngOnInit() {
    
    merge(this.paginator.page, this.manualRefresh$).pipe(
      switchMap((event: PageEvent) => {
        // alert("已经进入了switchMap");
        this.isLoadingResults = true;
        const offset = event.pageIndex * event.pageSize;
        
        return this.eventService.getEvents(offset);
      }),
      map(data => {
        // alert("已经出来数据啦!");
        // 这里已经执行了.
        this.isLoadingResults = false;
        this.eventlistLength = data.count;
        return data.results;
      }),
      catchError((err) => {
        // alert("出现了加载数据的异常!");
        //也没有出现加载数据的异常
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
      pageSize: this.pageSize,
      length: 0,
    } as PageEvent);
  }

 

}
