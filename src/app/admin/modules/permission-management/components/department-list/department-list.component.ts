import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Department } from 'src/app/shared/interfaces/department';
import { DepartmentService } from 'src/app/shared/services/department.service';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.css']
})
export class DepartmentListComponent implements OnInit {
  departmentChildSelect: Department = null;
  departmentList: Department[];
  @Output() departmentSelect = new EventEmitter<Department>();
  /** Indicate data loading status */
  isLoadingResults = true;

  constructor(
    private readonly departmentService: DepartmentService,
  ) { }

  ngOnInit() {
    this.departmentService.getTopDepartments().subscribe(res => {
      this.departmentList = res;
      this.isLoadingResults = false;
    });
  }

  onSelect(department: Department) {
    this.departmentChildSelect = department;
    this.departmentSelect.emit(department);
  }
}
