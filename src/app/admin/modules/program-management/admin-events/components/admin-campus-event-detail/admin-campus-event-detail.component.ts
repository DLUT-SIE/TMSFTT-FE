import { Component } from '@angular/core';

import { EventDetailType } from 'src/app/shared/enums/event-detaile-type.enum';

@Component({
  selector: 'app-admin-campus-event-detail',
  templateUrl: './admin-campus-event-detail.component.html',
  styleUrls: ['./admin-campus-event-detail.component.css']
})
export class AdminCampusEventDetailComponent {
  eventDetailType: EventDetailType = EventDetailType.ADMIN;
  constructor() { }
}
