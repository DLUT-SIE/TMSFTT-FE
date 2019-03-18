import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CampusEventResponse } from 'src/app/interfaces/event';

@Component({
  selector: 'app-campus-event-detail',
  templateUrl: './campus-event-detail.component.html',
  styleUrls: ['./campus-event-detail.component.css']
})
export class CampusEventDetailComponent implements OnInit {

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

