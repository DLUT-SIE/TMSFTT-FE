import { Injectable } from '@angular/core';
import { GenericListService } from '../generics/generic-list-service/generic-list-service';
import { HttpClient } from '@angular/common/http';
import { ListRequest } from '../interfaces/list-request';
import { Department } from '../interfaces/department';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService extends GenericListService {

  constructor(
    protected readonly http: HttpClient,
  ) {
    super(http);
  }

  getDepartments (req: ListRequest) {
    return this.list<Department>('departments', req);
  }

  getDepartment(id: number) {
    return this.http.get<Department>(`${environment.API_URL}/departments/${id}/`);
  }
}
