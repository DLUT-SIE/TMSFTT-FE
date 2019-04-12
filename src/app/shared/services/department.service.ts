import { Injectable } from '@angular/core';
import { GenericListService } from '../generics/generic-list-service/generic-list-service';
import { HttpClient } from '@angular/common/http';
import { ListRequest } from '../interfaces/list-request';
import { DepartmentResponse } from '../interfaces/department';

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
    return this.list<DepartmentResponse>('departments', req);
  }
}
