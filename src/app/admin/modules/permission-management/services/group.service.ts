import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Group } from 'src/app/shared/interfaces/group';
import { PaginatedResponse } from 'src/app/shared/interfaces/paginated-response';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(
    private readonly http: HttpClient,
  ) { }

  getGroupById(id: number) {
    return this.http.get<Group>(`/groups/${id}/`);
  }

  getGroupByDepartmentName(name: string) {
    return this.http.get<PaginatedResponse<Group>>(
      `/groups/?name__startswith=${name}`);
  }
}
