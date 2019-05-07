import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { User } from 'src/app/shared/interfaces/user';
import { UserService } from 'src/app/shared/services/user.service';
import { of as observableOf, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { PaginatedResponse } from 'src/app/shared/interfaces/paginated-response';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-adduser-dialog',
  templateUrl: './adduser-dialog.component.html',
  styleUrls: ['./adduser-dialog.component.css']
})
export class AdduserDialogComponent {

  username = '';
  user: User = null;
  isLoading = true;
  errorMessage = '';

  constructor(
    private readonly userService: UserService,
    public dialogRef: MatDialogRef<AdduserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {username: string},
  ) {}


  private reset() {
    this.errorMessage = '';
    this.user = null;
    this.isLoading = true;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  retrieveUser() {
    this.reset();
    // First, look up the user by username
    this.userService.getUserByUsername(this.username).pipe(
      switchMap((res: PaginatedResponse<User>) => {
        if (res.count !== 1) {
          return throwError({message : '系统中无此用户!'});
        }
        this.user = res.results[0];
        return observableOf([]);
      }),
      catchError((err: HttpErrorResponse) => {
        this.errorMessage = err.message;
        return observableOf([]);
      }),
    ).subscribe(() => {
      this.isLoading = false;
    });
  }
}
