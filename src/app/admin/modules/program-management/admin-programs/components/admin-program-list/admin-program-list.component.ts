import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { tap, map, catchError } from 'rxjs/operators';
import { of as observableOf } from 'rxjs';

import { Program } from 'src/app/shared/interfaces/program';
import { ProgramService } from 'src/app/shared/services/programs/program.service';
import { DepartmentService } from 'src/app/shared/services/department.service';
import { Department } from 'src/app/shared/interfaces/department';
import { AuthService, AUTH_SERVICE } from 'src/app/shared/interfaces/auth-service';

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
  isSchoolAdmin = this.authService.isSchoolAdmin;
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly programService: ProgramService,
    private readonly departmentService: DepartmentService,
    @Inject(AUTH_SERVICE) private readonly authService: AuthService,
  ) { }

  ngOnInit() {
    console.log(this.isSchoolAdmin);
    const department = this.authService.department;
    let departments: Department[] = [];
    let secondId;
    if (this.isSchoolAdmin) {
      this.departmentService.getDepartments({offset: 0, limit: 200}).pipe(
        map(data => {
          departments = data.results;
          return departments;
        }),
        tap(data => {
          for (let i = 0; i < data.length; i++) {
            if (data[i].name === '凌水主校区') {
              secondId = data[i].id;
          }}
          for (let i = 0; i < data.length; i++) {
            if (data[i].super_department === secondId || data[i].name === '大连理工大学') {
              this.departments.push(data[i]);
          }}
        }),
        catchError((err) => {
          this.isLoadingResults = false;
          return observableOf([]);
        })
      ).subscribe(data => {
          this.isLoadingResults = false;
      });
    } else {
      this.loadProgramsBelongToDepartment(department);
      this.isLoadingResults = false;
    }
}

  navigateToRelatedEvents(row: Program) {
    this.router.navigate(['../../events'], { queryParams: {program_id: row.id}, relativeTo: this.route});
  }

  loadProgramsBelongToDepartment(department: number) {
    const extraParams = new Map();
    extraParams.set('department', department);
    this.programService.getPrograms({offset: 0, limit: 200, extraParams}).subscribe(
      data => {
        this.programs = data.results;
      });
    }
}

