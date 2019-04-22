import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CampusEvent } from 'src/app/shared/interfaces/event';

@Component({
  selector: 'app-campus-event-detail',
  templateUrl: './campus-event-detail.component.html',
  styleUrls: ['./campus-event-detail.component.css']
})
export class CampusEventDetailComponent implements OnInit {

  item: CampusEvent;

  constructor(
    private readonly route: ActivatedRoute,
    readonly location: Location,
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: { item: CampusEvent}) => {
      this.item = data.item;
    });
  }

}

