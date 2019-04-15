import { Component } from '@angular/core';
import { GenericListComponent } from 'src/app/shared/generics/generic-list/generic-list';
import { Department } from 'src/app/shared/interfaces/department';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { DepartmentService } from 'src/app/shared/services/department.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-department-management',
  templateUrl: './department-management.component.html',
  styleUrls: ['./department-management.component.css']
})
export class DepartmentManagementComponent extends GenericListComponent<Department> {

  constructor(
    readonly userService: UserService,
    protected readonly route: ActivatedRoute,
    protected readonly router: Router,
    protected readonly location: Location,
    private readonly departmentService: DepartmentService,
  ) {
    super(route, router, location);
  }

  getResults(offset: number, limit: number) {
    return this.departmentService.getDepartments({offset, limit});
  }

}
