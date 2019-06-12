import { Component } from '@angular/core';

import { RecordService } from 'src/app/shared/services/records/record.service';
import { MatSnackBar } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { errorProcess } from 'src/app/shared/utils/error-process';

interface FileChangeEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

@Component({
  selector: 'app-batch-submit',
  templateUrl: './batch-submit.component.html',
  styleUrls: ['./batch-submit.component.css']
})
export class BatchSubmitComponent {

  file: File;
  count: number;
  hasCreateSucceed: boolean;
  isLoading = false;

  constructor(
    private readonly recordService: RecordService,
    private readonly snackBar: MatSnackBar,
  ) { }

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
        const message = errorProcess(error);
        this.snackBar.open(message, '关闭');
        this.isLoading = false;
      });
  }
}
