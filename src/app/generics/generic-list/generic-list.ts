import { OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { of as observableOf, Observable, Subject, merge } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { PaginatedResponse } from 'src/app/interfaces/paginated-response';
import { GenericObject } from 'src/app/interfaces/generics';


/** Implement generic logic for displaying list of objects. */
export abstract class GenericListComponent<T extends GenericObject> implements OnInit {
  /** The data to be displayed */
  results: T[] = [];
  /** The total number of results. */
  resultsLength = 0;
  /** Indicate data loading status */
  isLoadingResults = true;

  readonly pageSize = environment.PAGINATION_SIZE;

  private manualRefresh$ = new Subject<PageEvent>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  /**
   * Indicate how to get paginated results.
   * Implementation is required in derived Components.
   */
  abstract getResults(offset: number, limit: number): Observable<PaginatedResponse<T>>;

  constructor(
    protected readonly route: ActivatedRoute,
    protected readonly router: Router,
  ) {}

  ngOnInit() {
    merge(this.paginator.page, this.manualRefresh$).pipe(
      switchMap((event: PageEvent) => {
        this.isLoadingResults = true;
        const offset = event.pageIndex * event.pageSize;
        return this.getResults(offset, this.pageSize);
      }),
      map(data => {
        this.isLoadingResults = false;
        this.resultsLength = data.count;
        return data.results;
      }),
      catchError((err) => {
        this.isLoadingResults = false;
        return observableOf([]);
      }),
    ).subscribe(results => this.results = results);
    this.forceRefresh();
  }

  /** Trigger page refresh manually. */
  protected forceRefresh() {
    this.manualRefresh$.next({
      previousPageIndex: 0,
      pageIndex: 0,
      pageSize: this.pageSize,
      length: 0,
    } as PageEvent);
  }

  /** Navigate to detail page which is related to current route. */
  navigateToDetail(row: T) {
    this.router.navigate(['.', row.id], { relativeTo: this.route });
  }
}
