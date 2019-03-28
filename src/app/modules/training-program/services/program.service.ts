import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { Program } from 'src/app/interfaces/program';
import { PaginatedResponse } from 'src/app/interfaces/paginated-response';

import { GenericListService } from 'src/app/generics/generic-list-service/generic-list-service';
import { ListRequest } from 'src/app/interfaces/list-request';

@Injectable({
  providedIn: 'root'
})
export class ProgramService extend GenericListService{

  constructor(
    private readonly http: HttpClient,
  ) { }

  /** get the information of programs from the background. */
  getPrograms(req: ListRequest) {
    return this.list<Program>('programs', req);
  }

  /** get the information of one program from the background. */
  getProgram(id: number) {
    return this.http.get<Program>(
      `${environment.API_URL}/programs/${id}/`);
  }
}
