import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Program } from 'src/app/shared/interfaces/program';

@Component({
  selector: 'app-program-detail',
  templateUrl: './program-detail.component.html',
  styleUrls: ['./program-detail.component.css']
})
export class ProgramDetailComponent implements OnInit {

  program: Program;

  constructor(
    private readonly route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: { program: Program}) => {
      this.program = data.program;
    });
  }

}
