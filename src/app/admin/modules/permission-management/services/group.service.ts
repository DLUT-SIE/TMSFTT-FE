import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
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
    return this.http.get<Group>(`${environment.API_URL}/groups/${id}/`);
  }

  getGroupByDepartmentName(name: string) {
    return this.http.get<PaginatedResponse<Group>>(
      `${environment.API_URL}/groups/?name__startswith=${name}`);
  }
}
