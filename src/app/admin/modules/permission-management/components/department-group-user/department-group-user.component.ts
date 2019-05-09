import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-department-group-user',
  templateUrl: './department-group-user.component.html',
  styleUrls: ['./department-group-user.component.css']
})
export class DepartmentGroupUserComponent implements OnInit {

  @Input() groupId;

  constructor(
  ) { }

  ngOnInit() {
  }

}
