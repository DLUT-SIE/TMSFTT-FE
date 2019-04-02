import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { of as observableOf } from 'rxjs';

import { Program } from 'src/app/interfaces/program';
import { ProgramService} from '../../services/program.service';

@Component({
  selector: 'app-program-list',
  templateUrl: './program-list.component.html',
  styleUrls: ['./program-list.component.css']
})

export class ProgramListComponent implements OnInit {

  programs: Program[] = [];
  /** The total number of programs. */
  isLoadingResults = true;

  constructor(
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
    this.router.navigate(['../events'], { queryParams: {program_id: row.id} });
  }

}

