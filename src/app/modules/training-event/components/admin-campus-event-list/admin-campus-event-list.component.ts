import { Component, OnInit } from '@angular/core';
import { CampusEventResponse } from 'src/app/interfaces/event';
import { EventService  } from '../../services/event.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GenericListComponent } from 'src/app/generics/generic-list/generic-list';

@Component({
  selector: 'app-admin-campus-event-list',
  templateUrl: './admin-campus-event-list.component.html',
  styleUrls: ['./admin-campus-event-list.component.css']
})

export class AdminCampusEventListComponent extends GenericListComponent<CampusEventResponse> implements OnInit {
  programId: number;
  constructor(
    private readonly eventService: EventService,
    protected readonly route: ActivatedRoute,
    protected readonly router: Router,
  ) {
    super(route, router);
  }

  ngOnInit() {
    // alert('1')
    this.route.queryParams.subscribe(queryParams => {
      this.programId = queryParams.program_id;
  });
  }

  getResults(offset: number, limit: number) {
    // alert('2')
    let extraParams = new Map();
    extraParams.set('program',this.programId)
    return this.eventService.getCampusEvents({offset, limit, extraParams});
  }
}
