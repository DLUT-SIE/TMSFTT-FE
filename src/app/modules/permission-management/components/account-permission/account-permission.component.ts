import { Component, OnInit } from '@angular/core';
import { UserPermission, UserPermissionRequest } from 'src/app/interfaces/permission';
import { MatSnackBar } from '@angular/material';
import { PermissionService } from 'src/app/services/auth/permission.service';
import { of as observableOf, zip } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

/** AccountPermissionComponent allows admins modify users' permissions. */
@Component({
  selector: 'app-account-permission',
  templateUrl: './account-permission.component.html',
  styleUrls: ['./account-permission.component.css']
})
export class AccountPermissionComponent implements OnInit {
  username = '';
  isLoading = false;
  errorMessage = null;
  /** The permissions the selected user currently have. */
  originalPermissions: UserPermission[] = [];
  /** The permissions that should be after the change. */
  newPermissions: UserPermission[] = [];

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly permissionService: PermissionService,
  ) {}

  ngOnInit() {
  }

  private reset() {
    this.errorMessage = null;
    this.originalPermissions = [];
    this.newPermissions = [];
  }

  /** Retrieve user permissions and populate the permissions table. */
  retrieveUserPermissions() {
    const username = this.username;
    this.errorMessage = null;
    if (username.length === 0) {
      this.errorMessage = '用户名长度不能为0';
      return;
    }
    this.reset();
    this.isLoading = true;
    this.permissionService.listUserPermissionStatus(username).pipe(
      catchError((err: HttpErrorResponse) => {
        this.errorMessage = err.message;
        return observableOf([]);
      }),
    ).subscribe((permissions: UserPermission[]) => {
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
  private diffPermissions(): [UserPermissionRequest[], number[]] {
    const toBeCreated: UserPermissionRequest[] = [];
    const toBeDeleted: number[] = [];

    for (let i = 0; i < this.originalPermissions.length; i++) {
      const originalPerm = this.originalPermissions[i];
      const newPerm = this.newPermissions[i];
      if (originalPerm.hasPerm !== newPerm.hasPerm) {
        if (newPerm.hasPerm === true) {
          toBeCreated.push({user: newPerm.user, permission_id: newPerm.permission.id});
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
        this.snackBar.open('用户权限更新成功', '关闭');
        this.retrieveUserPermissions();
      } else {
        this.snackBar.open('更新失败，请尝试刷新页面并重试!', '关闭');
      }
    });
  }
}
