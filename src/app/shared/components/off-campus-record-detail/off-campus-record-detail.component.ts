import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';

import { Record } from 'src/app/shared/interfaces/record';
import { ReviewNoteService } from 'src/app/data-management/services/review-note.service';
import { ReviewNote } from 'src/app/shared/interfaces/review-note';
import { GenericListComponent } from 'src/app/shared/generics/generic-list/generic-list';

@Component({
  selector: 'app-off-campus-record-detail',
  templateUrl: './off-campus-record-detail.component.html',
  styleUrls: ['./off-campus-record-detail.component.css']
})
export class OffCampusRecordDetailComponent extends GenericListComponent<ReviewNote> implements OnInit {
  /** The data to be displayed. */
  @Input() record: Record;
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
    .subscribe(() => {
      this.forceRefresh();
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
    this.route.data.subscribe((data: { record: Record}) => {
      this.record = data.record;
    });
    super.ngOnInit();
  }
}
