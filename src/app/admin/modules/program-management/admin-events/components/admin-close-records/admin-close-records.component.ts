import { Component, OnInit } from '@angular/core';
import { of as observableOf, throwError } from 'rxjs';
import { catchError, switchMap} from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from 'src/app/shared/interfaces/user';
import { UserService } from 'src/app/shared/services/user.service';
import { PaginatedResponse } from 'src/app/shared/interfaces/paginated-response';
import { Location } from '@angular/common';
import { RecordService } from 'src/app/shared/services/records/record.service';
import { ActivatedRoute } from '@angular/router';
import { errorProcess } from 'src/app/shared/utils/error-process';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-admin-close-records',
  templateUrl: './admin-close-records.component.html',
  styleUrls: ['./admin-close-records.component.css']
})
export class AdminCloseRecordsComponent implements OnInit {
  username = '';
  user: User = null;
  isLoading = false;
  errorMessage = '';
  eventId: number;


  constructor(
    readonly location: Location,
    private readonly userService: UserService,
    private readonly recordService: RecordService,
    private readonly snackBar: MatSnackBar,
    private readonly route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.eventId = this.route.snapshot.queryParams.event_id;
  }

  private reset() {
    this.errorMessage = '';
    this.user = null;
    this.isLoading = true;
  }

  /** Retrieve user permissions and populate the permissions table. */
  retrieveUserPermissions() {
    this.reset();
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

  closeRecord() {
    this.isLoading = true;
    this.recordService.forceCloseRecord(this.eventId, this.user.id).subscribe(
      () => {
        this.snackBar.open('关闭记录成功!', '关闭', {duration: 3000});
        this.isLoading = false;
      },
      (error: HttpErrorResponse) => {
        const message = errorProcess(error);
        this.snackBar.open(message, '关闭', {duration: 3000});
        this.isLoading = false;
      });
  }

}

