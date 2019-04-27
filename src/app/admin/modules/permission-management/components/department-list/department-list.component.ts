import { Component, Output, EventEmitter } from '@angular/core';
import { GenericListComponent } from 'src/app/shared/generics/generic-list/generic-list';
import { Department } from 'src/app/shared/interfaces/department';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { DepartmentService } from 'src/app/shared/services/department.service';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.css']
})
export class DepartmentListComponent extends GenericListComponent<Department> {
  departmentChildSelect: Department = null;
  @Output() departmentSelect = new EventEmitter<Department>();

  constructor(
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

  onSelect(department: Department){
    this.departmentChildSelect = department;
    this.departmentSelect.emit(department);
  }
}
