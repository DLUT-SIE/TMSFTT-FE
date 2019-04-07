import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CampusEventResponse } from 'src/app/interfaces/event';


@Component({
  selector: 'app-admin-campus-event-detail',
  templateUrl: './admin-campus-event-detail.component.html',
  styleUrls: ['./admin-campus-event-detail.component.css']
})
export class AdminCampusEventDetailComponent implements OnInit {

  item: CampusEventResponse;

  constructor(
    private readonly route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: { item: CampusEventResponse}) => {
      this.item = data.item;
    });
  }

}
