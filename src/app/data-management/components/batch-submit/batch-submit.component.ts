import { Component } from '@angular/core';

import { RecordService } from 'src/app/training-record/services/record.service';
import { MatSnackBar } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';

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
  flag: boolean;

  constructor(
    private readonly recordService: RecordService,
    private readonly snackBar: MatSnackBar,
  ) { }

  /** Append file to attachments when encountered a change event. */
  onFileSlect(event: FileChangeEvent) {
    this.file = event.target.files[0];
    this.flag = false;
  }

  uploadFile() {
    this.recordService.batchSubmitRecord(this.file).subscribe(
      response => {
        this.count = response.count;
        this.flag = true;
      },
      (error: HttpErrorResponse) => {
        let message = error.message;
        if (error.error) {
          message = error.error['detail'] + '。';
        }
        this.snackBar.open(message, '关闭');
      });
  }
}
