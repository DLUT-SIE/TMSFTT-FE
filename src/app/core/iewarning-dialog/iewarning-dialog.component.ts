import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-iewarning-dialog',
  templateUrl: './iewarning-dialog.component.html',
  styleUrls: ['./iewarning-dialog.component.css']
})
export class IEWarningDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<IEWarningDialogComponent>,
  ) { }

  close() {
    this.dialogRef.close();
  }

}
