import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Group } from 'src/app/shared/interfaces/group';


@Component({
  selector: 'app-department-group-detail',
  templateUrl: './department-group-detail.component.html',
  styleUrls: ['./department-group-detail.component.css']
})
export class DepartmentGroupDetailComponent implements OnInit {

  group: Group;

  constructor(
    private readonly route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: { group: Group}) => {
      this.group = data.group;
    });
  }
}
