import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchMap, tap } from 'rxjs/operators';

import { Program } from 'src/app/shared/interfaces/program';
import { ProgramCategory } from 'src/app/shared/interfaces/program-category';

import { GenericListService } from 'src/app/shared/generics/generic-list-service/generic-list-service';
import { DepartmentService } from 'src/app/shared/services/department.service';
import { ListRequest } from 'src/app/shared/interfaces/list-request';
import { Observable, of as observableOf } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgramService extends GenericListService {

  private cachedProgramCategories: ProgramCategory[] = [];

  constructor(
    private readonly departmentService: DepartmentService,
    protected readonly http: HttpClient,
  ) {
      super(http);
    }

  /** get the information of programs from the background. */
  getPrograms(req: ListRequest) {
    return this.list<Program>('programs', req);
  }

  /** get the information of one program from the background. */
  getProgram(id: number) {
    return this.http.get<Program>(
      `/programs/${id}/`);
  }

  getProgramWithDetail(id: number) {
    return this.getDetailProgram(this.getProgram(id));
  }

  private getDetailProgram(program: Observable<Program>) {
    let programWithDetail: Program;
    return program.pipe(
      switchMap((data) => {
        programWithDetail = data;
        return  this.departmentService.getDepartment(data.department);
      }),
      map((data) => {
        programWithDetail.department = data;
        return programWithDetail;
      }),
    );
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
