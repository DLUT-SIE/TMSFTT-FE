import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { Program } from 'src/app/shared/interfaces/program';

@Component({
  selector: 'app-admin-program-detail',
  templateUrl: './admin-program-detail.component.html',
  styleUrls: ['./admin-program-detail.component.css']
})
export class AdminProgramDetailComponent implements OnInit {

  program: Program;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    readonly location: Location,
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: { program: Program }) => {
      this.program = data.program;
    });
  }

  navigateToChangeProgram() {
    this.router.navigate(['/admin/programs/form'], { queryParams: {program_id: this.program.id}});
  }

}
