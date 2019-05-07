import { Component } from '@angular/core';

import { EventDetailType } from 'src/app/shared/enums/event-detaile-type.enum';

@Component({
  selector: 'app-campus-event-detail',
  templateUrl: './campus-event-detail.component.html',
  styleUrls: ['./campus-event-detail.component.css']
})
export class CampusEventDetailComponent {
  eventDetailType: EventDetailType = EventDetailType.USER;
  constructor() { }
}


