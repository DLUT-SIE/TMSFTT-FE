import { Component, OnInit } from '@angular/core';
import { CampusEventResponse } from 'src/app/interfaces/event';
import { EventService  } from '../../services/event.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GenericListComponent } from 'src/app/generics/generic-list/generic-list';
import { ProgramService} from '../../../training-program/services/program.service';
import { map, catchError } from 'rxjs/operators';
import { Program } from 'src/app/interfaces/program';
import { of as observableOf } from 'rxjs';

@Component({
  selector: 'app-admin-campus-event-list',
  templateUrl: './admin-campus-event-list.component.html',
  styleUrls: ['./admin-campus-event-list.component.css']
})

export class AdminCampusEventListComponent extends GenericListComponent<CampusEventResponse> implements OnInit {
  programId: string;
  programs: Program[] = [];
  constructor(
    private readonly eventService: EventService,
    protected readonly route: ActivatedRoute,
    protected readonly router: Router,
    private readonly programService: ProgramService,
  ) {
    super(route, router);
  }

  getResults(offset: number, limit: number) {
    let extraParams = new Map();
    extraParams.set('program',this.programId)
    return this.eventService.getCampusEvents({offset, limit, extraParams});
  }

  ngOnInit() {
    this.route.queryParams.subscribe(queryParams => {
      this.programId = queryParams.program_id;
  });
  this.programService.getPrograms({offset: 0, limit: 100}).pipe(
    map(data => {
      this.isLoadingResults = false;
      return data.results;
    }),
    catchError((err) => {
      this.isLoadingResults = false;
      return observableOf([]);
    }),
  ).subscribe(programs => this.programs = programs);
  super.ngOnInit();
  }
}
