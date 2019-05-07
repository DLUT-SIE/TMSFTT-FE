import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/shared/interfaces/user';
import { Group } from 'src/app/shared/interfaces/group';
import { PaginatedResponse } from 'src/app/shared/interfaces/paginated-response';
import { GenericListService } from 'src/app/shared/generics/generic-list-service/generic-list-service';
import { ListRequest } from 'src/app/shared/interfaces/list-request';

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

  getGroupByDepartmentName(name: string) {
    return this.http.get<PaginatedResponse<Group>>(
      `/groups/?name__startswith=${name}`);
  }

  getUserByGroupId(req: ListRequest) {
    return this.list<User>('user-groups', req);
  }

  addUserGroup(userId: number, groupId: number) {
    const data = new FormData();
    data.set('user', userId.toString());
    data.set('group', groupId.toString());
    return this.http.post(`/user-groups/`, data);
  }

  removeUserByUserGroupId(userGroupId: number) {
    return this.http.delete(`/user-groups/${userGroupId}/`);
  }

}
