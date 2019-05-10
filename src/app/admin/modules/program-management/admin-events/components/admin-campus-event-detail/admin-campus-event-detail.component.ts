import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventDetailType } from 'src/app/shared/enums/event-detaile-type.enum';
import { CampusEvent } from 'src/app/shared/interfaces/event';

@Component({
  selector: 'app-admin-campus-event-detail',
  templateUrl: './admin-campus-event-detail.component.html',
  styleUrls: ['./admin-campus-event-detail.component.css']
})
export class AdminCampusEventDetailComponent implements OnInit{
  eventDetailType: EventDetailType = EventDetailType.ADMIN;
  event: CampusEvent;

  ngOnInit() {
    this.route.data.subscribe((data: { event: CampusEvent}) => {
      this.event = data.event;
    });
  }
  
  constructor(
    private readonly route: ActivatedRoute,
  ) { }

}
