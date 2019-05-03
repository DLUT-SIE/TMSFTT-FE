import { Component, OnInit, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';

import { Record } from 'src/app/shared/interfaces/record';
import { RecordService } from 'src/app/shared/services/records/record.service';
import { AuthService, AUTH_SERVICE } from 'src/app/shared/interfaces/auth-service';

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
    protected readonly recordService: RecordService,
    protected readonly snackBar: MatSnackBar,
    @Inject(AUTH_SERVICE) private readonly authService: AuthService,
  ) { }

  statuschange(is_approved: boolean) {
    const isDepartmentAdmin = this.authService.isDepartmentAdmin;
    const isSchoolAdmin = this.authService.isSchoolAdmin;
    this.recordService.updateRecordStatus(this.record, is_approved, isDepartmentAdmin, isSchoolAdmin)
    .subscribe(() => {
      this.snackBar.open('状态已更改！', '关闭');
      },
      (error: HttpErrorResponse) => {
        let message = error.message;
        if (error.error) {
          message = '更改失败！';
        }
        this.snackBar.open(message, '关闭');
      }
    );
  }


  ngOnInit() {
    this.route.data.subscribe((data: { record: Record}) => {
      this.record = data.record;
    });
  }

}
