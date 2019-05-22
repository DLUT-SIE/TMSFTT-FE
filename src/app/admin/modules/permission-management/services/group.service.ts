import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/shared/interfaces/user';
import { Group } from 'src/app/shared/interfaces/group';
import { PaginatedResponse } from 'src/app/shared/interfaces/paginated-response';
import { GenericListService } from 'src/app/shared/generics/generic-list-service/generic-list-service';
import { ListRequest } from 'src/app/shared/interfaces/list-request';
import { of as observableOf } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupService extends GenericListService {

  constructor(
    protected readonly http: HttpClient,
  ) {
    super(http);
  }

  getGroupById(id: number) {
    return this.http.get<Group>(`/groups/${id}/`);
  }

  getGroupsByIds(ids: number[]) {
    if (ids.length === 0) return observableOf([]);

    const extraParams = new Map<string, string>();
    extraParams.set('id__in', ids.toString());
    const limit = -1;

    return this.list<Group[]>('groups', {limit, extraParams});
  }

  getGroupByDepartmentName(name: string) {
    return this.http.get<PaginatedResponse<Group>>(
      `/groups/?name__startswith=${name}`);
  }

  getGroupsByTopDepartmentId(id: number) {
    return this.http.get<Group[]>(
      `/groups/top-department-related-groups/?department_id=${id}`);
  }

  getUsersByGroupId(req: ListRequest) {
    return this.list<PaginatedResponse<User>>('user-groups', req);
  }

  addUserGroup(userId: number, groupId: number) {
    return this.http.post(`/user-groups/`, {user: userId, group: groupId});
  }

  removeUserByUserGroupId(userGroupId: number) {
    return this.http.delete(`/user-groups/${userGroupId}/`);
  }

}
