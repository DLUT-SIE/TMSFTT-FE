import { Injectable } from '@angular/core';
import { GenericListService } from '../generics/generic-list-service/generic-list-service';
import { HttpClient } from '@angular/common/http';
import { ListRequest } from '../interfaces/list-request';
import { Department } from '../interfaces/department';
import { PaginatedResponse } from '../interfaces/paginated-response';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService extends GenericListService {

  constructor(
    protected readonly http: HttpClient,
  ) {
    super(http);
  }

  getDepartments(req: ListRequest) {
    return this.list<PaginatedResponse<Department>>('departments', req);
  }

  getDepartment(id: Department|number) {
    return this.http.get<Department>(`/departments/${id}/`);
  }

  getTopLevelDepartments() {
    return this.http.get<Department[]>(`/departments/top-level-departments/`);
  }
}
