import { Component, OnInit } from '@angular/core';

import { RecordService } from 'src/app/shared/services/records/record.service';
import { MatSnackBar } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { errorProcess } from 'src/app/shared/utils/error-process';
import { CampusEvent } from 'src/app/shared/interfaces/event';

interface FileChangeEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

@Component({
  selector: 'app-batch-submit',
  templateUrl: './batch-submit.component.html',
  styleUrls: ['./batch-submit.component.css']
})
export class BatchSubmitComponent implements OnInit {

  file: File;
  count: number;
  hasCreateSucceed: boolean;
  isLoading = false;
  events: CampusEvent[];

  constructor(
    private readonly recordService: RecordService,
    private readonly snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.recordService.getRecentEventsHaveRecords().subscribe(
      data => this.events = data
    );
  }

  /** Append file to attachments when encountered a change event. */
  onFileSlect(event: FileChangeEvent) {
    this.file = event.target.files[0];
    this.hasCreateSucceed = false;
  }

  uploadFile() {
    this.isLoading = true;
    this.recordService.batchSubmitRecord(this.file).subscribe(
      response => {
        this.count = response.count;
        this.hasCreateSucceed = true;
        this.isLoading = false;
      },
      (error: HttpErrorResponse) => {
        this.isLoading = false;
        const message = errorProcess(error);
        this.snackBar.open(message, '关闭');
      });
  }
}
