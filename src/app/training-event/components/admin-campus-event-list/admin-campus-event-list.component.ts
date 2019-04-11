import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { CampusEventResponse } from 'src/app/shared/interfaces/event';
import { EventService  } from '../../services/event.service';
import { ProgramService } from '../../../training-program/services/program.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GenericListComponent } from 'src/app/shared/generics/generic-list/generic-list';
import { Program } from 'src/app/shared/interfaces/program';

@Component({
  selector: 'app-admin-campus-event-list',
  templateUrl: './admin-campus-event-list.component.html',
  styleUrls: ['./admin-campus-event-list.component.css']
})

export class AdminCampusEventListComponent extends GenericListComponent<CampusEventResponse> implements OnInit {

  programId: number;
  program: Program;

  constructor(
    private readonly eventService: EventService,
    private readonly programService: ProgramService,
    protected readonly route: ActivatedRoute,
    protected readonly location: Location,
    protected readonly router: Router,
  ) {
    super(route, router, location);
  } 

  getResults(offset: number, limit: number) {
    const extraParams = new Map();
    extraParams.set('program', this.programId);
    return this.eventService.getCampusEvents({offset, limit, extraParams});
  }

  ngOnInit() {
    this.route.queryParams.subscribe(queryParams => {
      this.programId = queryParams.program_id;
      this.programService.getProgram(Number(this.programId)).subscribe(program=> {
        this.program = program;
        console.log(this.program);
      });
  });
  super.ngOnInit();
  }

}
