import { Component, OnInit, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';

import { RecordResponse } from 'src/app/shared/interfaces/record';
import { ReviewNoteService } from '../../services/review-note.service';
import { RecordService } from 'src/app/training-record/services/record.service';
import { ReviewNoteResponse } from 'src/app/shared/interfaces/review-note';
import { AUTH_SERVICE, AuthService } from 'src/app/shared/interfaces/auth-service';
import { RecordStatus } from 'src/app/shared/enums/record-status.enum';
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
    protected readonly recordService: RecordService,
    protected readonly snackBar: MatSnackBar,
    @Inject(AUTH_SERVICE) private readonly authService: AuthService,
  ) {
    super(route, router, location);
  }

  getResults(offset: number, limit: number) {
    const extraParams = new Map();
    extraParams.set('record', this.record.id);
    extraParams.set('user', this.record.user);
    return this.reviewnoteService.getReviewNotes({offset, limit, extraParams});
  }

  /** Submit review note created by admins. */
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

  /** Allow admins to change record status. */
  statuschange(message: string) {
    const prestatus = this.record.status;
    const isDepartmentAdmin = this.authService.isDepartmentAdmin;
    const isSuperAdmin = this.authService.isSuperAdmin;
    if (isDepartmentAdmin) {
      if (message === '通过') {
        if (prestatus === RecordStatus.STATUS_SUBMITTED) {
          this.record.status = RecordStatus.STATUS_FACULTY_ADMIN_REVIEWED;
          message = '培训记录合格，已通过审核！';
        } else {
          message = '无权更改！';
        }
      } else {
        if (prestatus === RecordStatus.STATUS_SUBMITTED) {
          this.record.status = RecordStatus.STATUS_SUBMITTED;
          message = '培训记录不合格，未通过审核！';
        } else {
          message = '无权更改！';
        }
      }
    }
    if (isSuperAdmin) {
      if (message === '通过') {
        if (prestatus === RecordStatus.STATUS_FACULTY_ADMIN_REVIEWED) {
          this.record.status = RecordStatus.STATUS_SCHOOL_ADMIN_REVIEWED;
          message = '培训记录合格，已通过审核！';
        } else {
          message = '无权更改！';
        }
      } else {
        if (prestatus === RecordStatus.STATUS_FACULTY_ADMIN_REVIEWED) {
          this.record.status = RecordStatus.STATUS_SUBMITTED;
          message = '培训记录不合格，未通过审核！';
        } else {
          message = '无权更改！';
        }
      }
    }
    if (prestatus !== this.record.status) {
      this.recordService.updateRecordStatus(this.record.id, this.record.status)
      .subscribe(record => this.record = record);
      this.snackBar.open(message, '关闭');
    } else {
      this.snackBar.open(message, '关闭');
    }
  }

  ngOnInit() {
    this.route.data.subscribe((data: { record: RecordResponse}) => {
      this.record = data.record;
    });
    super.ngOnInit();
  }

}
