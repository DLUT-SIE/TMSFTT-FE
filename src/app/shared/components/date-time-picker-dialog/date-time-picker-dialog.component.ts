import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-date-time-picker-dialog',
  templateUrl: './date-time-picker-dialog.component.html',
  styleUrls: ['./date-time-picker-dialog.component.css']
})
export class DateTimePickerDialogComponent {
  selectedDate: string;

  readonly datePipe: DatePipe = new DatePipe('zh-Hans');

  constructor(
    public dialogRef: MatDialogRef<DateTimePickerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {}) { }

  closeWithDate() {
    if (!this.selectedDate) {
      this.dialogRef.close();
    }
    const val = this.datePipe.transform(this.selectedDate, 'yyyy年MM月dd日 HH:mm:ss');
    this.dialogRef.close(val);
  }

}
