import { Component, OnInit } from '@angular/core';
import { Department } from 'src/app/shared/interfaces/department';

@Component({
  selector: 'app-department-management',
  templateUrl: './department-management.component.html',
  styleUrls: ['./department-management.component.css']
})
export class DepartmentManagementComponent implements OnInit {

  departmentSelected: Department = null;

  constructor() { }

  ngOnInit() {
  }

  onchanged(department: Department) {
    this.departmentSelected = department;
  }
}
