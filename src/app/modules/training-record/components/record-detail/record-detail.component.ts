import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RecordResponse } from 'src/app/interfaces/record';

@Component({
  selector: 'app-record-detail',
  templateUrl: './record-detail.component.html',
  styleUrls: ['./record-detail.component.css']
})
export class RecordDetailComponent implements OnInit {
  /** The data to be displayed. */
  record: RecordResponse;

  constructor(
    private readonly route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: { record: RecordResponse}) => {
      this.record = data.record;
    });
  }

}
