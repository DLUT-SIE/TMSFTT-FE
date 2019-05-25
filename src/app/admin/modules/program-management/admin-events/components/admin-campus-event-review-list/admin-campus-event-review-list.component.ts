import { Component, OnInit } from '@angular/core';
import { EventListType } from 'src/app/shared/enums/event-list-type.enum';

@Component({
  selector: 'app-admin-campus-event-review-list',
  templateUrl: './admin-campus-event-review-list.component.html',
  styleUrls: ['./admin-campus-event-review-list.component.css']
})
export class AdminCampusEventReviewListComponent implements OnInit {
  eventListType: EventListType = EventListType.TO_BE_REVIEWED;

  constructor() { }

  ngOnInit() {
  }

}
