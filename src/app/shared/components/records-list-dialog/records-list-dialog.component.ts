import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CampusEvent } from '../../interfaces/event';
import { User } from '../../interfaces/user';
import { Record } from '../../interfaces/record';

@Component({
  selector: 'app-records-list-dialog',
  templateUrl: './records-list-dialog.component.html',
  styleUrls: ['./records-list-dialog.component.css']
})
export class RecordsListDialogComponent {

  constructor(
    readonly dialogRef: MatDialogRef<RecordsListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {records: Record[], event: CampusEvent},
  ) { }

  // tslint:disable-next-line:no-any
  asUser(obj: any): User {
    return obj;
  }

}
