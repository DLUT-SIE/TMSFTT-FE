import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-idlewarning-dialog',
  templateUrl: './idlewarning-dialog.component.html',
  styleUrls: ['./idlewarning-dialog.component.css']
})
export class IdleWarningDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<IdleWarningDialogComponent>,
  ) { }

  close() {
    this.dialogRef.close();
  }

}
