import { Component, OnInit, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { of as observableOf, zip } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Group } from 'src/app/shared/interfaces/group';
import { PermissionService } from 'src/app/shared/services/permission.service';
import { GroupPermission, GroupPermissionStatus, Permission } from 'src/app/shared/interfaces/permission';

@Component({
  selector: 'app-department-group-permission',
  templateUrl: './department-group-permission.component.html',
  styleUrls: ['./department-group-permission.component.css']
})
export class DepartmentGroupPermissionComponent implements OnInit {

  @Input() group: Group;

  isLoading = false;
  errorMessage = '';

  /** The permissions the selected group currently have. */
  originalPermissions: GroupPermissionStatus[] = [];
  /** The permissions that should be after the change. */
  newPermissions: GroupPermissionStatus[] = [];

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly permissionService: PermissionService,
  ) {}

  private reset() {
    this.errorMessage = '';
    this.originalPermissions = [];
    this.newPermissions = [];
    this.isLoading = true;
  }


  ngOnInit() {
    this.retrieveGroupPermissions();
  }

  retrieveGroupPermissions() {
    this.reset();
    zip(
      this.permissionService.getPermissions(),
      this.permissionService.getGroupPermissions(this.group.id), ).pipe(
        map((val: [Permission[], GroupPermission[]], index: number) => {
          // All permissions, Map<permission id, Permission>
          const permissions = new Map<number, Permission>();
          val[0].map(x => permissions.set(x.id, x));
          // Group permissions, Map<permission id, GroupPermission>;
          const groupPermissions = new Map<number, GroupPermission>();
          val[1].map(x => groupPermissions.set(x.permission, x));
          return val[0].map(x => {
            const perm = groupPermissions.get(x.id);
            const groupPermissionId = perm ? perm.id : undefined;
            return {
              id: groupPermissionId,
              group: this.group.id,
              permission: x,
              hasPermission: groupPermissionId !== undefined,
            };
          }).sort((x, y) => x.permission.id - y.permission.id);
        }),
        catchError((err: HttpErrorResponse) => {
          this.errorMessage = err.message;
          return observableOf([]);
        }),
      ).subscribe((permissions: GroupPermissionStatus[]) => {
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
  private diffPermissions(): [GroupPermission[], number[]] {
    const toBeCreated: GroupPermission[] = [];
    const toBeDeleted: number[] = [];

    for (let i = 0; i < this.originalPermissions.length; i++) {
      const originalPerm = this.originalPermissions[i];
      const newPerm = this.newPermissions[i];
      if (originalPerm.hasPermission !== newPerm.hasPermission) {
        if (newPerm.hasPermission === true) {
          toBeCreated.push({ group: newPerm.group, permission: newPerm.permission.id });
        } else {
          toBeDeleted.push(newPerm.id);
        }
      }
    }
    return [toBeCreated, toBeDeleted];
  }

  /** Update selected group's permissions. */
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
      this.permissionService.createGroupPermissions(toBeCreated),
      this.permissionService.deleteGroupPermissions(toBeDeleted),
    ).pipe(
      map(() => true),
      catchError((err: HttpErrorResponse) => {
        this.errorMessage = err.message;
        return observableOf(false);
      }),
    ).subscribe(succeed => {
      this.isLoading = false;
      if (succeed === true) {
        this.retrieveGroupPermissions();
        this.snackBar.open('用户权限更新成功', '关闭');
      } else {
        this.snackBar.open('更新失败，请尝试刷新页面并重试!', '关闭');
      }
    });
  }

}
