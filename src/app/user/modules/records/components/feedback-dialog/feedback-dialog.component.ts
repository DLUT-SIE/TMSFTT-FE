import { Component} from '@angular/core';
import { MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-feedback-dialog',
  templateUrl: './feedback-dialog.component.html',
  styleUrls: ['./feedback-dialog.component.css']
})
export class FeedbackDialogComponent {
  data: string;

  constructor(
    public dialogRef: MatDialogRef<FeedbackDialogComponent>,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
