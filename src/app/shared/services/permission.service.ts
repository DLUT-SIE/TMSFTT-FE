import { Injectable } from '@angular/core';
import { Observable, zip, of as observableOf } from 'rxjs';
import { Permission, UserPermission, GroupPermission } from '../interfaces/permission';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';

/** This service manages Permission objects and UserPermission objects. */
@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private permissions: Permission[] = [];

  constructor(
    private readonly http: HttpClient,
  ) { }

  /** Retrieve all permission instances. */
  getPermissions(): Observable<Permission[]> {
    // TODO(youchen): Cache to avoid duplicate requests.
    if (this.permissions.length !== 0) {
      return observableOf(this.permissions);
    }
    return this.http.get<Permission[]>(`${environment.API_URL}/permissions/?limit=-1`).pipe(
      tap((permissions: Permission[]) => {
        this.permissions = permissions;
      })
    );
  }

  /** Retrieve user's permissions. */
  getUserPermissions(userId: number): Observable<UserPermission[]> {
    return this.http.get<UserPermission[]>(
      `${environment.API_URL}/user-permissions/?user=${userId}&limit=-1`);
  }

  createUserPermission(req: UserPermission) {
    return this.http.post(`${environment.API_URL}/user-permissions/`, req);
  }

  createUserPermissions(reqs: UserPermission[]) {
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

  getGroupPermissions(groupId: number): Observable<GroupPermission[]> {
    return this.http.get<GroupPermission[]>(
      `${environment.API_URL}/group-permissions/?group=${groupId}&limit=-1`);
  }
}
