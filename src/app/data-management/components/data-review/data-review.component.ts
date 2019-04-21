import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { Record } from 'src/app/shared/interfaces/record';

/** Display a record review page in detail. */
@Component({
  selector: 'app-data-review',
  templateUrl: './data-review.component.html',
  styleUrls: ['./data-review.component.css']
})
export class DataReviewComponent implements OnInit {
  /** The data to be displayed. */
  record: Record;

  constructor(
    protected readonly route: ActivatedRoute,
    readonly location: Location,
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: { record: Record}) => {
      this.record = data.record;
    });
  }

}
