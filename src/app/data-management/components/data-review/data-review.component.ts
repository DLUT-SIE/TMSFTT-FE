import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { RecordResponse } from 'src/app/shared/interfaces/record';
import { ReviewNoteService } from '../../services/review-note.service';
import { ReviewNoteResponse } from 'src/app/shared/interfaces/review-note';
import { GenericListComponent } from 'src/app/shared/generics/generic-list/generic-list';

/** Display a record review page in detail. */
@Component({
  selector: 'app-data-review',
  templateUrl: './data-review.component.html',
  styleUrls: ['./data-review.component.css']
})
export class DataReviewComponent extends GenericListComponent<ReviewNoteResponse> implements OnInit {
  /** The data to be displayed. */
  record: RecordResponse;

  constructor(
    protected readonly route: ActivatedRoute,
    protected readonly router: Router,
    protected readonly reviewnoteService: ReviewNoteService,
  ) {
    super(route, router);
  }

  getResults(offset: number, limit: number) {
    const extraParams = new Map();
    extraParams.set('record', this.record.id);
    extraParams.set('user', this.record.user);
    return this.reviewnoteService.getReviewNotes({offset, limit, extraParams});
  }

  ngOnInit() {
    this.route.data.subscribe((data: { record: RecordResponse}) => {
      this.record = data.record;
    });
    super.ngOnInit();
  }

}
