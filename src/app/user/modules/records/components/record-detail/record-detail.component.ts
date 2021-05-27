import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { Location } from '@angular/common';

import { RecordService } from 'src/app/shared/services/records/record.service';
import { Record } from 'src/app/shared/interfaces/record';
import { FeedbackDialogComponent } from '../feedback-dialog/feedback-dialog.component';
import { CampusEventFeedback } from 'src/app/shared/interfaces/campus-event-feedback';

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
      this.editable = this.record.allow_actions_from_user;
      this.hasFeedbackSent = !!this.record.feedback;
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(FeedbackDialogComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.validate(result)) {
        result.record = this.record.id;
        this.recordService.createFeedback(result).subscribe(() => {
          this.hasFeedbackSent = true;
        });
      }
    });
  }

  navigateToForm() {
    this.router.navigate(['/user/off-campus-event-records/form'], { queryParams: { record_id: this.record.id } });
  }

  validate(data: CampusEventFeedback): boolean {
    if (data.inspiring_level === null ||
        data.profits === [] ||
        data.content === null ||
        data.willingness_level === null ||
        data.content === '') {
          return false;
    }
    if (data.inspiring_level === 2 && (data.inspiring_less_reason === '' || data.inspiring_less_reason === null)) {
      return false;
    }
    if (data.profits.includes(5) && (data.profit_other === '' || data.profit_other === null)) {
      return false;
    }
    return true;
  }

}
