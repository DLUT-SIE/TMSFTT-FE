import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

import { Program } from 'src/app/shared/interfaces/program';
import { ProgramCategory } from 'src/app/shared/interfaces/program-category';

import { GenericListService } from 'src/app/shared/generics/generic-list-service/generic-list-service';
import { ListRequest } from 'src/app/shared/interfaces/list-request';
import { of as observableOf } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgramService extends GenericListService {

  private cachedProgramCategories: ProgramCategory[] = [];

  constructor(
    protected readonly http: HttpClient,
  ) {
      super(http);
    }

  /** get the information of programs from the background. */
  getPrograms(req: ListRequest) {
    req.limit = -1;
    return this.list<Program[]>('programs', req);
  }

  /** get the information of one program from the background. */
  getProgram(id: number) {
    return this.http.get<Program>(
      `/programs/${id}/`);
  }

  getProgramCategories() {
    if (this.cachedProgramCategories.length !== 0) {
      return observableOf(this.cachedProgramCategories);
    }
    return this.http.get<ProgramCategory[]>(`/program-categories/`).pipe(
      tap(data => this.cachedProgramCategories = data),
    );
  }

  /** create admin-program-form. */
  createProgram(req: Program) {
    return this.http.post<Program>(
      `/programs/`, req);
  }
}
