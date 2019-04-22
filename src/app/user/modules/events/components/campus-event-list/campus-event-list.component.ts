import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { CampusEvent } from 'src/app/shared/interfaces/event';
import { EventService  } from '../../services/event.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GenericListComponent } from 'src/app/shared/generics/generic-list/generic-list';

/** CampusEventListComponent provides campus event list. */
@Component({
  selector: 'app-campus-event-list',
  templateUrl: './campus-event-list.component.html',
  styleUrls: ['./campus-event-list.component.css']
})
export class CampusEventListComponent extends GenericListComponent<CampusEvent> {
  constructor(
    private readonly eventService: EventService,
    protected readonly route: ActivatedRoute,
    protected readonly router: Router,
    protected readonly location: Location,
  ) {
    super(route, router, location);
  }

  getResults(offset: number, limit: number) {
    return this.eventService.getCampusEvents({offset, limit});
  }
}
