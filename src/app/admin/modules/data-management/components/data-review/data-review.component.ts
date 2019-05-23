import { Component, OnInit, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';

import { Record } from 'src/app/shared/interfaces/record';
import { RecordService } from 'src/app/shared/services/records/record.service';
import { AuthService, AUTH_SERVICE } from 'src/app/shared/interfaces/auth-service';
import { RecordStatus } from 'src/app/shared/enums/record-status.enum';

/** Display a record review page in detail. */
@Component({
  selector: 'app-data-review',
  templateUrl: './data-review.component.html',
  styleUrls: ['./data-review.component.css']
})
export class DataReviewComponent implements OnInit {
  /** The data to be displayed. */
  record: Record;
  isAllowed: boolean;

  constructor(
    protected readonly route: ActivatedRoute,
    protected readonly router: Router,
    readonly location: Location,
    protected readonly recordService: RecordService,
    protected readonly snackBar: MatSnackBar,
    @Inject(AUTH_SERVICE) private readonly authService: AuthService,
  ) { }

  changeStatus(isApproved: boolean) {
    const isDepartmentAdmin = this.authService.isDepartmentAdmin;
    this.recordService.updateRecordStatus(this.record.id, isApproved, isDepartmentAdmin)
    .subscribe(() => {
      this.snackBar.open('操作成功！', '关闭');
      this.router.navigate(['..'], {
        relativeTo: this.route,
      });
      },
      (error: HttpErrorResponse) => {
        let message = error.message;
        if (error.error) {
          message = '操作失败！';
        }
        this.snackBar.open(message, '关闭');
      }
    );
  }

  closeRecord() {
    this.recordService.closeRecord(this.record.id)
    .subscribe(() => {
      this.snackBar.open('操作成功！', '关闭');
      this.router.navigate(['..'], {
        relativeTo: this.route,
      });
      },
      (error: HttpErrorResponse) => {
        let message = error.message;
        if (error.error) {
          message = '操作失败！';
        }
        this.snackBar.open(message, '关闭');
      }
    );
  }

  ngOnInit() {
    this.route.data.subscribe((data: { record: Record}) => {
      this.record = data.record;
      const recordStatus = data.record.status;
      this.isAllowed = (!(recordStatus === RecordStatus.STATUS_CLOSED)) && (
        (this.authService.isDepartmentAdmin && (recordStatus === RecordStatus.STATUS_SUBMITTED)) ||
        (this.authService.isSchoolAdmin && (recordStatus === RecordStatus.STATUS_FACULTY_ADMIN_REVIEWED))
      );
    });
  }

}
