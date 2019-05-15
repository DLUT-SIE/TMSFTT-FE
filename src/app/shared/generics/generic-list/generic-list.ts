import { OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { MatPaginator, PageEvent } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { of as observableOf, Observable, Subject, merge } from 'rxjs';
import { switchMap, map, catchError, startWith } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { PaginatedResponse } from '../../interfaces/paginated-response';
import { HttpErrorResponse } from '@angular/common/http';


/** Implement generic logic for displaying list of objects. */
export abstract class GenericListComponent<T extends {id?: number}> implements OnInit {
  /** The data to be displayed */
  results: T[] = [];
  /** The total number of results. */
  resultsLength = 0;
  /** Indicate data loading status */
  isLoadingResults = true;

  readonly pageSize = environment.PAGINATION_SIZE;

  private forceRefresh$ = new Subject<PageEvent>();
  private initialized = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  /**
   * Indicate how to get paginated results.
   * Implementation is required in derived Components.
   * @param offset - How many items should be skipped in results' queryset.
   * @param limit - How many items should be in one page.
   */
  abstract getResults(offset: number, limit: number): Observable<PaginatedResponse<T>>;

  /**
   * Perform custom actions after results retrieved. By befault this function does nothing.
   * Override this function to suport custom logic.
   * @param err - Error occured during results retrieving process. If no error
   * occured, then it will be `null`.
   * @returns obs - An observable, any async operations should be defined in the pipe
   * of this observable.
   */
  performActionsAfterResultsRetrieved(err: HttpErrorResponse): Observable<{}> {
    return observableOf(null);
  }

  constructor(
    protected readonly route: ActivatedRoute,
    protected readonly router: Router,
    protected readonly location: Location,
  ) { }

  ngOnInit() {
    merge(this.paginator.page, this.forceRefresh$).pipe(
      startWith({
        pageIndex: (+this.route.snapshot.queryParamMap.get('page') || /* istanbul ignore next */ 1) - 1,
      }),
      // Convert event to page index and update URL
      map((event: PageEvent) => {
        this.paginator.pageIndex = event.pageIndex;
        this.isLoadingResults = true;
        const url = this.router.createUrlTree([], {
          relativeTo: this.route,
          queryParams: {
            page: event.pageIndex + 1,
          },
          queryParamsHandling: 'merge',
        }).toString();
        if (this.initialized) {
          this.location.go(url);
        } else {
          this.initialized = true;
          this.location.replaceState(url);
        }
        return event.pageIndex;
      }),
      switchMap(page => {
        const offset = page * environment.PAGINATION_SIZE;
        return this.getResults(offset, environment.PAGINATION_SIZE);
      }),
      map(data => {
        this.resultsLength = data.count;
        this.results = data.results;
        return null;
      }),
      catchError((err: HttpErrorResponse) => {
        return observableOf(err);
      }),
      switchMap(err => this.performActionsAfterResultsRetrieved(err)),
    ).subscribe(() => this.isLoadingResults = false);
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

  /** Navigate to detail page which is related to current route. */
  navigateToDetail(row: T) {
    this.router.navigate(['.', row.id], { relativeTo: this.route });
  }
}
