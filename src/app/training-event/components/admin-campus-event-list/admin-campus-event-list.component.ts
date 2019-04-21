import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { CampusEvent } from 'src/app/shared/interfaces/event';
import { EventService  } from '../../services/event.service';
import { ProgramService } from '../../../training-program/services/program.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GenericListComponent } from 'src/app/shared/generics/generic-list/generic-list';
import { Program } from 'src/app/shared/interfaces/program';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-admin-campus-event-list',
  templateUrl: './admin-campus-event-list.component.html',
  styleUrls: ['./admin-campus-event-list.component.css']
})

export class AdminCampusEventListComponent extends GenericListComponent<CampusEvent> implements OnInit {

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

  navigateToProgramDetail() {
    this.router.navigate(['/admin/event-management/programs', this.programId]);
  }

  navigateToCreateForm() {
    this.router.navigate(['/admin/event-management/programs/events/event-form'], { queryParams: {program_id: this.programId}});
  }


  ngOnInit() {
    this.route.queryParams.pipe(
      switchMap(queryParams => {
        this.programId = queryParams.program_id;
        return this.programService.getProgram(Number(this.programId));
      })
    ).subscribe(program => {
      this.program = program;
    });
    super.ngOnInit();
  }

}
