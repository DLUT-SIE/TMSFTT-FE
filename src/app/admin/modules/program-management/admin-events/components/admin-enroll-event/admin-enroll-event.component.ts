import { Component, OnInit } from '@angular/core';
import { of as observableOf, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from 'src/app/shared/interfaces/user';
import { Group } from 'src/app/shared/interfaces/group';
import { UserService } from 'src/app/shared/services/user.service';
import { PaginatedResponse } from 'src/app/shared/interfaces/paginated-response';
import { GroupService } from 'src/app/admin/modules/permission-management/services/group.service';
import { Location } from '@angular/common';
import { EventService } from 'src/app/shared/services/events/event.service';
import { ActivatedRoute } from '@angular/router';
import { errorProcess } from 'src/app/shared/utils/error-process';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-admin-enroll-event',
  templateUrl: './admin-enroll-event.component.html',
  styleUrls: ['./admin-enroll-event.component.css']
})
export class AdminEnrollEventComponent implements OnInit {
  username = '';
  user: User = null;
  isLoading = false;
  errorMessage = '';
  groups: Group[] = [];
  event_id: number;

  constructor(
    readonly location: Location,
    private readonly userService: UserService,
    private readonly groupService: GroupService,
    private readonly eventService: EventService,
    // private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.event_id = this.route.snapshot.queryParams.event_id;
    console.log(this.event_id);
  }

  private reset() {
    this.errorMessage = '';
    this.user = null;
    this.groups = [];
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
        if (this.user.groups.length === 0) return observableOf([]);
        return this.groupService.getGroupsByIds(this.user.groups);
      }),
      map((groups: Group[]) => {
        this.groups = groups;
      }),
      catchError((err: HttpErrorResponse) => {
        this.errorMessage = err.message;
        return observableOf([]);
      }),
    ).subscribe(() => {
      this.isLoading = false;
      console.log(this.user.id);
    });
  }

  enrollEvent(){
    // this.isLoading = true;
    console.log(this.user.id);
    this.eventService.enrollCampusEventByUser(this.event_id, this.user.id).subscribe(
      (data) => {
        this.snackBar.open('报名成功!', '关闭', {duration: 3000});
        // this.event.enrollment_id = data.id;
        // this.event.enrolled = true;
        // this.isLoading = false;
      },
      (error: HttpErrorResponse) => {
        const message = errorProcess(error);
        this.snackBar.open(message, '关闭', {duration: 3000});
        // this.isLoading = false;
      });
  }

}
