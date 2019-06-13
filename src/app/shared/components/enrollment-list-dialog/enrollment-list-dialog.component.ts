import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Enrollment } from '../../interfaces/enrollment';
import { CampusEvent } from '../../interfaces/event';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-enrollment-list-dialog',
  templateUrl: './enrollment-list-dialog.component.html',
  styleUrls: ['./enrollment-list-dialog.component.css']
})
export class EnrollmentListDialogComponent {

  constructor(
    readonly dialogRef: MatDialogRef<EnrollmentListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {enrollments: Enrollment[], event: CampusEvent},
  ) { }

  // tslint:disable-next-line:no-any
  asUser(obj: any): User {
    return obj;
  }

}
