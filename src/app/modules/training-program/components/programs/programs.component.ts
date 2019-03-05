import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material';
import { of as observableOf, Subject, merge } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

import { ProgramDetail } from 'src/app/interfaces/program';
import { ProgramService} from '../../services/program.service';

@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.css']
})
export class ProgramsComponent implements OnInit {
  /** The data to be displayed */
  programs: ProgramDetail[] = [];
  /** The total number of notifications. */
  programsLength = 0;
  /** Indicate data loading status */
  isLoadingResults = true;

  pageSize = 5;

  private manualRefresh$ = new Subject<PageEvent>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
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

  private forceRefresh() {
    this.manualRefresh$.next({
      previousPageIndex: 0,
      pageIndex: 0,
      pageSize: this.pageSize,
      length: 0,
    } as PageEvent);
  }
}

