import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CampusEventResponse } from 'src/app/interfaces/event';
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
   /** The data to be displayed. */
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
