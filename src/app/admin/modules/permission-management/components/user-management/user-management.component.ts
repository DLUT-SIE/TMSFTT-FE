import { Component, OnInit } from '@angular/core';
import { of as observableOf, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Department } from 'src/app/shared/interfaces/department';
import { User } from 'src/app/shared/interfaces/user';
import { Group } from 'src/app/shared/interfaces/group';
import { UserService } from 'src/app/shared/services/user.service';
import { PaginatedResponse } from 'src/app/shared/interfaces/paginated-response';
import { GroupService } from 'src/app/admin/modules/permission-management/services/group.service';

/** UserManagementComponent allows admins manage users' accounts, permissions. */
@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  username = '';
  user: User = null;
  isLoading = false;
  errorMessage = '';
  groups: Group[] = [];

  constructor(
    private readonly userService: UserService,
    private readonly groupService: GroupService,
  ) { }

  ngOnInit() {
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
    });
  }
}
