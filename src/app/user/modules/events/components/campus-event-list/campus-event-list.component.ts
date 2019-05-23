import { Component} from '@angular/core';

import { EventListType } from 'src/app/shared/enums/event-list-type.enum';

/** CampusEventListComponent provides campus event list. */
@Component({
  selector: 'app-campus-event-list',
  templateUrl: './campus-event-list.component.html',
  styleUrls: ['./campus-event-list.component.css']
})
export class CampusEventListComponent {
  eventListType: EventListType = EventListType.USER;
  constructor() { }
}
