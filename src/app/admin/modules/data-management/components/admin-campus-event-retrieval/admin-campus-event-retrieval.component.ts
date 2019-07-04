import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { EventService } from 'src/app/shared/services/events/event.service';
import { GenericListComponent } from 'src/app/shared/generics/generic-list/generic-list';
import { CampusEvent } from 'src/app/shared/interfaces/event';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-admin-campus-event-retrieval',
  templateUrl: './admin-campus-event-retrieval.component.html',
  styleUrls: ['./admin-campus-event-retrieval.component.css']
})
export class AdminCampusEventRetrievalComponent extends  GenericListComponent<CampusEvent>  {
  filterForm = this.fb.group({
    eventName: [''],
  });

  constructor(
    protected readonly route: ActivatedRoute,
    protected readonly router: Router,
    protected readonly location: Location,
    private readonly fb: FormBuilder,
    private readonly eventService: EventService,
  ) {
    super(route, router, location);
  }

  getResults(offset: number, limit: number) {
    const value = this.filterForm.value;
    const params = new Map<string, string>([
      ['name__icontains', value.eventName],
    ]);
    return this.eventService.getCampusEvents({offset, limit, extraParams: params});
  }

  navigateToDetail(event: CampusEvent) {
    this.router.navigate(['admin', 'programs', event.program, 'events', event.id]);
  }
}
