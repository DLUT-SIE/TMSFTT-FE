import { Component, OnInit } from '@angular/core';
import { ProgramService } from 'src/app/shared/services/programs/program.service';
import { Program } from 'src/app/shared/interfaces/program';
import { switchMap } from 'rxjs/operators';
import { EventListType } from 'src/app/shared/enums/event-list-type.enum';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-campus-event-list',
  templateUrl: './admin-campus-event-list.component.html',
  styleUrls: ['./admin-campus-event-list.component.css']
})

export class AdminCampusEventListComponent implements OnInit {

  programId: number;
  program: Program;
  eventListType: EventListType = EventListType.ADMIN;

  constructor(
    private readonly programService: ProgramService,
    protected readonly route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.route.queryParams.pipe(
      switchMap(queryParams => {
        this.programId = queryParams.program_id;
        return this.programService.getProgram(Number(this.programId));
      })
    ).subscribe(program => {
      this.program = program;
    });
  }

}
