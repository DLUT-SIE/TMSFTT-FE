import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';

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
  reviewnotecontent: string;

  constructor(
    protected readonly route: ActivatedRoute,
    protected readonly router: Router,
    protected readonly location: Location,
    protected readonly reviewnoteService: ReviewNoteService,
    protected readonly snackBar: MatSnackBar,
  ) {
    super(route, router, location);
  }

  getResults(offset: number, limit: number) {
    const extraParams = new Map();
    extraParams.set('record', this.record.id);
    extraParams.set('user', this.record.user);
    return this.reviewnoteService.getReviewNotes({offset, limit, extraParams});
  }

  onSubmit() {
    this.reviewnoteService.createReviewNote(this.record, this.reviewnotecontent)
    .subscribe(res => {
      this.results.push(res);
      this.resultsLength = this.results.length;
      },
      (error: HttpErrorResponse) => {
        let message = error.message;
        if (error.error) {
          message = '';
          for (const key of Object.keys(error.error)) {
            message += error.error[key].join(',') + '。';
          }
        }
        this.snackBar.open(message, '创建失败！');
      }
    );
  }

  ngOnInit() {
    this.route.data.subscribe((data: { record: RecordResponse}) => {
      this.record = data.record;
    });
    super.ngOnInit();
  }

}
