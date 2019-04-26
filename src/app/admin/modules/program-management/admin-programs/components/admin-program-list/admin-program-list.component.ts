import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { map, catchError, switchMap } from 'rxjs/operators';
import { of as observableOf, zip } from 'rxjs';

import { Program } from 'src/app/shared/interfaces/program';
import { ProgramService } from 'src/app/shared/services/programs/program.service';
import { DepartmentService } from 'src/app/shared/services/department.service';
import { Department } from 'src/app/shared/interfaces/department';

@Component({
  selector: 'app-admin-program-list',
  templateUrl: './admin-program-list.component.html',
  styleUrls: ['./admin-program-list.component.css']
})

export class AdminProgramListComponent implements OnInit {

  programs: Program[] = [];
  departments: Department[] = [];
  /** The total number of programs. */
  isLoadingResults = true;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly programService: ProgramService,
    private readonly departmentService: DepartmentService,
  ) { }

  ngOnInit() {
    let programs;
    this.programService.getPrograms({offset: 0, limit: 100}).pipe(
        map(data => {
          programs = data.results;
          return programs;
        }),
        switchMap((data: Program[]) => {
          return zip(...data.map(program =>
              this.departmentService.getDepartment(program.department)
          ));
        }),
        map((departments: Department[]) => {
          this.isLoadingResults = false;
          for (let i = 0 ; i < programs.length; i++) {
            programs[i].department = departments[i];
          }
        }),
        catchError((err) => {
          this.isLoadingResults = false;
          programs = observableOf([]);
          return programs.value;
        })).subscribe(
      data => {
        this.programs = programs;
      });
  }

  navigateToRelatedEvents(row: Program) {
    this.router.navigate(['../../events'], { queryParams: {program_id: row.id}, relativeTo: this.route});
  }

}

