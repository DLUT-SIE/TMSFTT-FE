import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { RecordResponse } from 'src/app/interfaces/record';

/** Display a record review page in detail. */
@Component({
  selector: 'app-data-review',
  templateUrl: './data-review.component.html',
  styleUrls: ['./data-review.component.css']
})
export class DataReviewComponent implements OnInit {
  /** The data to be displayed. */
  record: RecordResponse;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly location: Location,
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: { record: RecordResponse}) => {
      this.record = data.record;
    });
  }

  goBack(): void {
    this.location.back();
  }

}
