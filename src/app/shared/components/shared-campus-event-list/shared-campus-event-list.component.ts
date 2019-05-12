import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericListComponent } from 'src/app/shared/generics/generic-list/generic-list';
import { CampusEvent } from 'src/app/shared/interfaces/event';
import { Program } from 'src/app/shared/interfaces/program';
import { EventService  } from 'src/app/shared/services/events/event.service';
import { EventListType } from '../../enums/event-list-type.enum';

@Component({
  selector: 'app-shared-campus-event-list',
  templateUrl: './shared-campus-event-list.component.html',
  styleUrls: ['./shared-campus-event-list.component.css']
})
export class SharedCampusEventListComponent extends GenericListComponent<CampusEvent>  {
  checkEventListType = EventListType;
  @Input() program?: Program;
  @Input() eventListType?: EventListType;

  constructor(
    private readonly eventService: EventService,
    protected readonly route: ActivatedRoute,
    protected readonly location: Location,
    protected readonly router: Router,
  ) {
    super(route, router, location);
  }

  getResults(offset: number, limit: number) {
    if (this.eventListType === EventListType.USER) {
      return this.eventService.getCampusEvents({offset, limit});
    } else {
      const extraParams = new Map();
      extraParams.set('program', this.program.id);
      return this.eventService.getCampusEvents({offset, limit, extraParams});
    }
  }

  navigateToProgramDetail() {
    this.router.navigate(['../../programs', this.program.id], {relativeTo: this.route});
  }

  navigateToCreateForm() {
    this.router.navigate(['./form'], { queryParams: {program_id: this.program.id}, relativeTo: this.route});
  }


}
