import { Component, OnInit, Input } from '@angular/core';
import { Group } from 'src/app/shared/interfaces/group';

@Component({
  selector: 'app-department-group-permission',
  templateUrl: './department-group-permission.component.html',
  styleUrls: ['./department-group-permission.component.css']
})
export class DepartmentGroupPermissionComponent implements OnInit {

  @Input() group: Group;

  constructor(
  ) {}

  ngOnInit() {
  }

}
