import { Component, OnInit } from '@angular/core';
import { UserPermission, UserPermissionStatus, Permission } from 'src/app/shared/interfaces/permission';
import { MatSnackBar } from '@angular/material';
import { PermissionService } from 'src/app/shared/services/permission.service';
import { of as observableOf, zip, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Department } from 'src/app/shared/interfaces/department';
import { User } from 'src/app/shared/interfaces/user';
import { Group } from 'src/app/shared/interfaces/group';
import { UserService } from 'src/app/shared/services/user.service';
import { PaginatedResponse } from 'src/app/shared/interfaces/paginated-response';
import { DepartmentService } from 'src/app/shared/services/department.service';
import { GroupService } from 'src/app/permission-management/services/group.service';

/** UserManagementComponent allows admins manage users' accounts, permissions. */
@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  username = '';
  user: User = null;
  department: Department = null;
  isLoading = false;
  errorMessage = '';
  groups: Group[] = [];
  /** The permissions the selected user currently have. */
  originalPermissions: UserPermissionStatus[] = [];
  /** The permissions that should be after the change. */
  newPermissions: UserPermissionStatus[] = [];

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly userService: UserService,
    private readonly departmentService: DepartmentService,
    private readonly permissionService: PermissionService,
    private readonly groupService: GroupService,
  ) { }

  ngOnInit() {
  }

  private reset() {
    this.errorMessage = '';
    this.originalPermissions = [];
    this.user = null;
    this.groups = [];
    this.newPermissions = [];
    this.department = null;
    this.isLoading = true;
  }

  /** Retrieve user permissions and populate the permissions table. */
  retrieveUserPermissions() {
    this.reset();
    // First, look up the user by username
    this.userService.getUserByUsername(this.username).pipe(
      switchMap((res: PaginatedResponse<User>) => {
        if (res.count !== 1) {
          return throwError({message : '系统中无此用户!'});
        }
        this.user = res.results[0];
        return this.departmentService.getDepartment(this.user.department);
      }),
      map((department: Department) => {
        this.department = department;
      }),
      switchMap(() => {
        const _group = this.user.groups.map(
          x => this.groupService.getGroupById(x));
        if (_group.length === 0) return observableOf([]);
        return zip(..._group);
      }),
      map((groups: Group[]) => {
        this.groups = groups;
      }),
      switchMap(() => {
        return zip(
          this.permissionService.getPermissions(),
          this.permissionService.getUserPermissions(this.user.id),
        );
      }),
      /** Finally, Return user's permission status against all permissions. */
      map((val: [Permission[], UserPermission[]], index: number) => {
        // All permissions, Map<permission id, Permission>
        const permissions = new Map<number, Permission>();
        val[0].map(x => permissions.set(x.id, x));
        // User permissions, Map<permission id, UserPermission>;
        const userPermissions = new Map<number, UserPermission>();
        val[1].map(x => userPermissions.set(x.permission, x));
        return val[0].map(x => {
          const perm = userPermissions.get(x.id);
          const userPermissionId = perm ? perm.id : undefined;
          return {
            id: userPermissionId,
            user: this.user.id,
            permission: x,
            hasPermission: userPermissionId !== undefined,
          };
        }).sort((x, y) => x.permission.id - y.permission.id);
      }),
      catchError((err: HttpErrorResponse) => {
        this.errorMessage = err.message;
        return observableOf([]);
      }),
    ).subscribe((permissions: UserPermissionStatus[]) => {
      this.originalPermissions = permissions;
      /** Deepcopy permission items. */
      this.newPermissions = permissions.map(x => Object.assign({}, x));
      this.isLoading = false;
    });
  }

  /**
   * Populate what permissions we want to update,
   * skip permissions with no change.
   */
  private diffPermissions(): [UserPermission[], number[]] {
    const toBeCreated: UserPermission[] = [];
    const toBeDeleted: number[] = [];

    for (let i = 0; i < this.originalPermissions.length; i++) {
      const originalPerm = this.originalPermissions[i];
      const newPerm = this.newPermissions[i];
      if (originalPerm.hasPermission !== newPerm.hasPermission) {
        if (newPerm.hasPermission === true) {
          toBeCreated.push({ user: newPerm.user, permission: newPerm.permission.id });
        } else {
          toBeDeleted.push(newPerm.id);
        }
      }
    }
    return [toBeCreated, toBeDeleted];
  }

  /** Update selected user's permissions. */
  updatePermissions() {
    const diff = this.diffPermissions();
    const toBeCreated = diff[0];
    const toBeDeleted = diff[1];
    if (toBeCreated.length === 0 && toBeDeleted.length === 0) {
      this.snackBar.open('未检测到权限改动，无需保存', '关闭');
      return;
    }
    this.errorMessage = null;
    this.isLoading = true;
    zip(
      this.permissionService.createUserPermissions(toBeCreated),
      this.permissionService.deleteUserPermissions(toBeDeleted),
    ).pipe(
      map(() => true),
      catchError((err: HttpErrorResponse) => {
        this.errorMessage = err.message;
        return observableOf(false);
      }),
    ).subscribe(succeed => {
      this.isLoading = false;
      if (succeed === true) {
        this.retrieveUserPermissions();
        this.snackBar.open('用户权限更新成功', '关闭');
      } else {
        this.snackBar.open('更新失败，请尝试刷新页面并重试!', '关闭');
      }
    });
  }
}
