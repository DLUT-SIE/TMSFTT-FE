import { Component, OnInit } from '@angular/core';
import { UserPermissionStatus } from 'src/app/shared/interfaces/permission';
import { DepartmentService } from 'src/app/shared/services/department.service';
import { Department } from 'src/app/shared/interfaces/department';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-department-detail',
  templateUrl: './department-detail.component.html',
  styleUrls: ['./department-detail.component.css']
})
export class DepartmentDetailComponent implements OnInit {
  isLoading = true;
  department: Department = null;
  errorMessage = '';
  /** The permissions the selected department currently have. */
  originalPermissions: UserPermissionStatus[] = [];
  /** The permissions that should be after the change. */
  newPermissions: UserPermissionStatus[] = [];

  constructor(
    readonly location: Location,
    private readonly route: ActivatedRoute,
    private readonly departmentService: DepartmentService,
  ) { }

  ngOnInit() {
    const departmentId = +this.route.snapshot.paramMap.get('id');
    this.departmentService.getDepartment(departmentId).subscribe(department => {
      this.isLoading = false;
      this.department = department;
    });
  }

}
