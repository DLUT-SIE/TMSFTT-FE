import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventDetailType } from 'src/app/shared/enums/event-detail-type.enum';
import { CampusEvent } from 'src/app/shared/interfaces/event';

@Component({
  selector: 'app-campus-event-detail',
  templateUrl: './campus-event-detail.component.html',
  styleUrls: ['./campus-event-detail.component.css']
})
export class CampusEventDetailComponent implements OnInit {
  eventDetailType: EventDetailType = EventDetailType.USER;
  event: CampusEvent;

  constructor(
    private readonly route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: { event: CampusEvent}) => {
      this.event = data.event;
    });
  }
}


