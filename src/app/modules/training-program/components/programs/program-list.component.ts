import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material';
import { of as observableOf, Subject, merge } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

import { Program } from 'src/app/interfaces/program';
import { ProgramService} from '../../services/program.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-programs',
  templateUrl: './program-list.component.html',
  styleUrls: ['./program-list.component.css']
})
export class ProgramListComponent implements OnInit {
  /** The data to be displayed */
  programs: Program[] = [];
  /** The total number of notifications. */
  programsLength = 0;
  /** Indicate data loading status */
  isLoadingResults = true;

  pageSize = environment.PAGINATION_SIZE;

  private manualRefresh$ = new Subject<PageEvent>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly programService: ProgramService,
  ) { }

  ngOnInit() {
    merge(this.paginator.page, this.manualRefresh$).pipe(
      switchMap((event: PageEvent) => {
        this.isLoadingResults = true;
        const offset = event.pageIndex * event.pageSize;
        return this.programService.getPrograms(offset);
      }),
      map(data => {
        this.isLoadingResults = false;
        this.programsLength = data.count;
        return data.results;
      }),
      catchError((err) => {
        this.isLoadingResults = false;
        return observableOf([]);
      }),
    ).subscribe(programs => this.programs = programs);
    this.forceRefresh();
  }

  navigateToDetail(row: Program) {
      this.router.navigate(['./', row.id], { relativeTo: this.route });
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

