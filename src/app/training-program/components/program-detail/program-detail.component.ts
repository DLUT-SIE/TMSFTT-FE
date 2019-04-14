import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { Program } from 'src/app/shared/interfaces/program';
import { ProgramForm } from 'src/app/shared/interfaces/program-form';

@Component({
  selector: 'app-program-detail',
  templateUrl: './program-detail.component.html',
  styleUrls: ['./program-detail.component.css']
})
export class ProgramDetailComponent implements OnInit {

  program: Program;
  programForms: ProgramForm[] = [];

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: { program: Program}) => {
      this.program = data.program;
    });
  }

  navigateToChangeProgram() {
    this.router.navigate(['/admin/event-management/programs/program-form'], { queryParams: {program_id: this.program.id}});
  }

}
