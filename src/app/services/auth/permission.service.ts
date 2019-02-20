import { Injectable } from '@angular/core';
import { Observable, zip, throwError } from 'rxjs';
import { Permission, UserPermission, UserPermissionRequest } from 'src/app/interfaces/permission';
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
  getAllPermissions(): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${environment.API_URL}/permissions/`);
  }

  /** Retrieve user's permissions. */
  listUserPermissions(userId: number): Observable<UserPermission[]> {
    return this.http.get<UserPermission[]>(
      `${environment.API_URL}/user-permissions/?user=${userId}`).pipe(
        map((permissions: UserPermission[]) => {
          return permissions.map(x => {
            x.hasPerm = true;
            return x;
          });
        }),
      );
  }

  /** Return user's permission status against all permissions. */
  listUserPermissionStatus(username: string): Observable<UserPermission[]> {
    let userId: number = null;
    return this.userService.getUserByUsername(username).pipe(
      switchMap((res: PaginatedResponse<{id: number}>) => {
        if (res.count !== 1) return throwError({message: '系统中无此用户!'});
        userId = res.results[0].id;
        return zip(
          this.getAllPermissions(),
          this.listUserPermissions(userId),
        );
      }),
      map((val: [Permission[], UserPermission[]], index: number) => {
        const allPermissions = val[0];
        const userPermissions = val[1];
        const perms = new Map<string, UserPermission>();
        userPermissions.map(x => perms.set(x.permission.codename, x));
        return allPermissions.map(x => {
          const permId = perms.has(x.codename) ? perms.get(x.codename).id : undefined;
          return {
            id: permId,
            user: userId,
            permission: x,
            hasPerm: permId !== undefined,
          } as UserPermission;
        });
      }),
    );
  }

  createUserPermission(req: UserPermissionRequest) {
    return this.http.post(`${environment.API_URL}/user-permissions/`, req);
  }

  createUserPermissions(reqs: UserPermissionRequest[]) {
    // TODO(youchen): Evaluate the performance cost.
    return zip(...reqs.map(req => this.createUserPermission(req)));
  }

  deleteUserPermission(permissionId: number) {
    return this.http.delete(`${environment.API_URL}/user-permissions/${permissionId}/`);
  }

  deleteUserPermissions(permissionIds: number[]) {
    // TODO(youchen): Evaluate the performance cost.
    return zip(...permissionIds.map(id => this.deleteUserPermission(id)));
  }
}
