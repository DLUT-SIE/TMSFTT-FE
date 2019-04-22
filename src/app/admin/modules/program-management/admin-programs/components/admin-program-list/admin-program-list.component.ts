import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { of as observableOf } from 'rxjs';

import { Program } from 'src/app/shared/interfaces/program';
import { ProgramService} from 'src/app/shared/services/programs/program.service';

@Component({
  selector: 'app-admin-program-list',
  templateUrl: './admin-program-list.component.html',
  styleUrls: ['./admin-program-list.component.css']
})

export class AdminProgramListComponent implements OnInit {

  programs: Program[] = [];
  /** The total number of programs. */
  isLoadingResults = true;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly programService: ProgramService,
  ) { }

  ngOnInit() {
    this.programService.getPrograms({offset: 0, limit: 100}).pipe(
      map(data => {
        this.isLoadingResults = false;
        return data.results;
      }),
      catchError((err) => {
        this.isLoadingResults = false;
        return observableOf([]);
      }),
    ).subscribe(programs => this.programs = programs);
  }

  navigateToRelatedEvents(row: Program) {
    this.router.navigate(['../../events'], { queryParams: {program_id: row.id}, relativeTo: this.route});
  }

}

