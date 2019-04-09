import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { RecordService } from 'src/app/training-record/services/record.service';
import { RecordResponse } from 'src/app/shared/interfaces/record';
import { RecordStatus } from 'src/app/shared/enums/record-status.enum';


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
  feedback = new FormControl('',[Validators.maxLength(200)]);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly recordService: RecordService,
  ) { }

  ngOnInit() {
    /** The record in this component will subscribe to RecordResponse data returned by route. */
    this.route.data.subscribe((data: { record: RecordResponse }) => {
      this.record = data.record;
      this.isCampusEventRecord = Boolean(this.record.campus_event);
      this.isFeedBacked = this.record.status == RecordStatus.STATUS_WITH_FEEDBACK;

    });
  }

  feedBack() {
    this.recordService.feedBack(this.record.id, this.feedback.value).subscribe(() => {
      this.isFeedBacked = true;
    });
  }

}
