import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-department-group-permission',
  templateUrl: './department-group-permission.component.html',
  styleUrls: ['./department-group-permission.component.css']
})
export class DepartmentGroupPermissionComponent implements OnInit {

  @Input() groupId;

  constructor(
  ) {}

  ngOnInit() {
  }

}
