import { Component, OnInit, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';

import { Record } from 'src/app/shared/interfaces/record';
import { RecordService } from 'src/app/shared/services/records/record.service';
import { AuthService, AUTH_SERVICE } from 'src/app/shared/interfaces/auth-service';
import { errorProcess } from 'src/app/shared/utils/error-process';

/** Display a record review page in detail. */
@Component({
  selector: 'app-data-review',
  templateUrl: './data-review.component.html',
  styleUrls: ['./data-review.component.css']
})
export class DataReviewComponent implements OnInit {
  /** The data to be displayed. */
  record: Record;
  adminAllowed: boolean;

  constructor(
    protected readonly route: ActivatedRoute,
    protected readonly router: Router,
    readonly location: Location,
    protected readonly recordService: RecordService,
    protected readonly snackBar: MatSnackBar,
    @Inject(AUTH_SERVICE) private readonly authService: AuthService,
  ) { }

  changeStatus(isApproved: boolean) {
    const isSchoolAdmin = this.authService.isSchoolAdmin;
    this.recordService.updateRecordStatus(this.record.id, isApproved, isSchoolAdmin)
    .subscribe(() => {
      this.snackBar.open('操作成功！', '关闭');
      this.adminAllowed = false;
      },
      (error: HttpErrorResponse) => {
        const message = errorProcess(error);
        this.snackBar.open(message, '关闭');
      }
    );
  }

  closeRecord() {
    this.recordService.closeRecord(this.record.id)
    .subscribe(() => {
      this.snackBar.open('操作成功！', '关闭');
      this.adminAllowed = false;
      },
      (error: HttpErrorResponse) => {
        const message = errorProcess(error);
        this.snackBar.open(message, '关闭');
      }
    );
  }

  ngOnInit() {
    this.route.data.subscribe((data: { record: Record}) => {
      this.record = data.record;
      this.adminAllowed = data.record.allow_actions_from_admin;
    });
  }

}
