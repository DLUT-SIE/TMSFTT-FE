import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { Location } from '@angular/common';

import { RecordService } from 'src/app/shared/services/records/record.service';
import { Record } from 'src/app/shared/interfaces/record';
import { RecordStatus } from 'src/app/shared/enums/record-status.enum';
import { FeedbackDialogComponent } from '../feedback-dialog/feedback-dialog.component';
import { isString } from 'util';

/** Display a record in detail. */
@Component({
  selector: 'app-record-detail',
  templateUrl: './record-detail.component.html',
  styleUrls: ['./record-detail.component.css']
})
export class RecordDetailComponent implements OnInit {
  /** The data to be displayed. */
  record: Record;
  isCampusEventRecord: boolean;
  hasFeedbackSent: boolean;
  editable: boolean;
  readonly editableStatus = new Set([RecordStatus.STATUS_SUBMITTED,
                                     RecordStatus.STATUS_FACULTY_ADMIN_REVIEWED,
                                     RecordStatus.STATUS_DEPARTMENT_ADMIN_REJECTED,
                                     RecordStatus.STATUS_SCHOOL_ADMIN_REJECTED]);

  constructor(
    readonly location: Location,
    private readonly route: ActivatedRoute,
    protected readonly router: Router,
    private readonly recordService: RecordService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    /** The record in this component will subscribe to Record data returned by route. */
    this.route.data.subscribe((data: { record: Record }) => {
      this.record = data.record;
      this.isCampusEventRecord = Boolean(this.record.campus_event);
      this.hasFeedbackSent = this.record.status === RecordStatus.STATUS_FEEDBACK_SUBMITED;
      this.editable = this.editableStatus.has(this.record.status);
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(FeedbackDialogComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (isString(result)) {
        this.recordService.createFeedback(this.record.id, result).subscribe(() => {
          this.hasFeedbackSent = true;
        });
      } else {}
    });
  }

  navigateToForm() {
    this.router.navigate(['/user/off-campus-event-records/form'], { queryParams: { record_id: this.record.id } });
  }

}
