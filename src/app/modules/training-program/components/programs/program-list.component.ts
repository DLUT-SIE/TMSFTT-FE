import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Program } from 'src/app/interfaces/program';
import { ProgramService} from '../../services/program.service';
import { GenericListComponent } from 'src/app/generics/generic-list/generic-list';

@Component({
  selector: 'app-program-list',
  templateUrl: './program-list.component.html',
  styleUrls: ['./program-list.component.css']
})
export class ProgramListComponent extends GenericListComponent<Program> {
  constructor(
    protected readonly route: ActivatedRoute,
    protected readonly router: Router,
    private readonly programService: ProgramService,
  ) {
    super(route, router);
  }


  getResults(offset: number, limit: number) {
    return this.programService.getPrograms(offset, limit);
  }

}

