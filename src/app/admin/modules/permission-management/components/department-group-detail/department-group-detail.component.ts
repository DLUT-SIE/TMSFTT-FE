import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-department-group-detail',
  templateUrl: './department-group-detail.component.html',
  styleUrls: ['./department-group-detail.component.css']
})
export class DepartmentGroupDetailComponent implements OnInit {

  groupId: number;
  constructor(
    private readonly route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.groupId = +this.route.snapshot.paramMap.get('id');
  }

}
