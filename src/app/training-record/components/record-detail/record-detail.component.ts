import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';

import { RecordService } from 'src/app/training-record/services/record.service';
import { RecordResponse } from 'src/app/shared/interfaces/record';
import { RecordStatus } from 'src/app/shared/enums/record-status.enum';
import { FeedbackDialogComponent } from '../feedback-dialog/feedback-dialog.component';


/** Display a record in detail. */
@Component({
  selector: 'app-record-detail',
  templateUrl: './record-detail.component.html',
  styleUrls: ['./record-detail.component.css']
})
export class RecordDetailComponent implements OnInit {
  /** The data to be displayed. */
  record: RecordResponse;
  isCampusEventRecord: boolean;
  isFeedBacked: boolean;
  feedback: string;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly recordService: RecordService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    /** The record in this component will subscribe to RecordResponse data returned by route. */
    this.route.data.subscribe((data: { record: RecordResponse }) => {
      this.record = data.record;
      this.isCampusEventRecord = Boolean(this.record.campus_event);
      this.isFeedBacked = this.record.status === RecordStatus.STATUS_WITH_FEEDBACK;

    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(FeedbackDialogComponent, {
      width: '250px',
      data: {feedback: this.feedback},
    });

    dialogRef.afterClosed().subscribe(result => {
      this.recordService.createFeedback(this.record.id, result).subscribe(() => {
        this.isFeedBacked = true;
      });
    });
  }


}
