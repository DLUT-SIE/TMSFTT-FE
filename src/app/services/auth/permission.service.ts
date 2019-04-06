import { Injectable } from '@angular/core';
import { Observable, zip, throwError, of as observableOf } from 'rxjs';
import { Permission, UserPermission, UserPermissionRequest, UserPermissionStatus } from 'src/app/interfaces/permission';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, switchMap } from 'rxjs/operators';
import { UserService } from './user.service';
import { PaginatedResponse } from 'src/app/interfaces/paginated-response';

/** This service manages Permission objects and UserPermission objects. */
@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(
    private readonly http: HttpClient,
    private readonly userService: UserService,
  ) { }

  /** Retrieve all permission instances. */
  getPermissions(): Observable<Permission[]> {
    // TODO(youchen): Cache to avoid duplicate requests.
    return this.http.get<Permission[]>(`${environment.API_URL}/permissions/`);
  }

  /** Retrieve user's permissions. */
  getUserPermissions(userId: number): Observable<UserPermission[]> {
    return this.http.get<UserPermission[]>(
      `${environment.API_URL}/user-permissions/?user=${userId}`);
  }

  /** Return user's permission status against all permissions. */
  getUserPermissionStatus(username: string): Observable<UserPermissionStatus[]> {
    let userId: number = null;
    return this.userService.getUserByUsername(username).pipe(
      switchMap((res: PaginatedResponse<{ id: number }>) => {
        if (res.count !== 1) return throwError({ message: '系统中无此用户!' });
        userId = res.results[0].id;
        return zip(
          this.getPermissions(),
          this.getUserPermissions(userId),
        );
      }),
      map((val: [Permission[], UserPermission[]], index: number) => {
        // All permissions, Map<permission id, Permission>
        const permissions = new Map<number, Permission>();
        val[0].map(x => permissions.set(x.id, x));
        // User permissions, Map<permission id, UserPermission>;
        const userPermissions = new Map<number, UserPermission>();
        val[1].map(x => userPermissions.set(x.permission, x));
        return val[0].map(x => {
          const userPermissionId = userPermissions.has(x.id) ? userPermissions.get(x.id).id : undefined;
          return {
            id: userPermissionId,
            user: userId,
            permission: x,
            hasPermission: userPermissionId !== undefined,
          };
        }).sort((x, y) => x.permission.id - y.permission.id);
      }),
    );
  }

  createUserPermission(req: UserPermissionRequest) {
    return this.http.post(`${environment.API_URL}/user-permissions/`, req);
  }

  createUserPermissions(reqs: UserPermissionRequest[]) {
    // TODO(youchen): Evaluate the performance cost.
    if (reqs.length === 0) return observableOf([]);
    return zip(...reqs.map(req => this.createUserPermission(req)));
  }

  deleteUserPermission(permissionId: number) {
    return this.http.delete(`${environment.API_URL}/user-permissions/${permissionId}/`);
  }

  deleteUserPermissions(permissionIds: number[]) {
    // TODO(youchen): Evaluate the performance cost.
    if (permissionIds.length === 0) return observableOf([]);
    return zip(...permissionIds.map(id => this.deleteUserPermission(id)));
  }
}
